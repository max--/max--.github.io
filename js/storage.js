const StorageAPI = {

    // Sauvegarder les données
    save: function() {
        localStorage.setItem("reservationUserName", Reservation.name);
        localStorage.setItem("reservationUserFirstName", Reservation.firstName);
        sessionStorage.setItem("reservationStationName", Reservation.stationName);
        sessionStorage.setItem("reservationEndDate", Reservation.endDate);
    },

    // Charger les données stockées
    load: function() {
        var data = {
            name: null,
            firstName: null,
            stationName: null,
            endDate: null,
        };
        if(localStorage.getItem("reservationUserName")) {
            data.name = localStorage.getItem("reservationUserName");
            data.firstName = localStorage.getItem("reservationUserFirstName");
            Reservation.fillInputs(data.name, data.firstName);
        }
        if(sessionStorage.getItem("reservationStationName")) {
            data.stationName = sessionStorage.getItem("reservationStationName");
            data.endDate = sessionStorage.getItem("reservationEndDate");
            Reservation.addReservation(data);
        }
        return data;
    },

    // Effacer session storage
    clearSession: function() {
        sessionStorage.clear();
    },

    // Effacer local storage
    clearLocal: function() {
        localStorage.clear();
    }

}
