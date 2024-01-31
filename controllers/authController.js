const bcrypt = require('bcrypt');
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json('username and password are required');
    }

    const foundUser = usersDB.users.find(person => person.username === username);
    if (!foundUser) {
        return res.sendStatus(401); //Unauthorized
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create jwt
        const accessToken = jwt.sign(
            {'username': foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        //Saving refreshToken with current user so we can revoke it when user logs out
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        fs.writeFileSync(
            path.join('__dirname', '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.json({ accessToken });
    } else {
        return res.sendStatus(401); //Unauthorized
    }
}

module.exports = { handleLogin };
