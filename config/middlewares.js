const express = require('express');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const passport = require('passport');

module.exports = (app) => {
    require('./passport')(passport);

    app.use(expressLayouts);
    app.set('view engine', 'ejs');
    app.set('layout', 'layouts/layout');

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(expressSession({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());

    app.use((req, res, next) => {
        if (req.isAuthenticated())
            res.cookie(
                'userdata',
                JSON.stringify({
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email
                }),
                {
                    maxAge: 365*24*60*60
                }
            );
        else
            res.clearCookie('userdata');
        
        next();
    })

    app.use((err, req, res, next) => {
        req.logout();
        return res.status(err.status || 500).render('error', {
            error: 'Internal Server Error'
        });
    })
}