const db = require('../models');
const axios = require("axios");
const cheerio = require("cheerio");

const controller = {
    home: (req, res) => {
        db.Article.find({})
            .then(dbArticle => {
                res.render("index", { articles: dbArticle });
            })
            .catch(err => {
                console.log(err);
            })
    },
    scrape: (req, res) => {
        axios.get("https://www.reddit.com/r/news/").then(response => {
            let $ = cheerio.load(response.data);

            $("div").find($("._1poyrkZ7g36PawDueRza-J")).each((i, ele) => {
                let result = {};

                // console.log($(ele).children("a"));

                result.headline = $(ele).find("h3").text();
                result.url = $(ele).find($(".b5szba-0")).attr("href");

                axios.get("https://www.reddit.com/" + $(ele).find($(".SQnoC3ObvgnGjWt90zD9Z")).attr("href"))
                .then(respon => {
                    let r = cheerio.load(respon.data);
                    result.summary = r("div.comment").get(0).children[2].children[1].children[1].children[0].children[0].children[0].data;
                    db.Article.findOne({url: result.url})
                    .then(dbArticle => {
                        if (!dbArticle) {
                            db.Article.create(result)
                            .then(db => {
                                // console.log(dbArticle);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                });
            });
            setTimeout(() => {
                res.send("done");
            }, 2500);
        });
    },
    addComment: (req, res) => {
        db.Note.create(req.body)
            .then(dbNote => {
                db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: {note: dbNote._id}})
                .then(() => {
                    console.log("Added Comment");
                    res.json({status: 200});
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getComment: (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate({
                path: "note",
                options: {
                    sort: {
                        date: -1
                    }
                }
            })
            .then(dbArticle => {
                console.log(dbArticle);
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    },
    deleteComment: (req, res) => {
        db.Note.deleteOne({ _id: req.params.id })
        .then(data => {
            console.log(req.body.id);
            db.Article.update({ _id: req.body.id }, { $pull: { note: [req.params.id] } })
            .then(data => {
                res.json({ status: 200 });
            })
            .catch(err => {
                res.json(err);
            });
        })
        .catch(err => {
            res.json(err);
        });
    }
}

module.exports = controller;