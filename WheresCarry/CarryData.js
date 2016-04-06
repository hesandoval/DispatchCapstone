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

        socket.on('carry:findTripsByCarryID', function(sender, callback){
            r.table('wheres_carry')("carry_data_current")
                .orderBy(r.desc('created'))
                .filter({"sender": sender, "completed":true})
                .pluck(["trip_id"])
                .distinct()
                .run(callback);
        });
        socket.on('carry:findLiveTripsByCarryID', function(sender, callback){
            r.table('wheres_carry')("carry_data_current")
                .orderBy(r.desc('created'))
                .filter({"sender":sender, "completed":false})
                .pluck(["trip_id"]).distinct()
                .filter(function (doc){
                 return r.table("wheres_carry")("carry_data_current")
                         .filter({"sender": sender, "completed":true})
                         .pluck(["trip_id"]).contains(doc).not();}).run(callback)
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
                    g2j["sender"] = first['sender'];
                    g2j["waypoints"] = first['waypoints'];

                    var batt  = first['battery_life']-last['battery_life'];
                    var totaltime = last['created'] - first ['created'];

                    g2j["timetotal"] = thetime(totaltime);
                    g2j["battery_consumption"] = batt + "%";

                    g2j["speed"] = getAverageSpeed(data)+" mph";
                    var newDate = first['created'].toDateString();
                    g2j["date"] = newDate;
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


function thetime(s){
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs + '.' + ms;
}

function getAverageSpeed(dataobj){
    var s = 0;
    var count = 0;
    for(var i=0; i<dataobj.length; i++)
    {
        s+=dataobj[i]['speed'];
        count++;
    }
    s= s/count;
    return s;
}

module.exports = {
    setup: setup
};