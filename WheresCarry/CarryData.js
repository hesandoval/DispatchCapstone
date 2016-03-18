/**
 * Created by edsan on 3/18/16.
 */

var r = require("./rethink");
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
        socket.on('carry:findByTripID', function(id, callback){
            r.table('wheres_carry').run();
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