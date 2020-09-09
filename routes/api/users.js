const express = require('express');
const Users = require('../../model/users');

const router = express.Router();
const users = Users.getInstance();

router.post('/login', (req, res) => {
    if (!req.body || !req.body.username || !req.body.password)
        return res.status(400).json({
            message: "'username' and 'password' must be provided..."
        });
    const username = req.body.username;
    const password = req.body.password;
    users.getUser({username: username})
        .then(({type, data}) => {
            if (type === 'error')
                return res.status(400).json({
                    message: data
                });
            console.log(data);
            return res.json({
                message: 'Logged in successfully!'
            });
        })
        .catch(err => {
            return res.status(500).send();
        })
});

router.post('/register', async (req, res) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.email)
        return res.status(400).json({
            message: "'username', 'password' and 'email' must be provided..."
        });
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        await users.registerUser(username, email, password);
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(400).json({
                message: "User already exists"
            });
        return res.status(500).send();
    }
    return res.status(201).send();
});

module.exports = router;