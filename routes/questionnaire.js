var express = require("express");
var router = express.Router();
var db = require("../db.js");
/*
function createChoices(question, connection) {
  var promises = [];
  for (const choice of question.choices) {
    var promise = new Promise((resolve, reject) => {
      connection.query({
        sql: "INSERT INTO choice (answer, questionID) VALUES (?, ?)",
        values: [choice, question.id]
      }, (error, results, fields) => {
        if (error) {
          console.error("SQL ERROR CREATING CHOICES: " + error);
          reject("SQL ERROR");
          return;
        }
        resolve();
      } );
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

function createQuestions(questionnaire, connection) {
  var promises = [];
  for (const question of questionnaire.questions) {
    var promise = new Promise((resolve, reject) => {
      connection.query({
        sql: "INSERT INTO question (question, type, questionnaireID) VALUES (?, ?, ?)",
        values: [question.question, question.type, questionnaire.id]
      }, (error, results, fields) => {
        if (error) {
          console.error("SQL ERROR CREATING QUESTIONS: " + error);
          reject("SQL ERROR");
          return;
        }
        question.id = results.insertId;
        if (question.choices) {
          createChoices(question, connection).catch(reject).then(resolve);
        } else {
          resolve();
        }
      });
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

function createQuestionnaire(questionnaire, connection) {
  var ret = new Promise((resolve, reject) => {
    connection.beginTransaction();
    connection.query(
      {
        sql: "INSERT INTO questionnaire (title) VALUES (?)",
        values: [questionnaire.title]
      },
      (error, results, fields) => {
        if (error) {
          console.error("SQL ERROR CREATING QUESTIONNAIRE: " + error);
          reject("SQL ERROR");
          return;
        }
        questionnaire.id = results.insertId;
        createQuestions(questionnaire, connection).catch(reject).then(resolve);
      });
  });
  return ret.then(connection.commit.bind(connection), connection.rollback.bind(connection));
}

const errorCatcher = (error) => {
  console.error("Got error: " + error);
  if (!res.headersSent) {
    res.status(400).send(error);
  };
}


function getChoices(connection, question) {
  return new Promise((resolve, reject) => {
    connection.query({
      sql: "SELECT * FROM choice WHERE questionID = ?",
      values: [question.id]
    }, (error, results, fields) => {
      if (error) {
        console.error("SQL ERROR GETTING CHOICES FOR QUESTION " + question + ": " + error);
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

function getQuestions(connection, questionnaire) {
  return new Promise((resolve, reject) => {
    connection.query({
      sql: "SELECT * FROM question WHERE questionnaireID = ?",
      values: [questionnaire.id]
    }, async (error, results, fields) => {
      if (error) {
        console.error("SQL ERROR GETTING QUESTIONS FOR " + questionnaire + ": " + error);
        reject(error);
        return;
      }
      for (const question of results) {
        question.choices = await getChoices(connection, question);
      }
      resolve(results);
    });
  });
}

function getQuestionnaires(connection) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM questionnaire", async (error, results, fields) => {
      if (error) {
        console.error("SQL ERROR GETTING QUESTIONNAIRES: " + error);
        reject(error);
        return;
      }
      for (let questionnaire of results) {
        questionnaire.questions = await getQuestions(connection, questionnaire);
      }
      resolve(results);
    });
  });
}

router.post("/create", (req, res, next) => {
  const questionnaire = req.body;
  const connection = connectionCreator(errorCatcher);
  createQuestionnaire(questionnaire, connection)
    .catch(errorCatcher)
    .then(() => {
      connection.end();
      res.send("OK");
    });
});

router.get("/", async (req, res, next) => {
  const connection = connectionCreator(errorCatcher)
  res.send(await getQuestionnaires(connection));
});*/

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
      include: [ db.Question.Choices ]
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
      include: [ db.Question.Choices ]
    }]
  }).then(() => {
    res.send("OK");
  })
  .catch(errorCatcher(res, true));
});

module.exports = router;
