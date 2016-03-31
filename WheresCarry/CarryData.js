/**
 * Created by edsan on 3/18/16.
 */

var r = require("./rethink");
//var _ = require("lodash");

function setup(io){

    io.on("connection", function(socket) {
        console.log("User connected to the page");
        socket.on("carry:getFleet", function(callback){
            r.table("wheres_carry")
                .pluck({carry_data_current: "sender"})
                .distinct()
                .run(callback);
        });
        //
        socket.on('carry:findTripsByCarryID', function(id, callback){
            r.table('wheres_carry').orderBy(r.desc('created'))
                .filter({carry_data_current:{"sender":id}})
                .pluck({carry_data_current: ["trip_id", "completed"]})
                .distinct().run(callback);
        });
        socket.on("carry:tripDetailsByTripID", function(tripID, callback){
            r.table("wheres_carry")("carry_data_current")
                .orderBy("created").run(function(err, data){
                if(err){
                    console.log(err);
                }else{
                    var first = data[0];
                    var last = data[data.length-1];
                    var newData = [first, last];
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