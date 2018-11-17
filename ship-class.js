class Ship extends Sprite{
    constructor(pos, vel, ang, ang_vel, media, health = 1){
        super(pos, vel, ang, ang_vel, media);
        this.health = health;
    }
    check_for_collision(objs, to_remove, game){
        let CONST = game.getResources().CONST;
        let explosion1 = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource(CONST.SHIP_EXPLOSION));
        let objs_to_remove = [];
        let len = objs.length;
        for(let i = 0; i < len; i++){
            if(Sprite.collision_detect(this, objs[i])){
                let explosion2 = game.spriteFactory.createExplosion(objs[i].pos, objs[i].vel, 0, 0, game.resources.getResource(CONST.ASTEROID_EXPLOSION));
                game.explosions.push(explosion2);
                game.explosions.push(explosion1);
                if(explosion1.sound){
                    explosion1.playSound();
                }
                if(explosion2.sound){
                    explosion2.playSound();
                } 
                game.state.lose_life();
                to_remove.push(this);
                
                if(this.isThrusting()){
                    this.thrustersOff();
                } 
                objs_to_remove.push(objs[i]);
            }  
        }                
        return objs.diff(objs_to_remove);
        super.check_for_collision();
    }

    thrustersOn(){
        if(this.sound){
            this.playSound();
        } 
        this.thrust = true;
    }  
        
    thrustersOff(){
        if(this.sound){
            this.sound.pause();
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
        this.vel[0] = this.vel[0] * (1 - env.utils.const)
        this.vel[1] = this.vel[1] * (1 - env.utils.const)
    }   
        
    shoot(game){
        let CONST = game.getResources().CONST;
        let pos_x = this.pos[0] + ((this.pos[0] + this.radius - this.pos[0]) * Math.cos(this.angle)) + ((this.pos[1] - this.pos[1]) * Math.sin(this.angle))
        let pos_y = this.pos[1] + ((this.pos[1] - this.pos[1]) * Math.cos(this.angle)) + ((this.pos[0] + this.radius - this.pos[0]) * Math.sin(this.angle))
        let pos = [pos_x, pos_y]
        let forward = [Math.cos(this.angle), Math.sin(this.angle)]
        let vel_x = this.vel[0] + forward[0]*10
        let vel_y = this.vel[1] + forward[1]*10
        game.addExplosiveProjectile(CONST.BASIC_MISSILE, pos, [vel_x, vel_y], this.angle, 0);
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
