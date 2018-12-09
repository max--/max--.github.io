const Slider = {

    init: function(){
        this.elem = $(".slider");

        this.playing = false;
        this.isSliding = false;

        this.width = 0;

        // Durée de l'interval, en millisecondes
        this.autoNextIntervalDuration = 5000;
        // Permet de pouvoir arrêter l'execution de l'interval par la suite
        this.autoNextIntervalHolder = null;

        this.currentSlide = 0;
        this.nbSlides = this.elem.children().length;

        this.autoNextButton = $(".bouton_slider");

        $("#next").on("click", function(){
            Slider.next();
        });

        $("#prev").on("click", function(){
            Slider.previous();
        });

        this.autoNextButton.on("click", function(){
            if (Slider.playing){
                Slider.pauseSlider();
            } else {
                Slider.playSlider();
            }
        });

        this.setSize();
        this.startAutoNext();
        this.listenKeyPress();
        this.listenResize();
    },

    setSize : function(){
        var pageWidth = $(window).width();
        if(pageWidth < 610) {
            this.width = 300;
        } else {
            this.width = 550;
        }
    },

    next: function() {
        if(!Slider.isSliding) {
            Slider.stopAutoNext();
            if(Slider.currentSlide >= Slider.nbSlides - 1) {
                Slider.currentSlide = 0;
            } else {
                Slider.currentSlide++;
            }
            Slider.isSliding = true;
            Slider.elem.stop().animate({marginLeft: -Slider.currentSlide * Slider.width + "px"}, {
                duration: 1000,
                complete: function() {
                    Slider.isSliding = false;
                    if(!Slider.playing){
                        Slider.stopAutoNext()
                    } else {
                        Slider.startAutoNext();
                    }
                },
            });
        }
    },

    previous: function() {
        if(!Slider.isSliding) {
            Slider.stopAutoNext();
            if(Slider.currentSlide <= 0) {
                Slider.currentSlide = Slider.nbSlides - 1;
            } else {
                Slider.currentSlide--;
            }
            Slider.isSliding = true;
            Slider.elem.stop().animate({marginLeft: -Slider.currentSlide * Slider.width + "px"}, {
                duration: 1000,
                complete: function() {
                    Slider.isSliding = false;
                    if(!Slider.playing){
                        Slider.stopAutoNext()
                    } else {
                        Slider.startAutoNext();
                    }
                }
            });
        }
    },

    pauseSlider: function () {
        this.autoNextButton.removeClass("fa-pause");
        this.autoNextButton.addClass("fa-play");
        // pauseButton.toggleClass("fa-play");
        this.playing = false;
        this.stopAutoNext();
    },

    playSlider: function(){
        this.autoNextButton.removeClass("fa-play");
        this.autoNextButton.addClass("fa-pause");
        // pauseButton.toggleClass("fa-play");
        this.playing = true;
        this.startAutoNext();
    },

    startAutoNext: function() {
        this.autoNextIntervalHolder = window.setInterval(this.next, this.autoNextIntervalDuration);
    },

    stopAutoNext: function() {
        window.clearInterval(this.autoNextIntervalHolder);
    }, 

    listenKeyPress: function(){
        document.addEventListener("keydown", function(e){
            if(e.keyCode === 37){
                Slider.previous();
            }
            else if(e.keyCode === 39){
                Slider.next();
            }
            console.log("Evènement clavier : " + e.type + ", touche : " + e.keyCode);
        });
    },

    listenResize: function() {
        window.onresize = this.setSize;
    }
}
