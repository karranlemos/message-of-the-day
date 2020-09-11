const express = require('express');

const authHelpers = require('./helpers/auth');

const router = express.Router();

router.get(
    '/',
    authHelpers.ensureNotAuthenticated,
    (req, res) => res.render('index')
);

router.get(
    '/register',
    authHelpers.ensureNotAuthenticated,
    (req, res) => res.render('register')
);

router.get(
    '/dashboard',
    authHelpers.ensureAuthenticated,
    (req, res) => res.render('dashboard')
);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;