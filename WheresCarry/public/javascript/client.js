var socket = io();

socket.emit('carry:getFleet',function(err,data){
    console.log(data);

    //$.each(data, function(){
    //    console.log(this.carry_data_current.sender)
    //});
});


//socket.on('update-msg', function(msg){
//    console.log(msg);
//    $('#div').html(msg.data);
//});
