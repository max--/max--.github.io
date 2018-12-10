/*
    # Lecture

    Explication de "this" / ".bind(this)" & cie ;)
    > https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/L_op%C3%A9rateur_this

*/


// Réservation
var reservationButton = null;

var nameValue = null;
var firstNameValue = null;
var stationNameValue = null;
var endDateValue = null;

$(document).ready(function() {
    // Binding de function, transmission de callback d'évènement
    // NOTE : binded from slider.init()
    // window.onresize = slider.resizeSlider;
    reservationButton = $('#resaButton');

    // Slider
    Slider.init();
    // NOTE : launched from slider.init()
    // window.onresize
    // slider.startAutoNext();
    // slider.listenKeyPress();

    StorageAPI.load(Reservation);
    Reservation.displayResume();

    // Map
    Map.init();

    // Canvas
    canvas.init();

    nameValue = $('#name');
    firstNameValue = $('#first_name');
    stationNameValue = $('#name_station');

    // Réservation --> au clic
    reservationButton.on("click", function() {
        console.log(stationNameValue.val(), nameValue.val(), firstNameValue.val());
        if((sessionStorage.getItem("reservationStationName") && sessionStorage.getItem("reservationEndDate"))){
            var confirmReservation = confirm("Une réservation est déjà en cours. Voulez-vous l'écraser ?");
            if(confirmReservation) {
                endDateValue = new Date(Date.now() + Reservation.timerLifetime).getTime();
                StationsAPI.addAvailability(Reservation.station);
                Reservation.addNewReservation(nameValue.val(), firstNameValue.val(), stationNameValue.text(), endDateValue, Map.selectedStation);
            }
        } else {
            console.log("reservationButton:click", nameValue.val(), firstNameValue.val(), Reservation, canvas);

            endDateValue = new Date(Date.now() + Reservation.timerLifetime).getTime();
            if((nameValue.val() ==="") || (firstNameValue.val()==="") || canvas.isEmpty){
                $('#comments').css("display", "block");
                $('#comments').text("Merci de remplir tous les champs.");
            } else {
                $('#confirmation_reservation').css("display", "block");
                $('#confirmation_reservation').text("Un vélo a bien été réservé")
                $('#comments').css("display", "none");
                $(".resume").css('display', 'block');
                Reservation.addNewReservation(nameValue.val(), firstNameValue.val(), stationNameValue.text(), endDateValue, Map.selectedStation);
            }
        }

});

})
