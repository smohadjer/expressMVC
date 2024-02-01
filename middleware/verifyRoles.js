// this is a configurable middleware
// https://expressjs.com/en/guide/writing-middleware.html
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        console.log(allowedRoles);
        console.log(req.roles);
        const result = req.roles.map(role => allowedRoles.includes(role)).find(value => value === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;
