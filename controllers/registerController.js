const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json('username and password are required');
    }

    if (usersDB.users.length > 0) {
        const duplicateUser = usersDB.users.find(person => person.username === username);
        if (duplicateUser) {
            return res.sendStatus(409); //Conflict
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username,
            roles: { 'User': 2001 },
            password: hashedPassword
        }
        const users = usersDB.users.length ? [...usersDB.users, newUser] : [newUser];
        usersDB.setUsers(users);
        fs.writeFileSync(
            path.join('__dirname', '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        return res.status(201).json(usersDB.users);
    } catch(err) {
        console.error(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = { handleNewUser };
