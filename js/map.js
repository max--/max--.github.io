const Map = {
    selectedStation: null,
    reference: null,
    markerClusterGroup: null,

    init: function() {
        this.reference = L.map('mapid').setView([43.6, 1.433333], 13); // Afficher carte Toulouse
        this.markerClusterGroup = L.markerClusterGroup();

        // Ajout Mapbox Streets tile layer
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWFyaWUzNzMxIiwiYSI6ImNqbnVsbTAwZjA2ZWoza3BueDYzZWExMHkifQ.XnCZw5jXMzssHhjWG7a-lA'
        }).addTo(this.reference);

        // Récupération des stations de Toulouse
        StationsAPI.getStations(function(error) {
            StationsAPI.stations.forEach(function(station) {
                // NOTE : permet de laisser un seul vélo dispo pour tester StationsAPI.checkAvailability()
                // if(station.number == 260) {
                //     station.available_bikes = 1;
                // }
                station.availability = Math.round((station.available_bikes / station.bike_stands) * 100);
                if(Reservation.stationName && station.name == Reservation.stationName) {
                    Reservation.station = station;
                    StationsAPI.subtractAvailability(Reservation.station);
                }
                Map.addMarker(station);
            });
            Map.addMarkerClustersGroup();
        });
    },

    // Ajout un marqueur, définissant une station, au cluster
    addMarker : function(station) {
        var divIcon = Marqueur.getIcon(station.availability);

        var newMarker = L.marker([station.position.lat, station.position.lng], {icon: divIcon}).on('click', function(e) {
            Map.selectedStation = station;
            $(".encart").css("display", "block");
            $("#mapid").width("75%");
            $("#name_station").text(station.name);
            $("#address_station").text(station.address);
            $("#status_station").text(station.status);
            $("#total_stands").text(station.bike_stands);
            $("#available_bikes").text(station.available_bikes);

            StationsAPI.checkAvailability(station);

            //Gestion du zoom de la map
            Map.reference.invalidateSize(true);
            Map.reference.setView(e.latlng, Map.reference.getZoom());
        });
        this.markerClusterGroup.addLayer(newMarker);
    },

    // Ajout du cluster (ensemble de marqueur) à la map
    addMarkerClustersGroup : function() {
        this.reference.addLayer(this.markerClusterGroup);
    },

    // Centrage de la map
    centerLeafletMapOnMarker: function(map, marker) {
        var latLngs = [ marker.getLatLng() ];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    },


}
