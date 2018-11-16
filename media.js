function media(name, info, soundUrl){
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
    return new Media();
}