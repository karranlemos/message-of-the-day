const express = require('express');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');

module.exports = (app) => {
    require('./passport')(passport);

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(expressSession({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(expressLayouts);
    app.set('view engine', 'ejs');
    app.set('layout', 'layouts/layout');
}