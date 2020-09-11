const express = require('express');
const router = express.Router();

const api = require('./api/index');
const pages = require('./pages/index');

router.use(express.static('public'));

router.use('/api', api);
router.use('/', pages);

module.exports = router;