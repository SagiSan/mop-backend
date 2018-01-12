var express = require("express");
var router = express.Router();
var connection = require("../db.js");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

async function createQuestions(questionnaire) {
  var promises = [];
  for (const question of questionnaire.questions) {
    var promise = new Promise((resolve, reject) => {
      connection.query({
        query: "INSERT INTO question (question, type, questionnaireID) VALUES (?, ?, ?)",
        values: [question.question, question.type, questionnaire.id]
      }, (error, results, fields) => {
        if (error) {
          console.error("SQL ERROR: " + error);
          reject("SQL ERROR");
          return;
        }
        question.id = results.id;
        resolve();
      });
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

async function createQuestionnaire(questionnaire) {
  var ret = new Promise((resolve, reject) => {
    connection.beginTransaction();
    connection.query(
      {
        sql: "INSERT INTO questionnaire (title) VALUES (?)",
        values: [questionnaire.title]
      },
      (error, results, fields) => {
        if (error) {
          console.error("SQL ERROR: " + error);
          reject("SQL ERROR");
          return;
        }
        questionnaire.id = results.id;
        // createQuestions(questionnaire);
        resolve();
      });
    connection.commit();
  });
  return ret;
}

router.post("/create", (req, res, next) => {
  const questionnaire = req.body;
  createQuestionnaire(questionnaire);

  res.send();
});

module.exports = router;
