var express = require('express'),
    router = express.Router();

//index the controllers
router.use('/dbapi', require('./dbapi'))

module.exports = router;
