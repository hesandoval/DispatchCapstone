var socket = io();
google.charts.load('current', {'packages':['gauge']});
socket.emit('carry:getFleet',function(err,data){
    if(err){
        console.log(err);
    }else{
        data = {'stuff' : data};
        var template = '{{ #stuff }}<li class="carry_id"><a>{{ sender }}</a></li>{{ /stuff }}';
        var html = Mustache.to_html(template, data);
        $('#fleet_select').append(html);
    }
});

$("#fleet_select").on("click",".carry_id", function(event){
    var fleet = event.target.innerText;
    var button = $("#dropdownMenu1")[0];
    defaultMap();
    button.innerHTML = fleet + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    $("#dropdown_trip_select").css("visibility", "hidden");
    socket.emit('carry:findTripsByCarryID', fleet, function(err, data){
        if(err){
            console.log(JSON.stringify(err));
        }else{

            var view = {values:data};
            var b2 = $("#dropdownMenu2")[0];
            b2.innerHTML = "Select One <span class='caret'></span>";
            $("#dropdown_trip_select").css("visibility", "visible");
            var template = "{{ #values}}<li class='trip_id'><a>{{trip_id}}</a></li>{{ /values }}";
            var html = Mustache.to_html(template, view);
            $("#trip_select").html(html);
            button.innerHTML = fleet + "<span class='caret'></span>"
        }
    });
    socket.emit('carry:findLiveTripsByCarryID', fleet, function(err, data){
        if(err){
            console.log(err);
        }else{
            if(data.length > 0){
                var view = {values: data};
                var template = "<li role=\"separator\" class=\"divider\"></li>" +
                    "{{ #values }}<li class='trip_id_live'><a>{{trip_id}}<span class='glyphicon glyphicon-play'></span></a></li> {{/values}}";
                var html = html = Mustache.to_html(template, view);
                $("#trip_select").append(html);
            }

        }

    });

});

$("#trip_select").on("click", ".trip_id", function(event){
    removeMarkers();
    socket.emit('carry:changes:stop');

    var tripID = event.target.innerText;
    var button = $("#dropdownMenu2")[0];
    button.innerHTML = tripID + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    socket.emit('carry:tripDetailsByTripID', tripID, function (data) {
        var waypoints = data['waypoints'];
        socket.emit("carry:getWaypointsByTripID", tripID, plotPathline);
        fillTable(data);
        socket.emit('carry:getPhotographsByTripID', tripID, displayPictureData);
        button.innerHTML = tripID + "<span class='caret'></span>";
        $("#information_container").css("visibility", "visible");
    });

});

$("#trip_select").on("click", ".trip_id_live", function(event){
    defaultMap();
    var tripID = event.target.innerText;
    var button = $("#dropdownMenu2")[0];
    $("#carry_info_container").html('<div class="progress">' +
        '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" style="width: 100%;"' +
        'aria-valuemin="0" aria-valuemax="100" id="battery_bar"> 100%' +
        '</div>' +
        '</div>');
    button.innerHTML = tripID + "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
    socket.emit("carry:getWaypointsByTripID", tripID, plotPathline);
    socket.emit("carry:changes:start", tripID);

});

socket.on("carry:changes", function (record) {
    console.log(JSON.stringify(record));
    var elevation = record["new_val"]["current_location"]["elevation"];
    delete record["new_val"]["current_location"]["elevation"];
    $("#battery_bar").html(record['new_val']['battery_life'].toFixed(2)+"%");
    $("#battery_bar").css("width", record['new_val']['battery_life'].toFixed(2)+"%");

    if(window.markers.length > 2)
    {
        var lastMarker = window.markers.pop();
        lastMarker.setMap(null);
    }
    if(record['new_val']['completed'])
    {
        socket.emit('carry:changes:stop');
        socket.emit('carry:findTripsByCarryID', record['new_val']['sender'], function(err, data){
            if(err){
                console.log(JSON.stringify(err));
            }else{

                var view = {values:data};
                var b2 = $("#dropdownMenu2")[0];
                b2.innerHTML = record['new_val']['trip_id']+" <span class='caret'></span>";
                $("#dropdown_trip_select").css("visibility", "visible");
                var template = "{{ #values}}<li class='trip_id'><a>{{trip_id}}</a></li>{{ /values }}";
                var html = Mustache.to_html(template, view);
                $("#trip_select").html(html);
                $("#dropdownMenu1")[0].innerHTML = record["new_val"]["sender"] + "<span class='caret'></span>"
                //console.log("Bottom of else statement after trip completes.");
            }
        });
        socket.emit('carry:findLiveTripsByCarryID', record['new_val']['sender'], loadLiveTrips);
        //console.log("Trip is completed. Attempting to click trip_select");
        socket.emit('carry:tripDetailsByTripID', record["new_val"]["trip_id"], function (data) {
            
            fillTable(data);
            socket.emit('carry:getPhotographsByTripID', record["new_val"]["trip_id"], displayPictureData);
            $("#information_container").css("visibility", "visible");
        });

    }
    createMarker("551A8B", "Carry's Location", record['new_val']['current_location']);

});

function plotPathline(err, data){
    if(err){
        console.log(err)
    }else{
        var startColor = "33cc33";
        var endColor = "FE7569";
        var waypoints = data[0]['waypoints'];
        var l = waypoints.length - 1;
        var startMarker = createMarker(startColor,"Start", waypoints[0]);
        var endMarker = createMarker(endColor,"End", waypoints[l]);
        window.path = new google.maps.Polyline({
            path: waypoints,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        path.setMap(window.map);
        setBounds();
        getAddress(waypoints[0]["lat"],waypoints[0]["lng"], "start_address");
        getAddress(waypoints[l]["lat"],waypoints[l]["lng"], "end_address");
        $("#information_container").css("visibility", "visible");
    }
}
function displayPictureData(err, data){
    if(err){
        console.log(err);
    }else{
        $.each(data, function(index, value){
            var photog = value['photograph'][0]['url'];
            delete value["current_location"]['elevation'];
            var marker = createMarker(null, "camera", svalue["current_location"]);
            var contentString = '<div style="width:150px" align="center"><img  src="'+photog+'" style="width: 100%"></div>';
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            google.maps.event.addListener(marker,'mouseover', (function(marker,contentString,infoWindow){
                return function() {
                    infoWindow.setContent(contentString);
                    infoWindow.open(map,marker);
                };
            })(marker,contentString,infoWindow));
            google.maps.event.addListener(marker,'mouseout', (function(marker,contentString,infoWindow){
                return function() {
                    infoWindow.close();
                };
            })(marker,contentString,infoWindow));


        });
        data = {values : data};
        var view = "{{#values}}{{#photograph}}<li data-thumb=\"{{url}}\" class=\"slideshow_li\">" +
            "<img class=\"slideshow_img\" src=\"{{url}}\"/>" +
            "</li>{{/photograph}}{{/values}}";
        var html = Mustache.to_html(view, data);
        var lightslider = $("#slideshow_container");
        lightslider.html(html);
        lightslider.lightSlider({
            gallery:true,
            item:1,
            vertical:true,
            verticalHeight:295,
            vThumbWidth:50,
            thumbMargin:4,
            slideMargin:0
        });

    }
}
function fillTable(data){
    var container = $("#carry_info_container");
    var t = "<table class=\"table table-bordered table-hover\" id=\"table_body\"> </table>";
    var header = "<thead id=\"table_header\"><tr class=\"info\"><th>Date</th><th>Time</th><th>Duration</th><th>Average Speed</th>" +
        "<th>Battery Consumption</th><th>Battery Remaining</th></tr></thead>";
    container.html(t);
    var table = $("#table_body");
    table.html(header);
    var body = "<tr><td>{{date}}</td><td>{{start}}</td><td>{{timetotal}}</td><td>{{speed}}</td>" +
        "<td>{{battery_consumption}}</td>" +
        "<td>{{battery_remaining}}</td></tr>";
    var html = Mustache.to_html(body, data);
    table.append(html);
    container.append("<div id=\"slideshow_container\"></div>");
}

function getAddress(lat, lng, tagID){
    $.get(getReverseGeocodeLink(lat,lng), function(result){
        if(result['results'][0]["formatted_address"]){
            var startingAddress = result['results'][0]["formatted_address"];
            $("#"+tagID).html(startingAddress);
            $("#"+tagID).css("visibility", "visible");

        }
    });
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
function createMarker(color, title, latlng){

    var options = getMarkerOptions(color);
    var marker = new google.maps.Marker({
        position: latlng,
        title: title,
        icon: (color === null) ? "http://twemoji.maxcdn.com/16x16/1f4f7.png" : options['image'],
        shadow: options['shadow']
    });
    addMarker(marker);
    return marker;
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
    removeTags("start_address");
    removeTags("end_address");
    $("#information_container").css("visibility", "hidden");
}
function getReverseGeocodeLink(lat, lng){
    return "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng
        +"&key=AIzaSyDLUq8w6E3L-X6P_KrPcbvGW23AL3s_XW0"
}
function removeTags(tagID){
    $("#"+tagID).html("");
    $("#"+tagID).css("visibility", "hidden");
}

function loadLiveTrips(err, data){
    if(err){
        console.log(err);
    }else{
        if(data.length > 0){
            var view = {values: data};
            var template = "<li role=\"separator\" class=\"divider\"></li>" +
                "{{ #values }}<li class='trip_id_live'><a>{{trip_id}}<span class='glyphicon glyphicon-play'></span></a></li> {{/values}}";
            var html = html = Mustache.to_html(template, view);
            $("#trip_select").append(html);
        }

    }

}

