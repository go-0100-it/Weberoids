function createSpriteFactory(){
    class Sprite{
        constructor(pos, vel, ang, ang_vel, media){
            this.pos = [pos[0] , pos[1]];
            this.vel = [vel[0],vel[1]];
            this.angle = ang;
            this.angle_vel = ang_vel;
            this.image = media.image;
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

        static checkBounds(pos, vel, axis, size){
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
            canvas.drawImage(this.getImage(), x, y, size[0], size[1], -ctr[0], -ctr[1], size[0], size[1]);
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
            this.pos[0] = pos ? pos[0] : Sprite.checkBounds(this.pos[0], this.vel[0] * factor, width, size[0])
            this.pos[1] = pos ? pos[1] : Sprite.checkBounds(this.pos[1], this.vel[1] * factor, height, size[1])
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
                x = size[0] * this.getAge(); 
            }else if(this.getName() === CONST.BASIC_SHIP && this.isThrusting()){
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
            let len = objs1.length;
            for(let i = 0; i < len; i++){
                if(Sprite.collision_detect(this, objs1[i])){
                    let explosionType = null;
                    let explosion = null;
                    game.state.update_level();
                    if(this.name === CONST.ASTEROID){
                        game.state.increment_score(50);
                        explosionType = CONST.ASTEROID_EXPLOSION;
                        game.addSpaceProjectile(CONST.ASTEROID_DEBRIS, this.pos, this.vel, 0, 0);
                    }else if(this.name === CONST.ASTEROID_DEBRIS){
                        game.state.increment_score(100);
                        explosionType = CONST.ASTEROID_DEBRIS_EXPLOSION;
                    }
                    explosion = game.addExplosion(explosionType, this.pos, this.vel, 0, 0);
                    if(explosion.sound){
                        explosion.playSound();
                    }
                    objs1_to_remove.push(objs1[i]);
                    if(objs2.indexOf(this) !== -1){
                        objs2_to_remove.push(this);
                    }
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

    class ExplosiveProjectile extends Sprite{


    }

    class Ship extends Sprite{
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
            game.addExplosiveProjectile(CONST.BASIC_MISSILE, pos, [vel_x, vel_y], 0, this.angle_vel);
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

    class Explosion extends Sprite{
        update(env, factor){
            super.update(env, factor);
        }
        
    }

    class SpaceProjectile extends Sprite{}

    class Static extends Sprite{
        draw(canvas, env, orig_size, t){
            let center = env.getCanvasCenter();
            let x_pos = 0;
            let y_pos = 0;
            let x_size = env.getCanvasWidth();
            let y_size = env.getCanvasHeight();
            if(orig_size){
                x_pos = center[0] - this.image_size[0]/2;
                y_pos = center[1] - this.image_size[1]/2;
                x_size = this.image_size[0];
                y_size = this.image_size[1];
            }
            if(t){
                canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], t, 0, x_size, y_size);
                canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], t - x_size, 0, x_size, y_size);
            }else{
                canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], x_pos, y_pos, x_size, y_size);
            }
            return;
            super.draw();
        }
    }

    function createExplosiveProjectile(pos, vel, ang, ang_vel, media){
        return new ExplosiveProjectile(pos, vel, ang, ang_vel, media);
    }

    function createShip(pos, vel, ang, ang_vel, media){
        return new Ship(pos, vel, ang, ang_vel, media);
    }

    function createExplosion(pos, vel, ang, ang_vel, media){
        return new Explosion(pos, vel, ang, ang_vel, media);
    }

    function createSpaceProjectile(pos, vel, ang, ang_vel, media){
        return new SpaceProjectile(pos, vel, ang, ang_vel, media);
    }

    function createBackgroundProjectile(pos, vel, ang, ang_vel, media){
        return new BackgroundProjectile(pos, vel, ang, ang_vel, media);
    }

    function createStatic(pos, vel, ang, ang_vel, media){
        return new Static(pos, [0, 0], 0, 0, media);
    }

    return {
        createExplosiveProjectile: createExplosiveProjectile,
        createShip: createShip,
        createExplosion: createExplosion,
        createSpaceProjectile: createSpaceProjectile,
        createBackgroundProjectile: createBackgroundProjectile,
        createStatic: createStatic
    };
}
