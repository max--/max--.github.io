// var Canvas = function(idCanvas) {
//     this.idCanvas = idCanvas;
//     this.isEmpty = true;
//     this.canvasElement = null;
// };

// Canvas.prototype.init = function() {
//     this.canvasElement = document.getElementById(this.idCanvas);
//     if (this.canvasElement.getContext) {
//         var ctx = this.canvasElement.getContext('2d');

//         this.canvasElement.addEventListener('mousedown', pointerDown.bind(this));  //false
//         this.canvasElement.addEventListener('mouseup', pointerUp.bind(this)); //false

//         function pointerDown(e){
//             console.log("pointerDown()", this);
//             ctx.beginPath();
//             ctx.moveTo(e.offsetX, e.offsetY);
//             this.canvasElement.addEventListener('mousemove', draw.bind(this), true); // false
//         }

//         function pointerUp(e){
//             console.log("pointerUp()", this);
//             this.canvasElement.removeEventListener('mousemove', draw.bind(this), true);
//             // draw(e);
//         }

//         function draw(e){
//             console.log("draw()", this);
//             ctx.lineTo(e.offsetX, e.offsetY);
//             ctx.stroke();
//             this.isEmpty = false;
//         }
//     } else {
//         alert("Signature manuelle indisponible");
//     }
// };


var canvas = {
    isEmpty : true,

    init : function(){
        canvasElt = document.getElementById('canvas');
        var self = this;
        if (canvasElt.getContext) {
            var ctx = canvasElt.getContext('2d');

            canvasElt.addEventListener('mousedown', pointerDown);  //false
            canvasElt.addEventListener('mouseup', pointerUp); //false

            function pointerDown(e){
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
                canvasElt.addEventListener('mousemove', draw); // false
            }

            function pointerUp(e){
                canvasElt.removeEventListener('mousemove', draw);
                draw(e);
            }

            function draw(e){
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                self.isEmpty = false;
            }
        } else {
            alert("Signature manuelle indisponible");
        }
    },
}
