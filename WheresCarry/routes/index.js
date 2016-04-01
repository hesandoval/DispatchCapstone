/**
 * Created by edsan on 3/2/16.
 */

var express = require('express');
var router = express.Router();
var r = require("../rethink.js");
var config = require("../config.js");

router.get('/', function(req, res){
    res.render('index.html', {API:config.API});
});

module.exports = router;