function createSpriteFactory(){
    class Sprite{
        constructor(pos, vel, ang, ang_vel, image, info, sound = None){
            this.pos = [pos[0],pos[1]];
            this.vel = [vel[0],vel[1]];
            this.angle = ang;
            this.angle_vel = ang_vel;
            this.image = image;
            this.name = info.get_name();
            this.image_center = info.get_center();
            this.image_size = info.get_size();
            this.radius = info.get_radius();
            this.lifespan = info.get_lifespan();
            this.animated = info.get_animated();
            this.age = 0;
            if(sound){
                sound.play()
            }  
        }
        
        update_position(){
            this.pos[0] = update_dimension(this.pos[0], this.vel[0], CANVAS_WIDTH)
            this.pos[1] = update_dimension(this.pos[1], this.vel[1], CANVAS_HEIGHT)
        }
            
        draw(canvas){
            img_ctr = this.image_center;
            if(this.animated){
                cnt = math.ceil(this.age/10);
                img_ctr = [this.image_center[0] + this.image_size[0] * this.age, this.image_center[1]];   
            }   
            canvas.drawImage(this.image, img_ctr, this.image_size, this.pos, this.image_size, this.angle);
        }
            
        
        update(){
            this.update_position();
            this.age += 1;
            this.angle += math.radians(this.angle_vel);
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
            objs1.difference_update(objs1_to_remove);
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

    }

    class Explosion extends Sprite{

    }

    class SpaceProjectile extends Sprite{

    }

    function createExplosiveProjectile(pos, vel, ang, ang_vel, image, info, sound = None){
        return new ExplosiveProjectile(pos, vel, ang, ang_vel, image, info, sound);
    }

    function createShip(pos, vel, ang, ang_vel, image, info, sound = None){
        return new Ship(pos, vel, ang, ang_vel, image, info, sound);
    }

    function createExplosion(pos, vel, ang, ang_vel, image, info, sound = None){
        return new Explosion(pos, vel, ang, ang_vel, image, info, sound);
    }

    function createSpaceProjectile(pos, vel, ang, ang_vel, image, info, sound = None){
        return new SpaceProjectile(pos, vel, ang, ang_vel, image, info, sound);
    }

    return {
        createExplosiveProjectile: createExplosiveProjectile,
        createShip: createShip,
        createExplosion: createExplosion,
        createSpaceProjectile, createSpaceProjectile
    };
}
