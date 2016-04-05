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
    defaultMap();
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
    removeMarkers();
    var tripID = event.target.innerText;
    var button = $("#dropdownMenu2")[0];
    button.innerHTML = tripID + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    socket.emit('carry:tripDetailsByTripID', tripID, function (data) {
        console.log(JSON.stringify(data));
        var waypoints = data['waypoints'];
        var startColor = "33cc33";
        var startMarker = createMarker(startColor,"Start", data['starting_location']);
        var endColor = "FE7569";
        var endMarker = createMarker(endColor,"End", data['ending_location']);
        window.path = new google.maps.Polyline({
            path: waypoints,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        path.setMap(window.map);
        setBounds();
        button.innerHTML = tripID + "<span class='caret'></span>";
        //"<table><tr><td>"+getAddress(data['starting_location']["lat"],data['starting_location']["lng"], "start_address" )+"</td></tr>";
        //"<tr><td>" + getAddress(data['ending_location']["lat"],data['ending_location']["lng"], "end_address")+"</td></tr></table>";
        getAddress(data['starting_location']["lat"],data['starting_location']["lng"], "start_address");
        getAddress(data['ending_location']["lat"],data['ending_location']["lng"], "end_address");
    });

});
function getAddress(lat, lng, tagID){
    $.get(getReverseGeocodeLink(lat,lng), function(result){
        if(result['results'][0]["formatted_address"]){
            var startingAddress = result['results'][0]["formatted_address"];
            console.log(startingAddress);
            $("#"+tagID).html(startingAddress);
        }
    });
}
function createMarker(color, title, latlng){
    var options = getMarkerOptions(color);
    var marker = new google.maps.Marker({
        position: latlng,
        title: title,
        icon: options['image'],
        shadow: options['shadow']
    });
    addMarker(marker);
    return marker;
}
function addMarker(marker){
    marker.setMap(window.map);
    window.markers.push(marker);
}
function removeMarkers(){
    if(window.path){
        window.path.setMap(null);
    }
    $.each(window.markers, function(index, marker){
        marker.setMap(null);
    });
    window.markers = [];
}
function getMarkerOptions(color) {
    var pinColor = color;
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
    var options = {image: pinImage, shadow:pinShadow};
    return options;
}
function setBounds(){
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < window.markers.length; i++) {
        bounds.extend(window.markers[i].getPosition());
    }
    window.map.fitBounds(bounds);
}
function defaultMap(){
    window.map.setCenter(window.defaultCenter);
    window.map.setZoom(18);
    removeMarkers();
}
function getReverseGeocodeLink(lat, lng){
    return "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng
        +"&key=AIzaSyDLUq8w6E3L-X6P_KrPcbvGW23AL3s_XW0"
}