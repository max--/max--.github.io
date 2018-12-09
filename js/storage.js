var StorageAPI = {

    // Sauvegarder les données
    save : function() {
        console.log("storage:save", Reservation);
        localStorage.setItem("reservationUserName", Reservation.name);
        localStorage.setItem("reservationUserFirstName", Reservation.firstName);
        sessionStorage.setItem("reservationStationName", Reservation.stationName);
        sessionStorage.setItem("reservationEndDate", Reservation.endDate);
    },

    // Charger les données stockées
    load : function() {
        if(localStorage.getItem("reservationUserName")) {
            Reservation.name = localStorage.getItem("reservationUserName");
            Reservation.firstName = localStorage.getItem("reservationUserFirstName");
            console.log("storage", Reservation);
            Reservation.fillInputs();
        }
        if(sessionStorage.getItem("reservationStationName")) {
            Reservation.stationName = sessionStorage.getItem("reservationStationName");
            Reservation.endDate = sessionStorage.getItem("reservationEndDate");
            Reservation.startTimer();
            $('#confirmation_reservation').css("display", "block");   
            $('#confirmation_reservation').text("Un vélo a bien été réservé")
        }
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