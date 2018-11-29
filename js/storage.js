var StorageAPI = {

    save : function() {
        console.log("storage:save", Reservation);
        localStorage.setItem("reservationUserName", Reservation.name);
        localStorage.setItem("reservationUserFirstName", Reservation.firstName);
        sessionStorage.setItem("reservationStationName", Reservation.stationName);
        sessionStorage.setItem("reservationEndDate", Reservation.endDate);
    },

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
        }
    },

    clearSession: function() {
        sessionStorage.clear();
    },

    clearLocal: function() {
        localStorage.clear();
    }

}