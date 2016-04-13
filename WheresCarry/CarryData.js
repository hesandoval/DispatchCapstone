var r = require("./rethink");
//set to require rethinkdb to connect to our database

function setup(io){

    //retrieve a list of all distinct Carry bots
    io.on("connection", function(socket) {
        console.log("User connected to the page");
        socket.on("carry:getFleet", function(callback){
            r.table("wheres_carry")("carry_data_current")
                .pluck("sender")
                .distinct()
                .run(callback)
        });

        //checks to see if a specific trip is completed
        socket.on('carry:findTripsByCarryID', function(sender, callback){
            r.table('wheres_carry')("carry_data_current")
                .orderBy(r.desc('created'))
                .filter({"sender": sender, "completed":true})
                .pluck(["trip_id"])
                .distinct()
                .run(callback);
        });

        //checks to make sure that a specific trip has yet to complete and is still in progress
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

        //retrieves only DISTINCT waypoints from databse to draw the line in which Carry is travelling
        socket.on("carry:getWaypointsByTripID", function(tripID, callback){
            r.table('wheres_carry')("carry_trip")
                .filter({'trip_id':tripID})
                .pluck('waypoints')
                .distinct()
                .run(callback)
        });

        //retrieves the photo from the database to send to the frontend
        socket.on('carry:getPhotographsByTripID', function(tripID, callback){
            r.table('wheres_carry')("carry_data_current")
                .filter({'trip_id':tripID})
                .pluck(["photograph",'current_location', 'created'])
                .filter(function(doc){
                    return doc('photograph').count().gt(0);
                })
                .run(callback);
        });

        /*
        Once a user specifies which tripID they would like to search,
        this fetches all the details for that trip.
         */
        socket.on("carry:tripDetailsByTripID", function(tripID, callback){
            r.table("wheres_carry")("carry_data_current").filter({"trip_id":tripID})
                .orderBy("created").run(function(err, data){
                if(err){
                    console.log(err);
                }else{

                    var first = data[0];
                    var last = data[data.length - 1];
                    var g2j = {}; //setups empty JSON object for the historicalDataSpecifications.json

                    g2j=Setup(first,last,data);
                    callback(g2j);
                }
            });
        });

        //intended to be live route tracking
        socket.on('carry:changes:start', function(tripID){
            //var filter = {trip_id: tripID};

            r.table('wheres_carry')("carry_data_current")
                .filter(r.row("trip_id").eq(tripID))
                .changes()
                .run({cursor: true}, handleChange);

            function handleChange(error, cursor){
                if (error){
                    console.log(error);
                }else{
                    if(cursor){
                        cursor.each(function(err, record){
                            if(err){
                                console.log(err);
                            }else{
                                console.log(record);
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

//takes a millisecond input and converts it into to hours, minutes, seconds, and ms.
function thetime(s){
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs + '.' + ms;
}


function Setup(first, last, data)
{
    var g2j = {};
    g2j["starting_location"] = {"lat" : first['current_location']['lat'], "lng": first['current_location']['lng']};
    g2j["ending_location"] = {"lat" : last['current_location']['lat'], "lng": last['current_location']['lng']};
    g2j["sender"] = first['sender'];

    var batt  = first['battery_life']-last['battery_life']; //takes the starting battery life % and the ending %,
                                                            // subtracts ending from start to show how much battery life was used over the course of the trip
    g2j["battery_consumption"] =batt + "%";
    g2j["battery_remaining"] = last['battery_life']+"%";

    g2j["start"] = first['created'].toTimeString(); //creates a time object for when the trip started. time should default to user's time zone

    var totaltime = last['created'] - first ['created']; //takes the ending time and subtracts the beginning time to get totaltime in milliseconds
    g2j["timetotal"] = thetime(totaltime); //send the totaltime variable (in milliseconds) to a function to return it in hours, minutes, seconds, and ms

    g2j["speed"] = getAverageSpeed(data)+" mph";

    var newDate = first['created'].toDateString(); //creates a date object to retrieve the day in which the trip was started
    g2j["date"] = newDate;
    return g2j;
};

//fetches every speed value of a trip and computes the average
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