var canvas = {
    isEmpty : true,

    init : function(){
        canvasElt = document.getElementById('canvas');
        // canvasElt = $('#canvas')[0];
        var self = this;

        if (canvasElt.getContext) {
            var ctx = canvasElt.getContext('2d');
            var mousePos = {
                x:0,
                y:0
            };
            var lastPos = mousePos;

            canvasElt.addEventListener('mousedown', pointerDown, false);
            canvasElt.addEventListener('mouseup', pointerUp, false);
            canvasElt.addEventListener("touchstart", touchDown, false);
            canvasElt.addEventListener("touchend", touchUp, false);
            canvasElt.addEventListener("touchmove", touchMove, false);

            function pointerDown(e){
                lastPos = getMousePos(canvasElt, e);
                ctx.beginPath();
                ctx.moveTo(lastPos.x, lastPos.y);
                canvasElt.addEventListener('mousemove', draw, false);
            }

            function pointerUp(e){
                canvasElt.removeEventListener('mousemove', draw);
            }

            function draw(e){
                mousePos = getMousePos(canvasElt, e);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();
                lastPos = mousePos;
                self.isEmpty = false;
            }

            // Obtenir position relative de la souris sur canvas
            function getMousePos(canvasDom, mouseEvent) {
                var rect = canvasDom.getBoundingClientRect(); //envoie la taille d'un élément et sa position relative par rapport à la zone d'affichage (viewport).
                return {
                    x: mouseEvent.clientX - rect.left,
                    y: mouseEvent.clientY - rect.top
                };
            }

            function touchDown(e){
                mousePos = getTouchPos(canvasElt, e);
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvasElt.dispatchEvent(mouseEvent);
            };

            function touchUp(e) {
                var mouseEvent = new MouseEvent("mouseup", {});
                canvasElt.dispatchEvent(mouseEvent);
            };

            function touchMove(e){
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvasElt.dispatchEvent(mouseEvent);
            }

            // Obtenir position relative du toucher sur canvas
            function getTouchPos(canvasDom, touchEvent) {
                var rect = canvasDom.getBoundingClientRect();
                return {
                    x: touchEvent.touches[0].clientX - rect.left,
                    y: touchEvent.touches[0].clientY - rect.top
                };
            }
        }
    }
}
