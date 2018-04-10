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

        drawRotated(canvas, x, y, new_x, new_y){
            let rad = Math.rad(this.angle)
            let pos = this.pos;
            canvas.translate(pos[0], pos[1]);
            canvas.rotate(this.angle);
            canvas.drawImage(this.image, x, y, this.image_size[0], this.image_size[1], -this.image_center[0], -this.image_center[1], this.image_size[0], this.image_size[1]);
            canvas.rotate(-this.angle);
            canvas.translate(-pos[0], -pos[1]);
        }

        getWidth(){
            return this.image_size[0];
        }

        getHeight(){
            return this.image_size[1];
        }
        
        update_position(env, factor, pos){
            this.pos[0] = pos ? pos[0] : Sprite.checkBounds(this.pos[0], this.vel[0] * factor, env.canvas.width, this.image_size[0])
            this.pos[1] = pos ? pos[1] : Sprite.checkBounds(this.pos[1], this.vel[1] * factor, env.canvas.height, this.image_size[1])
        }
            
        draw(canvas, env, factor){
            let img_ctr = this.image_center;
   
            let half_img_x = this.image_size[0] / 2
            let half_img_y = this.image_size[1] / 2
            let x = img_ctr[0] - half_img_x;
            let y = img_ctr[1] - half_img_y;
            if(this.animated){
                x = this.image_size[0] * this.age; 
            }else if(this.thrust){
                x = this.image_size[0]; 
                this.update_thrust()
            }
            let new_x = this.pos[0] - half_img_x;
            let new_y = this.pos[1] - half_img_y;
            if(this.angle !== 0){
                this.drawRotated(canvas, x, y, new_x, new_y)
            }else{
                canvas.drawImage(this.image, x, y, this.image_size[0], this.image_size[1], new_x, new_y, this.image_size[0], this.image_size[1]);
            }
            
        }   
        
        update(env, factor){
            this.update_position(env, factor);
            this.age += 1;
            this.angle += Math.deg(this.angle_vel);
        }  
            
        check_for_collision(objs1, objs2, objs2_to_remove, game){
            let objs1_to_remove = [];
            let len = objs1.length;
            for(let i = 0; i < len; i++){
                if(Sprite.collision_detect(this, objs1[i])){
                    let explosionType = "";
                    game.state.update_level();
                    if(this.name === "Asteroid"){
                        game.state.increment_score(50);
                        explosionType = "Asteroid explosion";
                        //spawn_asteroid_debris(this.pos, this.vel);
                    }else if(this.name == "Asteroid Debris"){
                        game.state.increment_score(100);
                        explosionType = "Asteroid debris explosion";
                    }
                    let explosion = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource(explosionType));
                    if(explosion.sound){
                        explosion.sound.play();
                    }
                    game.explosions.push(explosion); 
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

    class ExplosiveProjectile extends Sprite{}

    class Ship extends Sprite{
        check_for_collision(objs, to_remove, game){
            let explosion1 = game.spriteFactory.createExplosion(this.pos, this.vel, 0, 0, game.resources.getResource("Ship explosion"));
            let objs_to_remove = [];
            let len = objs.length;
            for(let i = 0; i < len; i++){
                if(Sprite.collision_detect(this, objs[i])){
                    let explosion2 = game.spriteFactory.createExplosion(objs[i].pos, objs[i].vel, 0, 0, game.resources.getResource("Asteroid explosion"));
                    game.explosions.push(explosion2);
                    game.explosions.push(explosion1);
                    game.state.lose_life();
                    to_remove.push(this);
                    if(explosion1.sound){
                        explosion1.sound.play();
                    } 
                    if(objs[i].sound){
                        objs[i].sound.pause();
                    } 
                    objs_to_remove.push(objs[i]);
                }  
            }                
            return objs.diff(objs_to_remove);
            super.check_for_collision();
        }

        thrusters_on(){
            if(this.sound){
                this.sound.play();
            } 
            this.thrust = true;
        }  
            
        thrusters_off(){
            if(this.sound){
                this.sound.pause();
            } 
            this.thrust = false;
        }  
            
        thrusting(){
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
            let pos_x = this.pos[0] + ((this.pos[0] + this.radius - this.pos[0]) * Math.cos(this.angle)) + ((this.pos[1] - this.pos[1]) * Math.sin(this.angle))
            let pos_y = this.pos[1] + ((this.pos[1] - this.pos[1]) * Math.cos(this.angle)) + ((this.pos[0] + this.radius - this.pos[0]) * Math.sin(this.angle))
            let pos = [pos_x, pos_y]
            let forward = [Math.cos(this.angle), Math.sin(this.angle)]
            let vel_x = this.vel[0] + forward[0]*10
            let vel_y = this.vel[1] + forward[1]*10
            game.missiles.push(game.spriteFactory.createExplosiveProjectile(pos, [vel_x, vel_y], 0, this.angle_vel, game.resources.getResource("Basic missile")));
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
        draw(canvas, env){
            canvas.drawImage(this.image, 0, 0, this.image_size[0], this.image_size[1], 0, 0, env.canvas.width, env.canvas.height);
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

    function createStatic(pos, vel, ang, ang_vel, media){
        return new Static(pos, [0, 0], 0, 0, media);
    }

    return {
        createExplosiveProjectile: createExplosiveProjectile,
        createShip: createShip,
        createExplosion: createExplosion,
        createSpaceProjectile, createSpaceProjectile,
        createStatic: createStatic
    };
}
