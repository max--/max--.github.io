var StationsAPI = {
    apiKey: "b0e5b1ea5fa5a334858b4bf7a6cdc9c1ae3088ca",
    apiUrl: "https://api.jcdecaux.com/vls/v1/stations",
    contract: "toulouse",
    stations: [],

    init(contract) {
        this.apiKey = "b0e5b1ea5fa5a334858b4bf7a6cdc9c1ae3088ca";
        this.apiUrl = "https://api.jcdecaux.com/vls/v1/stations";
        this.contract = "toulouse";
        if(typeof contract == "string") {
            this.contract = contract;
        }
        this.stations = [];
    },

    getStations(next) {
        var error = null;
        var stationsParsed = [];

        console.log('Récupération de la liste des stations en cours ..');

        ajaxGet(`${this.apiUrl}?contract=${this.contract}&apiKey=${this.apiKey}`, function(response) {
            if(typeof response != "string") {
                error = "réponse invalide";
                console.error(`Impossible de récupérer la liste des stations : ${error}`);
            } else {
                try {
                    stationsParsed = JSON.parse(response);
                    if([null, undefined].includes(stationsParsed) || !Array.isArray(stationsParsed)) {
                        error = "réponse mal formatée";
                        console.error(`Impossible de récupérer la liste des stations : ${error}`);
                    } else {
                        this.stations = stationsParsed;
                        // Commenté car autant ne faire qu'une itération sur l'ensemble des stations, côté Map.init() <3
                        // this.stations.forEach(function(station) {
                        //     station.availability = Math.round((station.available_bikes / station.bike_stands) * 100);
                        // });
                        console.log(`Récupération de la liste des stations effectuée : ${this.stations.length} station(s) récupérées`);
                    }
                } catch(err) {
                    error = err;
                    console.error(`Impossible de récupérer la liste des stations : ${error}`);
                }
            }

            next(error);
        }.bind(this));
    },

    subtractAvailability(station) {
        if (Reservation.stationName) {
            station.available_bikes -- ;
            $("#available_bikes").text(station.available_bikes);
        }
        StationsAPI.checkAvailability(station);
    },

    checkAvailability: function (station){
        if (station.available_bikes === 0){
            document.getElementById('resaButton').disabled= true;
            $('#resaButton').css("cursor", "not-allowed");
            $('#comments').css("display", "block");
            $('#comments').text("Aucun vélo disponible sur cette station. Veuillez réessayer plus tard.");

        } else {
            document.getElementById('resaButton').disabled= false;
            $('#resaButton').css("cursor", "pointer");
            $('#comments').css("display", "none");

            // Commenté car ça cache tout le temps les commentaires sinon
            // document.getElementById('comments').style.display = "none";
        }
    },

};
