/**
 * Created by edsan on 3/2/16.
 */
var express = require('express');
var router = express.Router();

exports.index = function(req, res){
    res.render('index');
};
module.exports = router;