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

        socket.on('carry:findTripsByCarryID', function(id, callback){
            r.table('wheres_carry').orderBy(r.desc('created'))
                .filter({carry_data_current:{"sender":id}})
                .pluck({carry_data_current: ["trip_id", "completed"]})
                .distinct().run(callback);
        });
        socket.on("carry:tripDetailsByTripID", function(tripID, callback){
            r.table("wheres_carry")("carry_data_current").filter({"trip_id":tripID})
                .orderBy("created").run(function(err, data){
                if(err){
                    console.log(err);
                }else{

                    var first = data[0];
                    var last = data[data.length - 1];
                    var g2j = {};
                    g2j["starting_location"] = {"lat" : first['current_location']['latitude'], "lng": first['current_location']['longitude']};
                    g2j["ending_location"] = {"lat" : last['current_location']['latitude'], "lng": last['current_location']['longitude']};
                    g2j["sender"] = {"sender": first['sender']};
                    g2j["waypoints"] = first['waypoints'];
                    //console.log("first battery " + JSON.stringify(first['battery_life']));
                    //console.log("last battery " + JSON.stringify(last['battery_life']));
                    var batt  = first['battery_life']-last['battery_life'];
                    var totaltime = last['created'] - first ['created'];
                    console.log("Last created: " + last['created']);
                    console.log("First created:" + first['created']);
                    console.log("The time of the trip is: "+ totaltime/1000 + " seconds");
                    g2j["timetotal"] = totaltime/1000 + " seconds";
                    g2j["battery_consumption"] = batt + "%";
                    var s = 0;
                    var count = 0;
                    for(var i=0; i<data.length; i++)
                    {
                        s+=data[i]['speed'];
                        count++;
                    }
                    s= s/count;
                    g2j["speed"] = s+"mph";
                    var date = first['created'].toString().slice(0, 15);
                    console.log("Date: " + date);
                    g2j["date"] = date;
                    console.log("Count: " + count);
                    console.log("Avg speed: " + s);
                    //console.log("setting g2j" + JSON.stringify(g2j));
                    callback(g2j);
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