const express = require('express');
const router = express.Router();

const messagesAPI = require('./messages');
const usersAPI = require('./users');

router.use('/messages', messagesAPI);
router.use('/users', usersAPI);

router.use((req, res) => {
    res.status(404).json({message: 'Not Found.'});
});

module.exports = router;