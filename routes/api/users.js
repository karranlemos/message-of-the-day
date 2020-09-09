const express = require('express');
const Users = require('../../model/users');

const router = express.Router();
const users = Users.getInstance();

router.post('/login', async (req, res) => {
    if (!req.body || !req.body.username || !req.body.password)
        return res.status(400).json({
            message: "'username' and 'password' must be provided..."
        });
    const username = req.body.username;
    const password = req.body.password;

    const authentication = await users.authenticateUser(username, password);

    if (!authentication.authenticated) {
        switch (authentication.reason) {
            case 'username':
                return res.status(400).json({
                    message: "Username doesn't exist..."
                });
            case 'password':
                return res.status(401).json({
                    message: "Wrong password..."
                });
            case 'internal error':
            default:
                return res.status(500).send();
        }
    }

    return res.json({
        message: 'Logged in successfully!'
    });
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
        var user = await users.getUser({
            username,
            email
        });
    }
    catch {
        return res.status(500).send();
    }
    
    if (user.type === 'success') {
        let message;
        if (user.data.username === username)
            message = 'Username already exists...';
        else if (user.data.email === email)
            message = 'Email already exists...';
        return res.status(400).json({
            message: message
        });
    }

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