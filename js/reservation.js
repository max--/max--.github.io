var Reservation = {
    name: null,
    firstName: null,
    stationName: null,
    endDate: null,
    // isActive : false,

    init(name, firstName, stationName, endDate, isActive) {
        this.name = name;
        this.firstName = firstName;
        this.stationName = stationName;
        this.endDate = endDate;
        // this.isActive = isActive;
    },

    // Remplir les champs automatiquement
    fillInputs() {
        $('#name').val(Reservation.name);
        $('#first_name').val( Reservation.firstName);
    },

    // Afficher les informations de la réservation en cours
    displayResume() {
        if(Reservation.stationName) {
            stopTimeOut = true;
            $(".recap_resa").text("Réservation en cours station numéro " + Reservation.stationName + " par " + Reservation.firstName + " " + Reservation.name);
            $(".resume").css('display', 'block')
        }
    },

    // checkIsActive(){
    //     if (sessionStorage.getItem("reservationStationName") && sessionStorage.getItem("reservationEndDate")){
    //         isActive = true;
    //         return isActive;
    //     }
    // },

        // Timer
    startTimer: function(){
        timerInterval = setInterval(this.checkTimer, 1000);
    },

    stopTimer: function(){
        clearInterval(timerInterval);
    },

    checkTimer: function (){
        var timeDifference = Reservation.getTimeDifference(Date.now(), Reservation.endDate);

        if(Reservation.endDate > Date.now()) {
            $("#timer").text("Temps restant : " + timeDifference.label);
        // } else if(Reservation.endDate > 0) {
        } else {
            Reservation.stopTimer();
            $("#timer").text("Réservation expirée");
            StorageAPI.clearSession();
            $(".recap_resa").text("Aucune réservation en cours");
            stopTimeOut = false;
            timeout = setTimeout(function () {
                console.log("timeout");
                $(".resume").css("display", "none");
                $("#confirmation_reservation").css('display', 'none');
                Map.reference.invalidateSize(true);
                Map.reference.setView([43.6, 1.433333], 13);       
            }, 3000);
        // } else {
            // pas de réservation en cours
        }

    },

    getTimeDifference: function(date1, date2){
        var difference = Math.abs(date1 - date2);

        var remainingDays = Math.floor(difference / mms_day);
        difference -= remainingDays * mms_day;
        var remainingHours = Math.floor(difference / mms_hour);
        difference -= remainingHours * mms_hour;
        var remainingMinutes = Math.floor(difference / mms_minute);
        difference -= remainingMinutes * mms_minute;
        var remainingSeconds = Math.floor(difference/mms_second);
        difference -= remainingSeconds * mms_second;

        var timeDifferencelabel = "";
        if(remainingDays > 0) {
            timeDifferencelabel += remainingDays + " j ";
        }
        if(remainingHours > 0) {
            timeDifferencelabel += remainingHours + " h ";
        }
        if(remainingMinutes > 0) {
            timeDifferencelabel += remainingMinutes + " min ";
        }
        if(remainingSeconds > 0) {
            timeDifferencelabel += remainingSeconds + " s ";
        }

        return {
            label: timeDifferencelabel,
            days:remainingDays,
            hours:remainingHours,
            minutes: remainingMinutes,
            seconds:remainingSeconds,
        };

    },
    
    // Ajout d'une nouvelle réservation
    addNewReservation: function(){
        Reservation.init(nameValue.val(), firstNameValue.val(), stationNameValue.text(), endDateValue);
        StorageAPI.save(Reservation);
        Reservation.displayResume();
        // ajouter un if resa déjà en cours --> stopTimer ???
        Reservation.stopTimer();
        console.log("Stop Timer");
        Reservation.startTimer();
        StationsAPI.subtractAvailability(Map.selectedStation);
        if (stopTimeOut = true){
            clearTimeout(timeout);
            $("#timer").text("");
        }
    }

}
