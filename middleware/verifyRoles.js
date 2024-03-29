// this is a configurable middleware. by using a closure around middleware
// we can send parameters to middleware. see here for more:
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
