const express = require('express');

const authHelpers = require('./helpers/auth');

const router = express.Router();

router.get(
    '/',
    authHelpers.ensureNotAuthenticated,
    (req, res) => res.render('index', {layout: 'layouts/entry-layout'})
);

router.get(
    '/register',
    authHelpers.ensureNotAuthenticated,
    (req, res) => res.render('register', {layout: 'layouts/entry-layout'})
);

router.get(
    '/dashboard',
    authHelpers.ensureAuthenticated,
    (req, res) => res.render('dashboard', {id: req.user.id})
);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;