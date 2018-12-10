// Conversion en mms
var mms_day = 24 * 60 * 60 * 1000;
var mms_hour = 60 * 60 * 1000;
var mms_minute = 60 * 1000;
var mms_second = 1000;

const min = 0.2;

var Reservation = {
    name: null,
    firstName: null,
    stationName: null,
    endDate: null,
    station: null,
    timerLifetime: min * mms_minute,
    timerInterval: null,
    timeoutHolder: null,
    stopTimeOut: true,

    init(name, firstName, stationName, endDate, station) {
        this.name = name;
        this.firstName = firstName;
        this.stationName = stationName;
        this.endDate = endDate;
        this.station = station;
        StationsAPI.subtractAvailability(this.station);
        StorageAPI.save(Reservation);
    },

    // Remplir les champs automatiquement
    fillInputs() {
        $('#name').val(Reservation.name);
        $('#first_name').val( Reservation.firstName);
    },

    // Afficher les informations de la réservation en cours
    displayResume() {
        if(Reservation.stationName) {
            Reservation.stopTimeOut = true;
            $(".recap_resa").text("Réservation en cours station numéro " + Reservation.stationName + " par " + Reservation.firstName + " " + Reservation.name);
            $(".resume").css('display', 'block')
        }
    },

    // Ajout d'une nouvelle réservation
    addNewReservation: function(name, firstName, stationName, endDate, station){
        if(Reservation.timeoutHolder) {
            Reservation.stopTimer();
        }
        Reservation.init(name, firstName, stationName, endDate, station);
        Reservation.displayResume();
        Reservation.startTimer();
        if (Reservation.stopTimeOut = true){
            clearTimeout(Reservation.timeoutHolder);
            $("#timer").text("");
        }
    },

    removeReservation: function() {
        Reservation.stopTimer();
        $("#timer").text("Réservation expirée");
        StationsAPI.addAvailability(Reservation.station);
        StorageAPI.clearSession();
        Reservation.station = null;
        $(".recap_resa").text("Aucune réservation en cours");
        Reservation.stopTimeOut = false;
        Reservation.timeoutHolder = setTimeout(function () {
            $(".resume").css("display", "none");
            $("#confirmation_reservation").css('display', 'none');
            Map.reference.invalidateSize(true);
            Map.reference.setView([43.6, 1.433333], 13);
        }, 3000);
    },

    // Timer
    startTimer: function(){
        Reservation.timerInterval = setInterval(Reservation.checkTimer, 1000);
    },

    stopTimer: function(){
        clearInterval(Reservation.timerInterval);
    },

    checkTimer: function (){
        var timeDifference = Reservation.getTimeDifference(Date.now(), Reservation.endDate);

        if(Reservation.endDate > Date.now()) {
            $("#timer").text("Temps restant : " + timeDifference.label);
        // } else if(Reservation.endDate > 0) {
        } else {
            Reservation.removeReservation();
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

}
