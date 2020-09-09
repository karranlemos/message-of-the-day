if (process.env.NODE_ENV.trim() === 'development') {
    require('dotenv').config();
}

const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const path = require('path');

const messagesAPI = require('./routes/api/messages');
const usersAPI = require('./routes/api/users');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressSession({
    secret: process.env.NODE_ENV,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/messages', messagesAPI);
app.use('/api/users', usersAPI);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));