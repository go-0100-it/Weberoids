function getMediaList(Media, ImageInfo, GamePlayData){

    class Constants{
        constructor(){
            this.SOUND_TRACK = "Sound track";
            this.SPALSH = "Splash";
            this.PAUSED = "Paused message";
            this.DEBRIS = "Debris";
            this.BASIC_SHIP = "Basic ship";
            this.BLUE_SHIP = "Blue ship";
            this.BASIC_MISSILE = "Basic missile";
            this.FORCE_MISSILE = "Force missile";
            this.BASIC_SPACE = "Basic space";
            this.BLUE_NEBULA = "Blue Nebula";
            this.BROWN_NEBULA = "Brown Nebula";
            this.ASTEROID = "Asteroid";
            this.ASTEROID_DEBRIS = "Astroid debris";
            this.ASTEROID_EXPLOSION = "Asteroid explosion";
            this.ASTEROID_DEBRIS_EXPLOSION = "Asteroid debris explosion";
            this.SHIP_EXPLOSION = "Ship explosion";
            this.LEVEL_UP = "Level up";
            this.MISSILE_EXPLOSION = "Missile explosion";
        }
    }

    let CONST = new Constants();

    let media = [];
    let explosion_sound = "http://www.davewaters.ca/res/sounds/explosion.mp3";

    // alternative upbeat soundtrack by composer and former IIPP student Emiel Stopler
    // please do not redistribute without permission from Emiel at http://www.filmcomposer.nl
    //soundtrack = "https://storage.googleapis.com/codeskulptor-assets/ricerocks_theme.mp3")

    // art assets created by Kim Lathrop, may be freely re-used in non-commercial projects, please credit Kim
    
    // sound assets purchased from sounddogs.com, please do not redistribute
    media.push(
        new Media(
            CONST.SOUND_TRACK,
            null,
            //"http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3"
            //"http://www.davewaters.ca/res/sounds/soundtrack2.mp3"
            "http://www.davewaters.ca/res/sounds/IntoTheSing.mp3",
            null
        )
    )
    // debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
    //                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
    media.push(
        new Media(
            CONST.DEBRIS,
            new ImageInfo(CONST.DEBRIS, ["http://www.davewaters.ca/res/images/debris2_blue.png"], [320, 240], [640, 480]),
            null,
            null
        ) 
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    media.push(
        new Media(
            CONST.BASIC_SPACE,
            new ImageInfo(CONST.BASIC_SPACE, ["http://www.davewaters.ca/res/images/basic_space.jpg"], [400, 300], [800, 600]),
            null,
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    media.push(
        new Media(
            CONST.BLUE_NEBULA,
            new ImageInfo(CONST.BLUE_NEBULA, ["http://www.davewaters.ca/res/images/nebula_blue.png"], [400, 300], [800, 600]),
            null,
            null
        )
    )
    // nebula images - nebula_brown.png, nebula_blue.png
    media.push(
        new Media(
            CONST.BROWN_NEBULA,
            new ImageInfo(CONST.BROWN_NEBULA, ["http://davewaters.ca/res/images/nebula_brown.png"], [400, 300], [800, 600]),
            null,
            null
        )
    )
    // splash image
    media.push(
        new Media(
            CONST.SPLASH,
            new ImageInfo(CONST.SPLASH, ["http://davewaters.ca/res/images/splash.png"], [200, 150], [400, 300]),
            null,
            null
        )
    )
    // paused message image
    media.push(
        new Media(
            CONST.PAUSED,
            new ImageInfo(CONST.PAUSED, ["http://davewaters.ca/res/images/paused.png"], [200, 40], [400, 80]),
            null,
            null
        )
    )
    // ship image
    media.push(
        new Media(
            CONST.BASIC_SHIP,
            new ImageInfo(CONST.BASIC_SHIP, ["http://davewaters.ca/res/images/double_ship.png"], [45, 45], [90, 90], 35),
            "http://davewaters.ca/res/sounds/thrust.mp3",
            new GamePlayData(CONST.BASIC_SHIP, CONST.BASIC_MISSILE, 1, 1)
        )
    )
    // ship image
    media.push(
        new Media(
            CONST.BLUE_SHIP,
            new ImageInfo(CONST.BLUE_SHIP, ["http://davewaters.ca/res/images/blueships.png"], [75, 75], [150, 150], 50),
            "http://davewaters.ca/res/sounds/thrust.mp3",
            new GamePlayData(CONST.BLUE_SHIP, CONST.FORCE_MISSILE, 2, 2)
        )
    )
    // missile image - shot1.png, shot2.png, shot3.png
    media.push(
        new Media(
            CONST.BASIC_MISSILE,
            new ImageInfo(CONST.BASIC_MISSILE, ["http://davewaters.ca/res/images/shot2.png"], [5,5], [10, 10], 4, 60),
            "http://www.davewaters.ca/res/sounds/laser.mp3",
            new GamePlayData(CONST.BASIC_MISSILE, null, 1, 1)
        )
    )
    // missile image - shot1.png, shot2.png, shot3.png
    media.push(
        new Media(
            CONST.FORCE_MISSILE,
            new ImageInfo(CONST.FORCE_MISSILE, ["http://davewaters.ca/res/images/force_missile.png"], [40, 7.5], [80, 15], 4, 60),
            "http://www.davewaters.ca/res/sounds/laser.mp3",
            new GamePlayData(CONST.FORCE_MISSILE, null, 1, 3)
        )
    )
    // asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
    media.push(
        new Media(
            CONST.ASTEROID,
            new ImageInfo(CONST.ASTEROID, [
                "http://davewaters.ca/res/images/asteroid_blue5.png", 
                "http://davewaters.ca/res/images/asteroid_blue4.png",
                "http://davewaters.ca/res/images/asteroid_blue3.png",
                "http://davewaters.ca/res/images/asteroid_blue2.png",
                "http://davewaters.ca/res/images/asteroid_blue1.png",
            ], [45, 45], [90, 90], 40, null, false),
            null,
            new GamePlayData(CONST.ASTEROID, null, 5, 1)
        )
    )
    media.push(
        new Media(
            CONST.ASTEROID_DEBRIS,
            new ImageInfo(CONST.ASTEROID_DEBRIS, ["http://davewaters.ca/res/images/asteroid_chunk.png"], [22.5, 22.5], [45, 45], 20),
            null,
            new GamePlayData(CONST.ASTEROID_DEBRIS, null, 2, 1)
        )
    )
    // animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
    media.push(
        new Media(
            CONST.ASTEROID_EXPLOSION,
            new ImageInfo(CONST.ASTEROID_EXPLOSION, ["http://www.davewaters.ca/res/images/rock_explode2.png"], [60, 60], [120, 120], 20, 48, true),
            explosion_sound,
            null
        )
    )
    media.push(
        new Media(
            CONST.ASTEROID_DEBRIS_EXPLOSION,
            new ImageInfo(CONST.ASTEROID_DEBRIS_EXPLOSION, ["http://www.davewaters.ca/res/images/asteroid_debris_explode.png"], [30, 30], [60, 60], 10, 24, true),
            explosion_sound,
            null
        )
    )
    media.push(
        new Media(
            CONST.SHIP_EXPLOSION,
            new ImageInfo(CONST.SHIP_EXPLOSION, ["http://www.davewaters.ca/res/images/explosion_alpha.png"], [64, 64], [128, 128], 17, 24, true),
            "http://www.davewaters.ca/res/sounds/ship_explosion.mp3",
            null
        )
    )
    media.push(
        new Media(
            CONST.LEVEL_UP,
            new ImageInfo(CONST.LEVEL_UP, ["http://www.davewaters.ca/res/images/level_up.png"], [350, 230], [700, 460], 5, 50, true),
            "http://www.davewaters.ca/res/sounds/level_up.mp3",
            null
        )
    )
    media.push(
        new Media(
            CONST.MISSILE_EXPLOSION,
            new ImageInfo(CONST.MISSILE_EXPLOSION, ["http://www.davewaters.ca/res/images/missile_explosion.png"], [25, 25], [50, 50], 10, 24, true),
            explosion_sound,
            null
        )
    )
    return {
        media: media,
        CONST: CONST
    } 
}