// Slider
var pauseButton = null;

// Canvas
// var canvas = new Canvas("canvas");


// Réservation
var reservationButton = null;
var reservationResume = null;
var noReservation = true;

var nameValue = null;
var firstNameValue = null;
var stationNameValue = null;
var endDateValue = null;

// Timer
// Conversion en mms
var mms_day = 24 * 60 * 60 * 1000;
var mms_hour = 60 * 60 * 1000;
var mms_minute = 60 * 1000;
var mms_second = 1000;

const min = 0.2;
var timerLifetime = min * mms_minute; // temps de réservation en mms

var timerInterval = null;
var timeout;
var stopTimeOut = true;


$(document).ready(function() {
    window.onresize = slider.resizeSlider;

    pauseButton = $(".bouton_slider");
    reservationButton = $('#resaButton');
    reservationResume = $('.resume');

    // Slider
    // slider.resizeSlider();
    slider.init();
    slider.play_defil();
    slider.listenKeyPress();

    StorageAPI.load(Reservation);
    Reservation.displayResume();

    if(Reservation.stationName) {
        // Reservation.startTimer();
        console.log("Réservation en cours détectée", Reservation);
        $('#comments').text("Une réservation est déjà en cours.");
        $('#comments').css("display", "block");
    }

    // Map
    Map.init();
    window.Map = Map;

    canvas.init();

    reservationButton.on("click", function() {
        if((sessionStorage.getItem("reservationStationName") && sessionStorage.getItem("reservationEndDate"))){
            var confirmReservation = confirm("Une réservation est déjà en cours. Voulez-vous l'écraser ?");
            if(confirmReservation){
                endDateValue = new Date(Date.now() + timerLifetime).getTime();
                Reservation.addNewReservation();
            }
        } else {
            console.log("reservationButton:click", $('#name').val(), $('#first_name').val(), Reservation, canvas);
            nameValue = $('#name');
            firstNameValue = $('#first_name');
            stationNameValue = $('#name_station');
            endDateValue = new Date(Date.now() + timerLifetime).getTime();
            if((nameValue.val() ==="") || (firstNameValue.val()==="") || canvas.isEmpty){
                $('#comments').css("display", "block");
                $('#comments').text("Merci de remplir tous les champs.");
            } else {    
                $('#comments').css("display", "none");
                $(".resume").css('display', 'block');
                Reservation.addNewReservation();
            }
        }
    
});

})