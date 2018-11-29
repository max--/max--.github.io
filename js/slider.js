var slider = {
    width : null,


    init: function(){
        slider.playing = true;
        slider.elem = $(".slider");
        slider.nbSlides = slider.elem.children().length;
        slider.currentSlide = 0;
        slider.isSliding = false;

        $("#next").on("click", function(){
            slider.next();
        });

        $("#prev").on("click", function(){
            slider.prev();
        });

        pauseButton.on("click", function(){
            if (slider.playing){
                slider.pauseSlider();
            } else {
                slider.playSlider();
            }
        });
    },

    next: function() {
        if(!slider.isSliding) {
            slider.stop_defil();
            if(slider.currentSlide >= slider.nbSlides - 1) {
                slider.currentSlide = 0;
            } else {
                slider.currentSlide++;
            }
            slider.isSliding = true;
            slider.elem.stop().animate({marginLeft: -slider.currentSlide * slider.width + "px"}, {
                duration: 1000,
                complete: function() {
                    slider.isSliding = false;
                    if(!slider.playing){
                        slider.stop_defil()
                    } else {
                    slider.play_defil();
                    }
                },
            });
        }
    },

    prev: function() {
        if(!slider.isSliding) {
            slider.stop_defil();
            if(slider.currentSlide <= 0) {
                slider.currentSlide = slider.nbSlides - 1;
            } else {
                slider.currentSlide--;
            }
            slider.isSliding = true;
            slider.elem.stop().animate({marginLeft: -slider.currentSlide * slider.width + "px"}, {
                duration: 1000,
                complete: function() {
                    slider.isSliding = false;
                    if(!slider.playing){
                        slider.stop_defil()
                    } else {
                    slider.play_defil();
                    }
                }
            });
        }
    },

    pauseSlider: function () {
        // pauseButton.removeClass("fa-pause");
        // pauseButton.addClass("fa-play");
        pauseButton.toggleClass("fa-play");
        slider.playing = false;
        slider.stop_defil();

    },

    playSlider: function(){
        // pauseButton.removeClass("fa-play");
        // pauseButton.addClass("fa-pause");
        pauseButton.toggleClass("fa-play");
        slider.playing = true;
        slider.play_defil();
    },

    play_defil: function() {
        slider.timer = window.setInterval(slider.next, 5000);
    },

    stop_defil: function() {
        window.clearInterval(slider.timer);
    },

    listenKeyPress: function(){
        document.addEventListener("keydown", function(e){
            if(e.keyCode === 37){
                slider.prev();
            }
            else if(e.keyCode === 39){
                slider.next();
            }
            console.log("Evènement clavier : " + e.type + ", touche : " + e.keyCode);
        });    
    },

    resizeSlider: function(){
        var pageWidth = $(window).width();
        if(pageWidth < 610) {
            slider.width = 300;
        } else {
            slider.width = 550;
        }
        console.log("width: ", slider.width);
    }
}