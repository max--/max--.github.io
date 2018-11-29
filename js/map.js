// Map
// var stationsInfos = new StationsAPI();
// var marqueurs = [];

var Map = {
    selectedStation: null,
    reference: null,

    init: function() {
        console.log("Map.init.this", this);
        this.reference = L.map('mapid').setView([43.6, 1.433333], 13); //Afficher carte Toulouse

        //ajout Mapbox Streets tile layer
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWFyaWUzNzMxIiwiYSI6ImNqbnVsbTAwZjA2ZWoza3BueDYzZWExMHkifQ.XnCZw5jXMzssHhjWG7a-lA'
        }).addTo(this.reference);

        // Récupérer stations Toulouse + ajouter marqueurs
        StationsAPI.getStations(function(error) {
            if(error == null) {
                StationsAPI.stations.forEach(function(station) {
                    if(station.number == 260) {
                        station.available_bikes = 1;
                    }
                    if(Reservation.stationName && station.name == Reservation.stationName) {
                        console.log("target station (b)", station.available_bikes);
                        station.available_bikes--;
                        console.log("target station (a)", station.available_bikes);
                    }
                    station.availability = Math.round((station.available_bikes / station.bike_stands) * 100);
                    Map.addMarker(station);
                });
            }
        });
        // mymap.addLayer(markerClusters)
    },

    addMarker : function(station) {
        var divIcon = Marqueur.getIcon(station.availability);

        L.marker([station.position.lat, station.position.lng], {icon: divIcon}).on('click', function(e) {
            Map.selectedStation = station;
            console.log(station.name + station.address + " full: "+ station.bike_stands+ " velo dispo: " +station.available_bikes, e.latlng);
            $(".encart").css("display", "block");
            $("#mapid").width("75%");
            $("#name_station").text(station.name);
            $("#address_station").text(station.address);
            $("#status_station").text(station.status);
            $("#total_stands").text(station.bike_stands);
            $("#available_bikes").text(station.available_bikes);

            StationsAPI.checkAvailability(station);
            console.log("checkAvailability");
            
            Map.reference.invalidateSize(true); 
            Map.reference.setView(e.latlng, Map.reference.getZoom());
        }).addTo(this.reference);

        // marqueurs.push(L.marker);
        // console.log(marqueurs);
    },

    centerLeafletMapOnMarker: function(map, marker) {
        var latLngs = [ marker.getLatLng() ];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    },


}
