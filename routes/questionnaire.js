var express = require("express");
var router = express.Router();
var db = require("../db.js");
var auth = require("../services/Auth")

router.use(auth);

const errorCatcher = (res, sendFullError) => (error) => {
  console.error("Got error: " + JSON.stringify(error));
  if (!res.headersSent) {
    res.status(400);
    if (sendFullError) {
      res.send(error);
    } else {
      res.send();
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
      res.send(results);
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
    res.send("OK");
  })
    .catch(errorCatcher(res, true));
});

module.exports = router;