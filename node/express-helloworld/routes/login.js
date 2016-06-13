var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('login', { 
  	title: 'login page',
  	userid: req.body.userid,
  	pwd: req.body.password
  });
});

module.exports = router;
