var express = require('express');
var path = require('path');
var http = require('http');
var app = express();
var r = require('rethinkdb');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));


var server = http.Server(app);
//var server = http.createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//io.on('connection', function(socket){
io.on('connection', function(socket) {
    console.log("User connected to the page");
    console.log("Socket: " +socket);
    //var connection = null;
    //r.connect({host: 'localhost', port: 28015}, function (err, conn) {
    //    if (err) throw err;
    //    connection = conn;
    //    r.table('test').filter(r.row('sender').eq('Carry1')).run(connection, function(err, cursor){
    //        if (err) throw err;
    //        cursor.toArray(function(err, result){
    //          if (err) throw err;
    //            console.log(JSON.stringify(result, null, 2));
    //        });
    //    });
    //});
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});