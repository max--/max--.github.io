const StationsAPI = {
    apiKey: "b0e5b1ea5fa5a334858b4bf7a6cdc9c1ae3088ca",
    apiUrl: "https://api.jcdecaux.com/vls/v1/stations",
    contract: "toulouse",
    stations: [],

    // Récupération des données (stations)
    getStations(next) {
        /*
            Note: 'next'
                - next est une fonction passée en argument de getStations :: maps.js -> StationsAPI.getStations(function(error) { .. })
                - getStations étant asynchrone, next sert à avertir de la fin (ex: réveil, minuteur) de son execution
                - next est à appeler à la toute fin de la tâche de getStations, donc à la fin du traitement de ajaxGet()
                - next(error) permet de retourner l'erreur éventuellement rencontrée
        */

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
                    if(stationsParsed == null || stationsParsed == undefined) {
                        error = "absence de réponse";
                        console.error(`Impossible de récupérer la liste des stations : ${error}`);
                    } else if(Array.isArray(stationsParsed) == false) { // Array.isArray permet de vérifier que stationParse est bien un tabnle (typeof [] --> "object" donc inutile ici)
                        error = "réponse mal formatée";
                         console.error(`Impossible de récupérer la liste des stations : ${error}`);
                    } else {
                        this.stations = stationsParsed;
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

    // Soustraire nb de vélos dispo en cas de réservation
    subtractAvailability(station) {
        if (Reservation.stationName) {
            station.available_bikes--;
            $("#available_bikes").text(station.available_bikes);
        }
        StationsAPI.checkAvailability(station);
    },

    // Vérifier disponibilité d'une station
    checkAvailability: function (station){
        if (station.available_bikes === 0){
            document.getElementById('resaButton').disabled = true;
            $('#resaButton').css("cursor", "not-allowed");
            $('#comments').css("display", "block");
            $('#comments').text("Aucun vélo disponible sur cette station. Veuillez réessayer plus tard.");
        } else {
            document.getElementById('resaButton').disabled = false;
            $('#resaButton').css("cursor", "pointer");
            $('#comments').css("display", "none");
        }
    },

};
