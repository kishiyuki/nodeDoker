var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	let obj;
	obj = {
		status:200
	  };
	  res.json(obj);
});


module.exports = router;
