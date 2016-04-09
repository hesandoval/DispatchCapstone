var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var socketio = require('socket.io');
var hogan = require('hogan-express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var carry = require("./CarryData");


var routes = require('./routes/index');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', hogan);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


var server = http.createServer(app);
//creates  server on specified port using html as the 'view engine'

var io = socketio(server);

carry.setup(io);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//io.on("connection", function(socket) {
//    console.log("User connected to the page");
//    r.connect({host: 'localhost', port: 28015}, function (err, conn) {
//        if (err) throw err;
//        connection = conn;
//        r.table('wheres_carry').filter(r.row('sender').eq('Carry1')).run(connection, function(err, cursor){
//            if (err) throw err;
//            cursor.toArray(function(err, result){
//                if (err) throw err;
//                console.log(JSON.stringify(result, null, 2));
//            });
//        });
//    });
//});

//r.connect({host:'localhost', port:28015}, function(err, conn){
//    if(err) throw err;
//    connection = conn;
//});
//
//r.table('test').changes().run(connection, function(err, cursor){
//    if(err) throw err;
//    //cursor.toArray(function(err,row){
//    cursor.each(function(err,row){
//        if(err) throw err;
//        console.log(JSON.stringify(row,null,2));
//        io.socket.emit('update-msg', {data: 'this is the data'}); //change and add update messages depending on what field will be updated in the html
//    });
//});

/*
var tid = document.getElementById("TripNumber).value;

r.table('test').filter(r.row('trip_id').eq(tid)).run(connection, function(err, cursor){
if(err) throw err;
cursor.toArray(function(err,result){
if(err) throw err;
});
});
*/
