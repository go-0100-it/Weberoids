class Sprite{
    constructor(pos, vel, ang, ang_vel, media){
        this.pos = [pos[0] , pos[1]];
        this.vel = [vel[0],vel[1]];
        this.angle = ang;
        this.angle_vel = ang_vel;
        this.image = media.image[0];
        this.images = media.image;
        this.name = media.name;
        this.image_center = media.info.get_center();
        this.image_size = media.info.get_size();
        this.radius = media.info.get_radius();
        this.lifespan = media.info.get_lifespan();
        this.animated = media.info.get_animated();
        this.age = 0;
        this.sound = media.sound
    }

    // helper functions to handle transformations
    static dist(p,q){
        return Math.sqrt((p[0] - q[0]) ** 2+(p[1] - q[1]) ** 2)
    }
    

    static collision_detect(obj1, obj2){
        if(Sprite.dist(obj1.pos, obj2.pos) < obj1.radius + obj2.radius){
            return true;
        }
        else{
            return false;
        }
    }

    checkBounds(pos, vel, axis, size){
        if(pos + vel > axis + size / 2){
            return 0;
        }
        else if(pos + vel < 0 - size / 2){
            return axis;
        }  
        else{
            pos += vel;
            return pos;
        }    
    }

    isAnimation(){return this.animated;};

    getImage(){return this.image;};

    getAge(){return this.age;};

    resetAge(){
        this.age = 1;
    }

    increaseAge(int){
        this.age += int;
    };

    getAngle(){return this.angle;};

    increaseAng(float){
        this.angle += float;
    };

    increaseAngVel(float){
        this.angle_vel += float;
    }

    getAngVel(){return this.angle_vel;};

    setAngVel(float){
        this.angle_vel += float;
    };

    getPos(){return this.pos;};

    getName(){return this.name;};

    getImageSize(){return this.image_size;};

    getImageCenter(){return this.image_center;};

    drawRotated(canvas, x, y, new_x, new_y){
        let pos = this.getPos();
        let size = this.getImageSize()
        let ang = this.getAngle();
        let rad = Math.rad(ang);
        let ctr = this.getImageCenter();
        canvas.translate(pos[0], pos[1]);
        canvas.rotate(ang);
        canvas.drawImage(this.image, x, y, size[0], size[1], -ctr[0], -ctr[1], size[0], size[1]);
        canvas.rotate(-ang);
        canvas.translate(-pos[0], -pos[1]);
    }

    getWidth(){
        return this.image_size[0];
    }

    getHeight(){
        return this.image_size[1];
    }
    
    update_position(env, factor, pos){
        let width = env.getCanvasWidth();
        let height = env.getCanvasHeight();
        let size = this.getImageSize();
        this.pos[0] = pos ? pos[0] : this.checkBounds(this.pos[0], this.vel[0] * factor, width, size[0]);
        this.pos[1] = pos ? pos[1] : this.checkBounds(this.pos[1], this.vel[1] * factor, height, size[1]);
    }

    playSound(){
        if(this.sound){
            this.sound.play();
        }
    }
        
    draw(canvas, env, factor){
        let CONST = env.getResources().CONST;
        let img_ctr = this.getImageCenter();
        let size = this.getImageSize();
        let half_img_x = size[0] / 2
        let half_img_y = size[1] / 2
        let x = img_ctr[0] - half_img_x;
        let y = img_ctr[1] - half_img_y;
        if(this.isAnimation()){
            if(this.name === CONST.GREEN_ORB){
                if(this.getAge() === this.lifespan){
                    this.resetAge();
                }
            }
            x = size[0] * this.getAge();
           
        }else if((this.getName() === CONST.BLUE_SHIP || this.getName() === CONST.BASIC_SHIP) && this.isThrusting()){
            x = size[0]; 
            this.update_thrust()
        }
        let new_x = this.pos[0] - half_img_x;
        let new_y = this.pos[1] - half_img_y;
        if(this.getAngle() !== 0){
            this.drawRotated(canvas, x, y, new_x, new_y)
        }else{
            canvas.drawImage(this.getImage(), x, y, size[0], size[1], new_x, new_y, size[0], size[1]);
        }
    }   
    
    update(env, factor){
        this.update_position(env, factor);
        this.increaseAge(1);
        this.increaseAng(Math.deg(this.getAngVel()));
    }  
        
    check_for_collision(objs1, objs2, objs2_to_remove, game){
        let CONST = game.getResources().CONST;
        let objs1_to_remove = [];
        let len12 = objs1.length;
        for(let i = 0; i < len12; i++){
            if(Sprite.collision_detect(this, objs1[i])){
                let explosionType = null;
                let explosion = null;
                let healthDepleted = false;


                if(this.name === CONST.ASTEROID){
                    if(this.health - objs1[i].power < 1){
                        game.state.increment_score(50 * this.health);
                    }else{
                        game.state.increment_score(50 * objs1[i].power);
                    }
                    this.health = this.health - objs1[i].power;
                    explosionType = CONST.MISSILE_EXPLOSION;
                    if(this.health < 1){
                        healthDepleted = true;
                        explosionType = CONST.ASTEROID_EXPLOSION;
                    }else{
                        this.image = this.images[5 - this.health];
                    }
                    //game.addSpaceProjectile(CONST.ASTEROID_DEBRIS, this.pos, this.vel, 0, 0);


                }else if(this.name === CONST.ASTEROID_DEBRIS){
                    game.state.increment_score(100);
                    explosionType = CONST.ASTEROID_DEBRIS_EXPLOSION;
                }


                explosion = game.addExplosion(explosionType, this.pos, this.vel, 0, 0);
                if(explosion.sound){
                    explosion.playSound();
                }
                objs1_to_remove.push(objs1[i]);
                if(objs2.indexOf(this) !== -1 && healthDepleted){
                    objs2_to_remove.push(this);
                }
                if(game.state.update_level()){
                    game.level_up();
                };
            }
        }
       return objs1.diff(objs1_to_remove);
    }         
    
    check_expiry(){
        if(this.age >= this.lifespan){
            return true;
        }   
        else{
            return false;
        }
    }
}