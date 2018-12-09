var MyIcon = L.DivIcon.extend({
    options: {
        className: 'my-div-icon',
        html: '<i class="fas fa-map-marker-alt fa-3x"></i>',
        iconAnchor: [22, 94],
    },
});

var greenIcon = new MyIcon({className: 'marker-green'}),
    redIcon = new MyIcon({className: 'marker-red'}),
    orangeIcon = new MyIcon({className: 'marker-orange'});

const highWarningAvailability = 50;
const lowWarningAvailability = 10

var Marqueur = {

    getIcon: function(availability) {
        if(availability > highWarningAvailability) {
            return greenIcon;
        } else if(availability > lowWarningAvailability) {
            return orangeIcon;
        } else {
            return redIcon;
        }
    },

}
