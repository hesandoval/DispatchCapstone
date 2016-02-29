var app = require("express")();
var mysql = require("mysql")();
var http = require('http').Server(app);
var io = require("socket.io").listen(3000);

var speed;
var timestamp;
var latitude_s;
var longitude_s;
var elevation_s;
var latitude_e;
var longitude_e;
var elevation;
var sender;
var battery_life;
var leftOpen = false;
var rightOpen = false;
var frontOn = false;
var backOn = false;
var picture;
var packageID;

var pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    database : 'test',
    table : 'table1',
    speed : 0,
    timestamp : 0,
    latitude_s : 0,
    longitude_s : 0,
    elevation_s : 0,
    latitude_e : 0,
    longitude_e : 0,
    elevation : 0,
    sender : 0,
    battery_life : 0,
    leftOpen : false,
    rightOpen : false,
    frontOn : false,
    backOn : false,
    picture,
    packageID
});

app.get("/", function(req,res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
    
})

http.listen(3000, function(){
    consol.log("Listens for 3000");
});