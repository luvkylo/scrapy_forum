require("dotenv").config();
const mongoose = require("mongoose");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const connection = mongoose.connect(MONGODB_URI, { useNewUrlParser: true,  useFindAndModify: false });

module.exports = connection;