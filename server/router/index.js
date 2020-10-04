const express = require('express');
const router = express.Router();
const path = require('path');

const publicPath = path.join(process.cwd(),'app');
router.use(express.static(publicPath))

module.exports = router;
