var jwt = require('jsonwebtoken');

module.exports = {
    create: function (user, cb) {
        jwt.sign({ user }, "secretkeyyzz",
            {
                algorithm: "HS256",
                expiresIn: 31556926000,
                issuer: "mop",
                audience: "mop"
            },
            function (err, token) {
                return cb(err, token);
            }
        );
    },
    decode: function (token, cb) {
        jwt.verify(token, "secretkeyyzz", function (err, decoded) {
            return cb(err, decoded);
        });
    }
};