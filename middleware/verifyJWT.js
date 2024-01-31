const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token); //Bearer token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.error(err);
            if (err) return res.sendStatus(403);
            //req.user = decoded.username;
            next();
        }
    )
};

module.exports = verifyJWT;
