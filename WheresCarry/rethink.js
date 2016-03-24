/**
 * Created by edsan on 3/18/16.
 */
var rethink = require('rethinkdbdash');
var r = rethink({db:'dispatch', host: 'localhost', port: 28015});

module.exports = r;