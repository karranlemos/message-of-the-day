const express = require('express');
const router = express.Router();

const api = require('./api/index');
const pages = require('./pages/index');

router.use('/api', api);
router.use('/', pages);

module.exports = router;