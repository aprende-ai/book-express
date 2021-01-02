const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

const publicPath = path.join(process.cwd(),'app');

router.use(bodyParser.json());

router.use(express.static(publicPath));
router.use('/api', require('./api'));

module.exports = router;
