/**
 * Created by edsan on 3/2/16.
 */

var express = require('express');
var router = express.Router();
var r = require("../rethink.js");

router.get('/', function(req, res){
    res.render('index.html');
});

module.exports = router;