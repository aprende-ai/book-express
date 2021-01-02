const express = require('express');
const router = express.Router();

router.use('/autores', require('./autores'));
router.use('/editoras', require('./editoras'));
router.use('/livros', require('./livros'));

module.exports = router;
