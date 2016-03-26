var socket = io();

socket.emit('carry:getFleet',function(err,data){
    if(err){
        console.log(err);
    }else{
        data = {'stuff' : data};
        var template = '{{ #stuff }}<li class="carry_id"><a>{{ carry_data_current.sender }}</a></li>{{ /stuff }}';
        var html = Mustache.to_html(template, data);
        $('#fleet_select').append(html);
    }
});

//
$("#fleet_select").on("click",".carry_id", function(event){
    var fleet = event.target.innerText;
    var button = $("#dropdownMenu1")[0];
    button.innerHTML = fleet + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    $("#dropdown_trip_select").css("visibility", "hidden");
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
            var b2 = $("#dropdownMenu2")[0];
            b2.innerHTML = "Select One <span class='caret'></span>";
            $("#dropdown_trip_select").css("visibility", "visible");
            var template = "{{ #values}}<li class='trip_id'><a>{{trip_id}}</a></li>{{ /values }}";
            var html = Mustache.to_html(template, view);
            $("#trip_select").html(html);
            button.innerHTML = fleet + "<span class='caret'></span>"
        }

    });

});
$("#trip_select").on("click", ".trip_id", function(event){
    var tripID = event.target.innerText;
    var button = $("#dropdownMenu2")[0];
    button.innerHTML = tripID + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    socket.emit('carry:tripDetailsByTripID', tripID, function (data) {
        console.log(JSON.stringify(data));
        console.log(window.map);
        var startPoint = data[0]["carry_data_current"]["current_location"];
        var endPoint = data[data.length-1]["carry_data_current"]["current_location"];
        var startLatLng = new google.maps.LatLng(startPoint["latitude"], startPoint['longitude']);
        var endLatLng = new google.maps.LatLng(endPoint["latitude"], endPoint['longitude']);

        var startMarker = new google.maps.Marker({
            position: startLatLng,
            title:"Start"
        });
        var endMarker = new google.maps.Marker({
            position: endLatLng,
            title:"End"
        });
        startMarker.setMap(window.map);
        endMarker.setMap(window.map);
        window.map.panTo(startMarker.position);
        button.innerHTML = tripID + "<span class='caret'></span>";
    });

});

