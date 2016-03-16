var socket = io.connect('http://localhost');

socket.on('update-msg', function(msg){
    console.log(msg);
    $('#div').html(msg.data);
});
