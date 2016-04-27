/**
 * Created by edsan on 3/25/16.
 */
function setupMap(){
    window.defaultCenter = new google.maps.LatLng(36.6544501,-121.80176360000002);
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: window.defaultCenter,
        zoom: 18,
        zmapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
    });
    window.markers = [];
}