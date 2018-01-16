module.exports = function (req, res, next) {
    let auth = req.headers.authorization;
    if (!auth) {
        res.status(403);
        return res.json({ err: "not logged in" });
    }
    auth = auth.split(' ');
    if (auth[0] !== "Bearer") {
        res.status(403);        
        return res.json({ err: "unsupported authentication type" });
    }
    decoder.decodeToken(auth[1], (err, decoded) => {
        res.status(403);        
        if (err) return res.json({ err: "invalid token" });
        req.user = decoded;
        return next();
    });
};