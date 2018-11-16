function init_resources(){

    let game_resources = []

    function getTotalImages(arr){
        cnt = 0
        for(i = 0; i < game_resources.length; i++){
            if(arr[i].info !== null && arr[i].info.src !== null){
                cnt++;
            }
        }
        return cnt
    }

    function getResource(name){
        let len = game_resources.length;
        for(i =0; i < len; i++){
            if(game_resources[i].name === name){
                return game_resources[i];
            }
        }
        return null;
    }

       // Create the flag letiables (counter and total of images)
    let _cnt = 0;
    let loaded_cnt = 0;
    let totalImages = getTotalImages(game_resources);

    // Store the images that were not correctly loaded inside an array to show later
    let notLoadedImages = [];

    // The callback that is executed when all the images have been loaded or not
    let allLoadedCallback = function(){
        console.log("GOOD NEWS, all images were successfully loaded");
       init_environment({getResource: getResource, CONST: CONST});
    };

    // The onload callback is triggered every time an image is loaded
    let onloadCallback = function(){
        // Increment the counter
        loaded_cnt += 1;
        _cnt += 1;
        totalImages = getTotalImages(game_resources)
        if(_cnt === totalImages){
            if(loaded_cnt == totalImages){
                allLoadedCallback();
            }else{
                console.error("IMAGES NOT LOADED: ");
                console.error(notLoadedImages);
            }
        }     
    };

    // The onerror callback is triggered everytime an image couldn't be loaded
    let onerrorCallback = function(){
        _cnt += 1;
        // Add the current image to the list of not loaded images
        notLoadedImages.push(this.src);
        if(_cnt === getTotalImages(game_resources)){
            console.error("IMAGES NOT LOADED: ");
            console.error(notLoadedImages);
        }
    };

    class Constants{
        constructor(){
            this.SOUND_TRACK = "Sound track";
            this.SPALSH = "Splash";
            this.PAUSED = "Paused message";
            this.DEBRIS = "Debris";
            this.BASIC_SHIP = "Basic ship";
            this.BASIC_MISSILE = "Basic missile";
            this.BASIC_SPACE = "Basic space";
            this.BLUE_NEBULA = "Blue Nebula";
            this.BROWN_NEBULA = "Brown Nebula";
            this.ASTEROID = "Asteroid";
            this.ASTEROID_DEBRIS = "Astroid debris";
            this.ASTEROID_EXPLOSION = "Asteroid explosion";
            this.ASTEROID_DEBRIS_EXPLOSION = "Asteroid debris explosion";
            this.SHIP_EXPLOSION = "Ship explosion";
        }
    }

    let CONST = new Constants();

    class Media{
        constructor(name, info, soundUrl){
            this.name = name;
            this.info = info;
            this.image = null;
            this.sound = null;
            this.soundUrl = soundUrl;
            this.img_loaded = false;
            this.sound_loaded = false;
        }

        setSound(sound){this.sound = sound;};

        getName(){return this.name;};

        getInfo(){return this.info;};

        getImage(){return this.image;};

        getSound(){return this.sound;}

        getSoundUrl(){return this.soundUrl;};
        
        loadImage(){
            if(this.info !== null && this.info.src !== null){
                let src = this.getInfo().src;
                this.image = new Image();
                this.image.onload = onloadCallback;
                this.image.onerror = onerrorCallback;
                this.image.src = src;
            } 
        }

        // audioSupport() {
        //     var a = document.createElement('audio');
        //     var ogg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
        //     if (ogg) return 'ogg';
        //     var mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        //     if (mp3) return 'mp3';
        //     else return 0;
        // } 

        loadAudio(url, vol){
            let audio = new Audio();
            audio.src = url;
            audio.preload = "auto";
            audio.volume = vol;
            return audio;
        }

        loadSound(vol = 1){
            if(this.getSoundUrl() !== null){
                this.setSound(this.loadAudio(this.getSoundUrl(), vol));
                this.sound.addEventListener('canplaythrough', this.soundLoaded, false);
            }
        }

        imgWidth(){
            return this.info.get_size()[0];
        }

        imgHeight(){
            return this.info.get_size()[1];
        }
    }
       

    class ImageInfo{
        constructor(name, src, center, size, radius = 0, lifespan = null, animated = false){
            this.name = name;
            this.src = src
            this.center = center;
            this.size = size;
            this.radius = radius;
            if(lifespan)
                this.lifespan = lifespan;
            else
                this.lifespan = Math.pow(10, 1000);
            this.animated = animated;
        }   
        get_name(){
            return this.name;
        }
        get_center(){
            return this.center;
        }
        get_size(){
            return this.size;
        }
        get_radius(){
            return this.radius;
        }
        get_lifespan(){
            return this.lifespan;
        }
        get_animated(){
            return this.animated;
        }
    }

    // alternative upbeat soundtrack by composer and former IIPP student Emiel Stopler
    // please do not redistribute without permission from Emiel at http://www.filmcomposer.nl
    //soundtrack = "https://storage.googleapis.com/codeskulptor-assets/ricerocks_theme.mp3")
        
    let explosion_sound = "http://www.davewaters.ca/res/sounds/explosion.mp3";
    // art assets created by Kim Lathrop, may be freely re-used in non-commercial projects, please credit Kim
    
    // sound assets purchased from sounddogs.com, please do not redistribute
    game_resources.push(
        new Media(
            CONST.SOUND_TRACK,
            null,
            //"http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3"
            //"http://www.davewaters.ca/res/sounds/soundtrack2.mp3"
            "http://www.davewaters.ca/res/sounds/IntoTheSing.mp3"
        )
    )
    // debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
    //                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
    game_resources.push(
        new Media(
            CONST.DEBRIS,
            new ImageInfo(CONST.DEBRIS, "http://www.davewaters.ca/res/images/debris2_blue.png", [320, 240], [640, 480]),
            null
        ) 
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            CONST.BASIC_SPACE,
            new ImageInfo(CONST.BASIC_SPACE, "http://www.davewaters.ca/res/images/basic_space.jpg", [400, 300], [800, 600]),
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            CONST.BLUE_NEBULA,
            new ImageInfo(CONST.BLUE_NEBULA, "http://www.davewaters.ca/res/images/nebula_blue.png", [400, 300], [800, 600]),
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            CONST.BROWN_NEBULA,
            new ImageInfo(CONST.BROWN_NEBULA, "http://davewaters.ca/res/images/nebula_brown.png", [400, 300], [800, 600]),
            null
        )
    )
    // splash image
    game_resources.push(
        new Media(
            CONST.SPLASH,
            new ImageInfo(CONST.SPLASH, "http://davewaters.ca/res/images/splash.png", [200, 150], [400, 300]),
            null
        )
    )
    // paused message image
    game_resources.push(
        new Media(
            CONST.PAUSED,
            new ImageInfo(CONST.PAUSED, "http://davewaters.ca/res/images/paused.png", [200, 40], [400, 80]),
            null
        )
    )
    // ship image
    game_resources.push(
        new Media(
            CONST.BASIC_SHIP,
            new ImageInfo(CONST.BASIC_SHIP, "http://davewaters.ca/res/images/double_ship.png", [45, 45], [90, 90], 35),
            "http://davewaters.ca/res/sounds/thrust.mp3"
        )
    )
    // missile image - shot1.png, shot2.png, shot3.png
    game_resources.push(
        new Media(
            CONST.BASIC_MISSILE,
            new ImageInfo(CONST.BASIC_MISSILE, "http://davewaters.ca/res/images/shot2.png", [5,5], [10, 10], 4, 60),
            "http://www.davewaters.ca/res/sounds/laser.mp3"
        )
    )
    // asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
    game_resources.push(
        new Media(
            CONST.ASTEROID,
            new ImageInfo(CONST.ASTEROID, "http://davewaters.ca/res/images/asteroid_blue.png", [45, 45], [90, 90], 40),
            null
        )
    )
    game_resources.push(
        new Media(
            CONST.ASTEROID_DEBRIS,
            new ImageInfo(CONST.ASTEROID_DEBRIS, "http://davewaters.ca/res/images/asteroid_chunk.png", [22.5, 22.5], [45, 45], 20),
            null
        )
    )
    // animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
    game_resources.push(
        new Media(
            CONST.ASTEROID_EXPLOSION,
            new ImageInfo(CONST.ASTEROID_EXPLOSION, "http://www.davewaters.ca/res/images/rock_explode.png", [60, 60], [120, 120], 20, 48, true),
            explosion_sound
        )
    )
    game_resources.push(
        new Media(
            CONST.ASTEROID_DEBRIS_EXPLOSION,
            new ImageInfo(CONST.ASTEROID_DEBRIS_EXPLOSION, "http://www.davewaters.ca/res/images/asteroid_debris_explode.png", [30, 30], [60, 60], 10, 24, true),
            explosion_sound
        )
    )
    game_resources.push(
        new Media(
            CONST.SHIP_EXPLOSION,
            new ImageInfo(CONST.SHIP_EXPLOSION, "http://www.davewaters.ca/res/images/explosion_alpha.png", [64, 64], [128, 128], 17, 24, true),
            "http://www.davewaters.ca/res/sounds/ship_explosion.mp3"
        )
    )
    let len = game_resources.length;

    // Load the images !
    for(i = 0; i < len; i++){
        game_resources[i].loadImage();
        game_resources[i].loadSound();
    }
    
}

