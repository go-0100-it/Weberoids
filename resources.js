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
       init_environment({getResource: getResource, game_resources: game_resources});
    };

    // The onload callback is triggered everytime an image is loaded
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
        
        loadImage(){
            if(this.info !== null && this.info.src !== null){
                let src = this.info.src;
                this.image = new Image();
                this.image.onload = onloadCallback;
                this.image.onerror = onerrorCallback;
                this.image.src = src;
            } 
        }

        loadSound(){
            if(this.soundUrl !== null){
                let src = this.soundUrl;
                this.sound = new Audio(this.soundUrl);
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
            "Sound track",
            null,
            "http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3"
        )
    )
    // debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
    //                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
    game_resources.push(
        new Media(
            "Debris",
            new ImageInfo("Debris", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/debris2_blue.png", [320, 240], [640, 480]),
            null
        ) 
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            "Baisc Space",
            new ImageInfo("Nebula", "http://www.davewaters.ca/res/images/basic_space.jpg", [400, 300], [800, 600]),
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            "Blue Nebula",
            new ImageInfo("Nebula", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.png", [400, 300], [800, 600]),
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    game_resources.push(
        new Media(
            "Brown Nebula",
            new ImageInfo("Nebula", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_brown.png", [400, 300], [800, 600]),
            null
        )
    )
    // splash image
    game_resources.push(
        new Media(
            "Splash",
            new ImageInfo("Splash", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/splash.png", [200, 150], [400, 300]),
            null
        )
    )
    // ship image
    game_resources.push(
        new Media(
            "Basic ship",
            new ImageInfo("Basic ship", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/double_ship.png", [45, 45], [90, 90], 35),
            "http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3"
        )
    )
    // missile image - shot1.png, shot2.png, shot3.png
    game_resources.push(
        new Media(
            "Basic missile",
            new ImageInfo("Basic missile", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/shot2.png", [5,5], [10, 10], 4, 50),
            "http://www.davewaters.ca/res/sounds/laser.mp3"
        )
    )
    // asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
    game_resources.push(
        new Media(
            "Asteroid",
            new ImageInfo("Asteroid", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blue.png", [45, 45], [90, 90], 40),
            null
        )
    )
    game_resources.push(
        new Media(
            "Asteroid debris",
            new ImageInfo("Asteroid debris", "http://davewaters.ca/res/images/asteroid_chunk.png", [22.5, 22.5], [45, 45], 20),
            null
        )
    )
    // animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
    game_resources.push(
        new Media(
            "Asteroid explosion",
            new ImageInfo("Asteroid explosion", "http://www.davewaters.ca/res/images/rock_explode.png", [60, 60], [120, 120], 20, 48, true),
            explosion_sound
        )
    )
    game_resources.push(
        new Media(
            "Asteroid debris explosion",
            new ImageInfo("Asteroid debris explosion", "http://www.davewaters.ca/res/images/asteroid_debris_explode.png", [30, 30], [60, 60], 10, 24, true),
            explosion_sound
        )
    )
    game_resources.push(
        new Media(
            "Ship explosion",
            new ImageInfo("Ship explosion", "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/explosion_alpha.png", [64, 64], [128, 128], 17, 24, true),
            explosion_sound
        )
    )
    let len = game_resources.length;

    // Load the images !
    for(i = 0; i < len; i++){
        game_resources[i].loadImage();
        game_resources[i].loadSound();
    }
    
}

