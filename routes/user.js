var express = require("express");
var router = express.Router();
var db = require("../db.js");
var token = require("../services/Token");

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

router.get("/login", (req, res) => {
    db.User.findOne(req.body)
        .then(results => {
            token.create(user, (err, token) => {
                res.send(token);
            })
        })
        .catch(errorCatcher(res));
});

router.post("/register", (req, res, next) => {
    let user = req.body;
    user.isAdmin = false;
    db.User.create(user).then((userCreated) => {
        res.send(userCreated);
    })
        .catch(errorCatcher(res, true));
});

module.exports = router;