const express = require('express');
const router = express.Router();

const messagesAPI = require('./api/messages');
const usersAPI = require('./api/users');

router.use('/api/messages', messagesAPI);
router.use('/api/users', usersAPI);

router.get('/', (req, res) => {
    res.send('hello there');
});

module.exports = router;