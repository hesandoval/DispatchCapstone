var socket = io();

socket.emit('carry:getFleet',function(err,data){
    data = {'stuff' : data};
    var template = '{{ #stuff }}<option value="{{ carry_data_current.sender }}">{{ carry_data_current.sender }}</option>{{ /stuff }}';
    var html = Mustache.to_html(template, data);
    $('#fleet_select').append(html);
    //$.each(data, function(){
    //    console.log(this.carry_data_current.sender)
    //});
});

//
//$("#fleet_select").change(function(){
//    console.log("Hello");
//});

function fleetchoiceChanged(){
    console.log(document.getElementById('fleet_select').value);
    var fleet = document.getElementById('fleet_select').value;
    socket.emit('carry:findTripsByCarryID', fleet,function(err, data){
        if(err){
            console.log(JSON.stringify(err));
        }
        console.log(JSON.stringify(data))
    });
}



//socket.on('update-msg', function(msg){
//    console.log(msg);
//    $('#div').html(msg.data);
//});
