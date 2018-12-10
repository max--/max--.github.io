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

    nameInput: null,
    firstNameInput: null,
    formElement: null,
    timerElement: null,

    init: function() {
        this.nameInput = $('#name');
        this.firstNameInput = $('#first_name');
        this.formElement = $('form');
        this.timerElement = $('#timer');

        this.formElement.submit(Reservation.handleNewReservation);

        StorageAPI.load();
    },

    // Remplir les champs automatiquement
    fillInputs: function(name, firstName) {
        this.nameInput.val(name);
        this.firstNameInput.val(firstName);
    },

    // Afficher les informations de la réservation en cours
    displayReservation: function(data) {
        if(data) {
            $(".recap_resa").text("Réservation en cours station numéro " + data.stationName + " par " + data.firstName + " " + data.name);
        } else {
            $(".recap_resa").text("Réservation en cours station numéro " + Reservation.stationName + " par " + Reservation.firstName + " " + Reservation.name);
        }
        $(".resume").css('display', 'block')
    },

    // Ajout d'une nouvelle réservation
    addReservation: function(data) {
        if(data) {
            // Si data est définie c'est que ça vient du localStorage
            this.name = data.name;
            this.firstName = data.firstName;
            this.stationName = data.stationName;
            this.endDate = data.endDate;
        } else {
            // Sinon c'est via l'interface (click/submit)
            this.name = Reservation.nameInput.val();
            this.firstName = Reservation.firstNameInput.val();
            this.stationName = Map.selectedStation.name;
            this.endDate = new Date(Date.now() + Reservation.timerLifetime).getTime();
            this.station = Map.selectedStation;

            StorageAPI.save(Reservation);

            StationsAPI.subtractAvailability(this.station);

            $('#confirmation_reservation').css("display", "block");
            $('#confirmation_reservation').text("Un vélo a bien été réservé");

            setTimeout(function () {
                $('#confirmation_reservation').css("display", "none");
                $('#confirmation_reservation').text("");
            }, 3000);
        }

        Reservation.startTimer();
        Reservation.displayReservation();
    },

    // Remplacement de réservation en cours (non expirée) par une nouvelle
    replaceReservation: function() {
        Reservation.stopTimer();

        Reservation.timerElement.text("");

        StationsAPI.addAvailability(Reservation.station);

        StorageAPI.clearSession();

        Reservation.station = null;
        Reservation.name = null;
        Reservation.firstName = null;
        Reservation.stationName = null;
        Reservation.endDate = null;

        Reservation.addReservation();
    },

    removeReservation: function() {
        Reservation.stopTimer();

        Reservation.timerElement.text("Réservation expirée");

        StationsAPI.addAvailability(Reservation.station);

        StorageAPI.clearSession();

        Reservation.station = null;
        Reservation.name = null;
        Reservation.firstName = null;
        Reservation.stationName = null;
        Reservation.endDate = null;

        $(".recap_resa").text("Aucune réservation en cours");

        setTimeout(function () {
            if(Reservation.stationName == null) {
                Reservation.timerElement.text("");
                $(".resume").css("display", "none");
                $("#confirmation_reservation").css('display', 'none');
                Map.reference.invalidateSize(true);
                Map.reference.setView([43.6, 1.433333], 13);
            }
        }, 3000);
    },

    checkTimer: function(){
        if(Reservation.endDate >= Date.now()) {
            var timeDifference = Reservation.getTimeDifference(Date.now(), Reservation.endDate);
            Reservation.timerElement.text("Temps restant : " + timeDifference.label);
        } else {
            Reservation.removeReservation();
        }
    },

    handleNewReservation: function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#comments').css("display", "none");

        if((sessionStorage.getItem("reservationStationName") && sessionStorage.getItem("reservationEndDate"))){
            var confirmReservation = confirm("Une réservation est déjà en cours. Voulez-vous l'écraser ?");
            if(confirmReservation) {
                Reservation.replaceReservation();
            }
        } else {
            if(Reservation.nameInput.val() === "" || Reservation.firstNameInput.val() === "" || Canvas.isEmpty){
                $('#comments').text("Merci de remplir tous les champs.");
                $('#comments').css("display", "block");
            } else {
                $('#confirmation_reservation').css("display", "block");
                $('#confirmation_reservation').text("Un vélo a bien été réservé");
                $(".resume").css('display', 'block');
                Reservation.addReservation();
            }
        }
    },

    startTimer: function(){
        Reservation.timerElement.text("");
        Reservation.timerInterval = setInterval(Reservation.checkTimer, 1000);
    },

    stopTimer: function(){
        clearInterval(Reservation.timerInterval);
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
        if(timeDifferencelabel == "") {
            timeDifferencelabel = " 0 s ";
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
