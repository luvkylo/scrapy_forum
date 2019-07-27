const express = require("express");
const router = express.Router();
const application_controller = require('../controllers/articles_controller.js');


router.get('/', application_controller.home);
router.get("/scrape", application_controller.scrape);
router.get("/notes/:id", application_controller.getComment);
router.delete("/notes/:id", application_controller.deleteComment);
router.post("/notes/:id", application_controller.addComment);

module.exports = router;