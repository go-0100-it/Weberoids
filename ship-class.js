class Ship extends Sprite{
    constructor(pos, vel, ang, ang_vel, media){
        super(pos, vel, ang, ang_vel, media);
        this.health = media.gamePlayData.health;
        this.plasma = 0;
        this.projectileType = media.gamePlayData.projectileType;
    }
    check_for_collision(objs, to_remove, game){
        let CONST = game.getResources().CONST;
        let explosion1 = null;
        let objs_to_remove = [];
        let len = objs.length;
        for(let i = 0; i < len; i++){
            if(Sprite.collision_detect(this, objs[i])){

                if(objs[i].name == CONST.HEART_ANIMATION || objs[i].name == CONST.GREEN_ORB){
                    
                    explosion1 = this.collideWithBonus(objs[i].name, game);
                
                }else{
                    
                     explosion1 = this.collideWithSpaceProjectile(objs[i], to_remove, game);
                     
                }

                this.healthWarning(game);
                
                if(explosion1){
                    game.animations.push(explosion1);
                    if(explosion1.sound){
                        explosion1.sound[0].play();
                    }
                }
                objs_to_remove.push(objs[i]);
            }  
        }                
        return objs.diff(objs_to_remove);
        super.check_for_collision();
    }

    collideWithSpaceProjectile(obj, to_remove, game){

        let CONST = game.getResources().CONST;
        let animation = null;
        let animation2 = null;
        let type = obj.name;
        switch(type){
            case CONST.ASTEROID:
                this.health -= obj.health * 10;
                animation = game.spriteFactory.createExplosion(obj.pos, obj.vel, 0, 0, game.resources.getResource(CONST.ASTEROID_EXPLOSION));
                if(this.health < 0){
                    animation2 = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource(CONST.SHIP_EXPLOSION));
                    to_remove.push(this);
                    game.state.lose_life();
                    if(this.isThrusting()){
                        this.thrustersOff();
                    }
                    let index = game.soundsPlaying.indexOf(this.sound[1]);
                    if (index > -1) {
                        game.soundsPlaying.splice(index, 1);
                    }
                    this.sound[1].pause(); 
                }else{
                    animation2 = game.spriteFactory.createStaticAnimated([0,0], [0,0], 0, 0, game.resources.getResource(CONST.WARN_FRAME));
                }
                break;
            case CONST.ASTEROID_DEBRIS:
                animation = game.spriteFactory.createExplosion(obj.pos, obj.vel, 0, 0, game.resources.getResource(CONST.ASTEROID_DEBRIS_EXPLOSION));
                break;
            default:
                break;
        }
        if(animation){
            game.animations.push(animation);
            if(animation.sound){
                animation.sound[0].play();
            }
        }
        return animation2;
    }

    collideWithBonus(type, game){
        let CONST = game.getResources().CONST;
        let animation = null;
        switch(type){

            case CONST.HEART_ANIMATION:
                animation = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource(CONST.HEART_COLLECTED));       
                if(this.health + 20 > 250){
                    this.health = 250;
                }else{
                    this.health += 20;
                }
                //this.healthWarning(game);
                break;

            case CONST.GREEN_ORB:
                animation = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource(CONST.GREEN_ORB_COLLECTED));
                if(this.plasma + 20 > 250){
                    this.plasma = 250;
                }else{
                    this.plasma += 20;
                }
                this.projectileType = CONST.FORCE_MISSILE;
                break;

            default:
                break;
        }
        return animation;
    }

    healthWarning(game){
        let index = game.soundsPlaying.indexOf(this.sound[1]);
        if(this.health > -1 && this.health < 50){
            game.shipHealthLow = true;
            this.sound[1].loop = true;
            this.sound[1].volume = 0.3;
            this.sound[1].play();
            if(index === -1) {
                game.soundsPlaying.push(this.sound[1]);
            }
        }else{
            game.shipHealthLow = false;
            if(index > -1) {
                game.soundsPlaying.splice(index, 1);
            }
            this.sound[1].pause();
        }
    }

    thrustersOn(){
        if(this.sound){
            this.sound[0].play();
        } 
        this.thrust = true;
    }  
        
    thrustersOff(){
        if(this.sound){
            this.sound[0].pause();
        } 
        this.thrust = false;
    }  
        
    isThrusting(){
        return this.thrust;
    }
        
    rotate(direction){
        if(direction == "CLOCKWISE"){
            this.angle_vel = 4;
        }    
        else if(direction == "COUNTERCLOCKWISE"){
            this.angle_vel = -4;
        }
        else{
            this.angle_vel = 0;
        }   
    }


    update_friction(env){
        this.vel[0] = this.vel[0] * (1 - env.utils.const);
        this.vel[1] = this.vel[1] * (1 - env.utils.const);
    }   
        
    shoot(game){
        if(this.plasma > 0){
            this.plasma -= 1;
        }
        let CONST = game.getResources().CONST;
        let pos_x = this.pos[0] + ((this.pos[0] + this.radius - this.pos[0]) * Math.cos(this.angle)) + ((this.pos[1] - this.pos[1]) * Math.sin(this.angle));
        let pos_y = this.pos[1] + ((this.pos[1] - this.pos[1]) * Math.cos(this.angle)) + ((this.pos[0] + this.radius - this.pos[0]) * Math.sin(this.angle));
        let pos = [pos_x, pos_y];
        let forward = [Math.cos(this.angle), Math.sin(this.angle)];
        let vel_x = this.vel[0] + forward[0]*10;
        let vel_y = this.vel[1] + forward[1]*10;
        if(this.plasma < 1){
            this.projectileType = CONST.BASIC_MISSILE
        }
        game.addExplosiveProjectile(this.projectileType, pos, [vel_x, vel_y], this.angle, 0);
    }    
    
    update_thrust(){
        let forward = [Math.cos(this.angle), Math.sin(this.angle)]
        this.vel[0] += forward[0]/3
        this.vel[1] += forward[1]/3
    }

    update(env, factor){
        this.angle += Math.rad(this.angle_vel);
        this.update_position(env, factor);
        this.update_friction(env);
        return;
        super.update();
    }
}
