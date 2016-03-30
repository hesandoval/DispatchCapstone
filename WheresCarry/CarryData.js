/**
 * Created by edsan on 3/18/16.
 */

var r = require("./rethink");
//var _ = require("lodash");

function setup(io){

    io.on("connection", function(socket) {
        console.log("User connected to the page");
        //r.connect({host: 'localhost', port: 28015}, function (err, conn) {
        //    if (err) throw err;
        //    connection = conn;
        //    r.table('wheres_carry').filter(r.row('sender').eq('Carry1')).run(connection, function(err, cursor){
        //        if (err) throw err;
        //        cursor.toArray(function(err, result){
        //            if (err) throw err;
        //            console.log(JSON.stringify(result, null, 2));
        //        });
        //    });
        //});
        socket.on("carry:getFleet", function(callback){
            r.table("wheres_carry")
                .pluck({carry_data_current: "sender"})
                .distinct()
                .run(callback);
        });

        socket.on('carry:findTripsByCarryID', function(id, callback){
            r.table('wheres_carry').orderBy(r.desc('created'))
                .filter({carry_data_current:{"sender":id}})
                .pluck({carry_data_current: ["trip_id", "completed"]})
                .distinct().run(callback);
        });

        socket.on("carry:tripDetailsByTripID", function(tripID, callback){
            r.db("dispatch").table('wheres_carry')
                .filter({carry_data_current:{"trip_id":tripID}})
                .orderBy(r.desc('created')).run(function(err, data){
                if(err){
                    console.log(err);
                }else{
                    var first = data[0];
                    var last = data[data.length-1];
                    var newData = [first, last];
                    function historicalDataSpecs(first, last){
                        first.toString().split(",");
                        last.toString().split(",");
                        first_lat = first[0];
                        first_long = first[1];
                        last_lat = last[0];
                        last_long = last[1];
                        var fs = require('fs');
                        var filename = '../SupportFiles/historicalDataSpecifications.json';
                        var file = require(filename);
                        file.key = " Starting Lat: " + first_lat + "\n Starting Long: " + first_long + "\n Ending Lat: " + last_lat + "\n Ending Long: " + last_long;
                        fs.writeFile(fileName, JSON.stringify(file), function (err) {
                            if (err) return console.log(err)
                            console.log(JSON.stringify(file))
                            console.log('writing to ' + fileName)
                        });
                    };
                    callback(newData)
                }
            });
        });

        socket.on('carry:chages:start', function(data){
            var filter = data.filter || {};
            r.table('wheres_carry').orderBy({index: r.desc('created')})
                .filter(filter).changes().run({cursor: true}, handleChange);

            function handleChange(error, cursor){
                if (error){
                    console.log(error);
                }else{
                    if(cursor){
                        cursor.each(function(err, record){
                            if(err){
                                console.log(err);
                            }else{
                                socket.emit("carry:changes", record);
                            }
                        });
                    }
                }

                socket.on('carry:changes:stop', stopCursor);

                socket.on("disconnect", stopCursor);

                function stopCursor(){
                    if(cursor){
                        cursor.close();
                    }
                    socket.removeListener("carry:changes:stop", stopCursor)
                    socket.removeListener("disconnect", stopCursor)
                }
            }
        });
    });

}

module.exports = {
    setup: setup
};