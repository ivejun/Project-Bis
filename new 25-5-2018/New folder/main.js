//Setting For Global Variable For Maps
var LocationResult = {lat: -7.9553267, lng: 112.6109537};
var markerbase = 'https://indodjaja.com/wp-content/uploads/2018/05/';
var map;
var markers = [];

//MQTT INIT
var server_uri = ["ws://iot.eclipse.org:80/ws"];
var port = [80];
var clientID = "ID-" + Math.round(Math.random() * 1000);
var client = new Paho.MQTT.Client("iot.eclipse.org", 80, clientID);
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
//Legend Variable
var DriverName = "Joko Susilo";
var DriverGender = "Male";
var DriverAge = '24';
//Other Initiate Variable
var findDriver = false;

// Init Map + MQTT INIT
function initMap() {
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectLoss;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: LocationResult,
        gestureHandling: 'greedy'
    });

    //MQTT Init Start From Here
    var options = {
        onSuccess:onConnect,
        hosts:server_uri,
        uris:server_uri,
        ports:port,
        reconnect:true,
    }

    client.connect(options);

    function onConnectLoss(){
        console.log("Connection lost... Reconnecting");
    }

    function onConnect(){
        console.log("connected");
        client.subscribe("sensors/suh");
    }

    //When A data Coming, Inside Here
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        document.getElementById("p1").innerHTML = message.payloadString;
        var result = message.payloadString.split('#')
        //document.getElementById("p2").innerHTML = result;
        LocationResult.lat = parseFloat(result[0]);
        LocationResult.lng = parseFloat(result[1]);
        deleteMarkers();
        addMarker(LocationResult);

        //do here something
        PanAMap(LocationResult.lat,LocationResult.lng);
    }

    //Variable Legend handler
    var icons = {
        nameDriver: {
            name: 'Driver Name: ',
            icon: 'https://indodjaja.com/wp-content/uploads/2018/05/bond.png',
            contents: DriverName
        },
        Gender: {
            name: 'Gender: ',
            icon: '',
            contents: DriverGender
        },
        Age: {
            name: 'Age: ',
            icon: '',
            contents: DriverAge
        },
    };
    var legend = document.getElementById('legend');

    // Printing Element Inside Legend
    for (var key in icons) {
        var type = icons[key];
        var name = type.name;
        var icon = type.icon;
        var value = type.contents;
        // document.getElementById("p2").innerHTML = "a";
        var div = document.createElement('div');
        //jika variable berupa Nama, maka diberi tambahan foto
        if(key == 'nameDriver'){
            div.innerHTML = '<center><img src="' + icon + '"></center>' +'<h2>' + name + value+ '</h2>';
        }
        //Jika Selain Nama.
        else{
            div.innerHTML = '<center></center>' +'<h2>' + name + value+ '</h2>';
        }
        legend.appendChild(div);
    }
    //position Of Legend
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
}



// Marker Handler On Maps
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: markerbase + 'bus.png'
    });
    //map.panTo(location);
    markers.push(marker);
}
//Fungsi untuk tombol Find Driver
function FindRealDriver() {
    var child = document.getElementById("p4");
    findDriver = true;
    parent.removeChild(child);
}
//mengubah map Menjadi Tampilan
function PanAMap(lati,long) {
    if(findDriver){
        var latLng = new google.maps.LatLng(lati, long); //Makes a latlng
        map.panTo(latLng); //Make map global
    }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//Clear Maps First Then Draw
function clearMarkers() {
    setMapOnAll(null);
}

//delete all Maps
function deleteMarkers() {
    clearMarkers();
    markers = [];
}