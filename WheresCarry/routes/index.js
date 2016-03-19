/**
 * Created by edsan on 3/2/16.
 */
<<<<<<< HEAD
var express = require('express');
var router = express.Router();


=======

var express = require('express');
var router = express.Router();

>>>>>>> master
router.get('/', function(req, res){
    res.render('index.html');
});

module.exports = router;