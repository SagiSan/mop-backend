var express = require("express");
var router = express.Router();
var db = require("../db.js");
var auth = require("../services/Auth")

// router.use(auth);

const errorCatcher = (res, sendFullError) => (error) => {
  console.error("Got error: " + JSON.stringify(error));
  if (!res.headersSent) {
    res.status(400);
    if (sendFullError) {
      res.json(error);
    } else {
      res.json({});
    }
  };
}

router.get("/", (req, res) => {
  db.Questionnaire.findAll({
    include: [{
      association: db.Questionnaire.Questions,
      include: [db.Question.Choices]
    }]
  })
    .then(results => {
      res.json(results);
    })
    .catch(errorCatcher(res));
});

router.post("/create", (req, res, next) => {
  const questionnaire = req.body;
  db.Questionnaire.create(req.body, {
    include: [{
      association: db.Questionnaire.Questions,
      include: [db.Question.Choices]
    }]
  }).then(() => {
    res.json("OK");
  })
    .catch(errorCatcher(res, true));
});

module.exports = router;