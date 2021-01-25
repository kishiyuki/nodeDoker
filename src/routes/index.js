var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		res.redirect("http://localhost/mypage");
	} else {
		res.redirect("http://localhost/signin");
	}
});

module.exports = router;