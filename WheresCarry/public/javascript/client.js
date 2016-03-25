var socket = io();

socket.emit('carry:getFleet',function(err,data){
    if(err){
        console.log(err);
    }else{
        data = {'stuff' : data};
        var template = '{{ #stuff }}<option value="{{ carry_data_current.sender }}">{{ carry_data_current.sender }}</option>{{ /stuff }}';
        var html = Mustache.to_html(template, data);
        $('#fleet_select').append(html);
    }
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
        }else{
            var values = {};
            for (var index in data){
                if(data[index]["carry_data_current"]["trip_id"] in values){
                    values[data[index]["carry_data_current"]["trip_id"]] = true;
                }else {
                    values[data[index]["carry_data_current"]["trip_id"]] = false;
                }
            }
            var view = {values:[]};
            for (var index in values){
                view['values'].push({trip_id:index, finished:values[index]})
            }
            console.log(view);

            var template = "<select id='trip_select' onchange='tripSelectChanged()'> <option>Select One</option>" +
                "{{ #values}}<option value='{{trip_id}}'>{{trip_id}}</option>{{ /values }} " +
                "</select>";
            var html = Mustache.to_html(template, view);
            console.log(html);
            $("#dropdown_fleet_select").append(html)
        }

    });
}
function tripSelectChanged() {
    console.log(document.getElementById('trip_select').value);
    var tripID = document.getElementById('trip_select').value;
    socket.emit('carry:tripDetailsByTripID', tripID, function (data) {
        console.log(JSON.stringify(data));
    });
}



//socket.on('update-msg', function(msg){
//    console.log(msg);
//    $('#div').html(msg.data);
//});
