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
            if(media.sound){
                media.sound.play()
            }  
        }

        static update_dimension(pos, vel, axis, size){
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

        getWidth(){
            return this.image_size[0];
        }

        getHeight(){
            return this.image_size[1];
        }
        
        update_position(canvas, pos){
            this.pos[0] = pos ? pos[0] : Sprite.update_dimension(this.pos[0], this.vel[0], canvas.width, this.image_size[0])
            this.pos[1] = pos ? pos[1] : Sprite.update_dimension(this.pos[1], this.vel[1], canvas.height, this.image_size[1])
        }
            
        draw(canvas, env){
            let img_ctr = this.image_center;
            if(this.animated){
                cnt = math.ceil(this.age/10);
                img_ctr = [this.image_center[0] + this.image_size[0] * this.age, this.image_center[1]];   
            }   
            let x = this.image_size[0] / 2 - img_ctr[0];
            let y = this.image_size[1] / 2 - img_ctr[1];
            let new_x = this.pos[0] - this.image_size[0] / 2
            let new_y = this.pos[1] - this.image_size[1] / 2
            canvas.drawImage(this.image, x, y, this.image_size[0], this.image_size[1], new_x, new_y, this.image_size[0], this.image_size[1]);
        }   
        
        update(env){
            this.update_position(env);
            this.age += 1;
            this.angle += Math.rad(this.angle_vel);
        }  
            
        check_for_collision(objs1, objs2, objs2_to_remove){
            objs1_to_remove = [];
            let len = objs1.length;
            for(i = 0; i < len; i++){
                if(collision_detect(objs1[i])){
                    update_level();
                    if(explosion_sound){
                        explosion_sound.play();
                    }
                    if(this.name === "Asteroid"){
                        increment_score(50);
                        info = rock_explosion_info;
                        spawn_asteroid_debris(this.pos, this.vel);
                        explosions.push(Sprite(this.pos, this.vel, 0, 0, rock_explosion_image, info));
                    }else if(this.name == "Asteroid Debris"){
                        increment_score(100);
                        info = rock_debris_explosion_info;
                        explosions.push(Sprite(this.pos, this.vel, 0, 0, rock_debris_explosion_image, info));
                    }   
                    objs1_to_remove.push(objs1[i]);
                    if(objs2.indexOf(this) !== -1){
                        objs2_to_remove.push(this);
                    }
                }
                
            }
            objs1 = objs1.diff(objs1_to_remove);
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
        draw(canvas, env){
            let img_ctr = this.image_center;
            if(this.animated){
                cnt = math.ceil(this.age/10);
                img_ctr = [this.image_center[0] + this.image_size[0] * this.age, this.image_center[1]];   
            }   
            let x = this.image_size[0] / 2 - img_ctr[0];
            let y = this.image_size[1] / 2 - img_ctr[1];
            let new_x = this.pos[0] - this.image_size[0] / 2
            let new_y = this.pos[1] - this.image_size[1] / 2
            canvas.drawImage(this.image, x, y, this.image_size[0], this.image_size[1], new_x, new_y, this.image_size[0], this.image_size[1]);
            return;
            super.draw();
        }

        thrusters_on(){
            if(ship_thrust_sound){
                ship_thrust_sound.play();
            } 
            this.thrust = True;
        }  
            
        thrusters_off(){
            if(ship_thrust_sound){
                ship_thrust_sound.pause();
            }  
            this.thrust = False;
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

        update_friction(){
            this.vel[0] = this.vel[0] * (1 - c)
            this.vel[1] = this.vel[1] * (1 - c)
        }   
            
        shoot(){
            let pos_x = this.pos[0] + ((this.pos[0] + this.radius - this.pos[0]) * math.cos(this.angle)) + ((this.pos[1] - this.pos[1]) * math.sin(this.angle))
            let pos_y = this.pos[1] + ((this.pos[1] - this.pos[1]) * math.cos(this.angle)) + ((this.pos[0] + this.radius - this.pos[0]) * math.sin(this.angle))
            let pos = [pos_x, pos_y]
            let forward = [math.cos(this.angle), math.sin(this.angle)]
            let vel_x = this.vel[0] + forward[0]*10
            let vel_y = this.vel[1] + forward[1]*10
            missiles.push(Sprite(pos, [vel_x, vel_y], this.angle, this.angle_vel, missile_image, missile_info, missile_sound))
        }    
        
        update_thrust(){
            let forward = [math.cos(this.angle), math.sin(this.angle)]
            this.vel[0] += forward[0]/3
            this.vel[1] += forward[1]/3
        }
    }

    class Explosion extends Sprite{}

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
