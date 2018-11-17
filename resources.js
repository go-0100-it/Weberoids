function init_resources(){

    let game_resources = [];
    let CONST = {};

    function getTotalImages(arr){
        cnt = 0
        for(i = 0; i < game_resources.length; i++){
            if(arr[i].info !== null && arr[i].info.src !== null){
                cnt += arr[i].info.src.length;
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
        console.log("LOADED");
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
            this.image = [];
            this.sound = null;
            this.soundUrl = soundUrl;
            this.img_loaded = false;
            this.sound_loaded = false;
        }

        setSound(sound){this.sound = sound;};

        getName(){return this.name;};

        getInfo(){return this.info;};

        getImage(){return this.image1;};

        getSound(){return this.sound;}

        getSoundUrl(){return this.soundUrl;};
        
        loadImage(){
            if(this.info !== null && this.info.src !== null){
                console.log("LOADING IMAGE");
                let len = this.info.src.length;
                for(let i = 0; i < len; i++){
                    let src = this.getInfo().src[i];
                    this.image[i] = new Image();
                    this.image[i].onload = onloadCallback;
                    this.image[i].onerror = onerrorCallback;
                    this.image[i].src = src;
                }
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
            this.src = src;
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

    let resources = getMediaList(Media, ImageInfo)
    game_resources = resources.media;
    CONST = resources.CONST;
    let len = game_resources.length;

    // Load the images !
    for(i = 0; i < len; i++){
        game_resources[i].loadImage();
        game_resources[i].loadSound();
    }
    
}

