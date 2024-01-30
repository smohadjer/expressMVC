const bcrypt = require('bcrypt');
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

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
        return res.status(400).json({
            'success': `Usesr ${username} is logged in!`
        });
    } else {
        return res.sendStatus(401); //Unauthorized
    }
}

module.exports = { handleLogin };
