var socket = io();

socket.emit('carry:getFleet',function(err,data){
    data = {'stuff' : data};
    console.log(JSON.stringify(data));
    var template = '<select>{{ #stuff }}<option>{{ carry_data_current.sender }}</option>{{ /stuff }}</select>';
    console.log(template);
    var html = Mustache.to_html(template, data);
    console.log(html);
    $('#dropdown_fleet_select').html(html);
    //$.each(data, function(){
    //    console.log(this.carry_data_current.sender)
    //});
});


//socket.on('update-msg', function(msg){
//    console.log(msg);
//    $('#div').html(msg.data);
//});
