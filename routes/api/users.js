const express = require('express');
const passport = require('passport');

const Users = require('../../model/Users');
const authHelpers = require('./helpers/auth');

const router = express.Router();
const users = Users.getInstance();

router.post(
    '/login',
    authHelpers.ensureNotAuthenticated,
    authHelpers.ensureCredentialsAvailable({
        username: true,
        password: true
    }),
    async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return res.status(500).send();
            
            if (!user) {
                if (!info)
                    return res.status(500).json({message: 'Internal Server Error'});
                
                const reason = info.reason || false;
                switch (reason) {
                    case 'username':
                        return res.status(400).json({message: info.message});
                    case 'password':
                        return res.status(401).json({message: info.message});
                }
                
                if (info.message)
                    return res.status(400).json({message: info.message});

                return res.status(500).json({message: 'Internal Server Error'});
            }
            
            req.logIn(user, (err) => {
                if (err) return next(err);

                return res.json({message: 'Logged in successfully!'});
            });
        }
    )(req, res, next);
});

router.post('/register', 
    authHelpers.ensureNotAuthenticated,
    authHelpers.ensureCredentialsAvailable({
        username: true,
        password: true,
        email: true,
    }),
    authHelpers.validateRegistration,
    async (req, res) => {
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
    }
);

router.post(
    '/logout',
    (req, res) => {
        req.logout();
        res.json({message: 'Logged out successfully!'});
    }
)

module.exports = router;