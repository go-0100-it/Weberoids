function init_game(resources, env, state, factory){

    class Game{
        constructor(resources, env, state, factory){
            this.missiles = [];
            this.ships = [];
            this.asteroids = [];
            this.asteroid_debris = [];
            this.explosions = [];
            this.time = 0;
            this.state = state;
            this.spriteFactory = factory;
            this.resources = resources;
            this.env = env;
            this.spawn_interval = 2500;
            this.spawn_timer = null
            this.paused = false;
            this.soundTrack = resources.getResource("Sound track").sound;
            this.blueNebula = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.BASIC_SPACE));
            this.debris = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.DEBRIS));
            //this.backgroundDebris = this.spriteFactory.createBackgroundProjectile([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.DEBRIS));
            this.splash = this.spriteFactory.createStatic(this.env.getCanvasCenter, [0,0], 0, 0, resources.getResource(this.resources.CONST.SPLASH));
            this.pausedMessage = this.spriteFactory.createStatic(this.env.getCanvasCenter, [0,0], 0, 0, resources.getResource(this.resources.CONST.PAUSED));
        }

        startSpawning(){
            this.spawn_timer = setInterval(this.spawner, (this.spawn_interval / this.state.level), this);
        };

        stopSpawning(){
            clearInterval(this.spawn_timer);
            this.spawn_timer = null;
        };

        getAllMissiles(){return this.missiles;};

        getShips(){return this.ships;};

        getAsteroids(){return this.asteroids;};

        getAsteroidDebris(){return this.asteroid_debris;};

        getExplosions(){return this.explosions;};

        getSpriteFactory(){return this.spriteFactory;};

        getState(){return this.state;};

        getEnvironment(){return this.env;};

        getResources(){return this.resources;};

        gameOn(){
            this.state.game_on = true;
        };

        gameOff(){
            this.state.game_on = false;
        };

        is_game_on(){
            return this.state.game_on;
        };

        addShip(type, pos, vel, ang, ang_vel){
            this.ships.push(this.spriteFactory.createShip(pos, vel, ang, ang_vel, this.resources.getResource(type)));
        };

        addSpaceProjectile(type, pos, vel, ang, ang_vel){
            let CONST = this.resources.CONST;
            switch(type){
                case CONST.ASTEROID_DEBRIS:
                    this.addMultiple(type, pos, vel);
                    break;
                case CONST.ASTEROID:
                    this.asteroids.push(this.spriteFactory.createSpaceProjectile(pos, vel, ang, ang_vel, this.resources.getResource(type)));
                    break;
                default:
                    break;
            }
        };

        addStaticSprite(type, pos, vel, ang, ang_vel){
            return this.spriteFactory.createStatic(pos, vel, ang, ang_vel, resources.getResource(type));
        }

        addExplosiveProjectile(type, pos, vel, ang, ang_vel){
            let CONST = this.resources.CONST;
            let sprite = this.spriteFactory.createExplosiveProjectile(pos, vel, ang, ang_vel, this.resources.getResource(type));
            switch(type){
                case CONST.BASIC_MISSILE:
                    if(sprite.sound){
                        let sound = sprite.sound.cloneNode();
                        sound.play();
                    }
                    this.missiles.push(sprite);
                    break;
                default:
                    break;
            }
            return sprite;
        }

        addExplosion(type, pos, vel, ang, ang_vel){
            let CONST = this.resources.CONST;
            let sprite = this.spriteFactory.createExplosion(pos, vel, ang, ang_vel, this.resources.getResource(type));
            if(sprite.sound){
                sprite.sound.play();
            }
            this.explosions.push(sprite);
            return sprite;
        }

        addMultiple(type, pos, vel){
            let CONST = this.resources.CONST;
            let vel_1 = this.env.utils.relativeVelocity(this.state.getLevel(), vel);
            let vel_2 = this.env.utils.relativeVelocity(this.state.getLevel(), vel);
            if(vel_1[0] === vel_2[0] && vel_1[1] === vel_2[1]){
                vel_1[0] += 1;
            }
            let media = this.resources.getResource(type)
            this.asteroid_debris.push(this.spriteFactory.createSpaceProjectile(pos, vel_1, 0, 0, media));
            this.asteroid_debris.push(this.spriteFactory.createSpaceProjectile(pos, vel_2, 0, 0, media));
        }

        clearExpiredSoundClones(){
            let len = this.soundClones.length;
            for(let i = 0; i < len; i++){
                if(this.soundClones[i]){}
            }
        }
        

        draw(env, factor){
            let canvas = env.getContext();
            let CONST = env.getResources().CONST;
            this.blueNebula.draw(canvas, env);
            if(!this.paused){
                this.state.increment_time();
            }
            let t = (this.state.time / 4) % env.getCanvasWidth();
            this.debris.draw(canvas, env, false, t);
            this.debris.draw(canvas, env, false, t);
            //this.backgroundDebris.draw(canvas, env, this.state);
            /*=====================================================================================================
            TODO:
                Add this, as a new function, to a new static sprite class "Background

            =======================================================================================================*/



            // draw and update ships and sprites
            let missiles_to_remove = [];
            let len = this.missiles.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.missiles[i].update(env, factor);
                }
                this.missiles[i].draw(canvas, env, factor);
                if(this.missiles[i].check_expiry()){
                    if(this.missiles.indexOf(this.missiles[i] !== -1)){
                        missiles_to_remove.push(this.missiles[i]);
                    }
                }           
            }
            this.missiles = this.missiles.diff(missiles_to_remove);
            

            let ships_to_remove = [];
            len = this.ships.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.ships[i].update(env, factor);
                }
                this.asteroids = this.ships[i].check_for_collision(this.asteroids, ships_to_remove, this);
                this.asteroid_debris = this.ships[i].check_for_collision(this.asteroid_debris, ships_to_remove, this);
                this.ships[i].draw(canvas, env, factor);
            }    
            this.ships = this.ships.diff(ships_to_remove);
            


            let asteroids_to_remove = [];
            len = this.asteroids.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.asteroids[i].update(env, factor);
                }
                this.asteroids[i].draw(canvas, env, factor);
                this.missiles = this.asteroids[i].check_for_collision(this.missiles, this.asteroids, asteroids_to_remove, this);
            } 
            this.asteroids = this.asteroids.diff(asteroids_to_remove);
            


            let asteroid_debris_to_remove = [];
            len = this.asteroid_debris.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.asteroid_debris[i].update(env, factor);
                }
                this.asteroid_debris[i].draw(canvas, env, factor);
                this.missiles = this.asteroid_debris[i].check_for_collision(this.missiles, this.asteroid_debris, asteroid_debris_to_remove, this);
            }            
            this.asteroid_debris = this.asteroid_debris.diff(asteroid_debris_to_remove);
            


            let explosions_to_remove = [];
            len = this.explosions.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.explosions[i].update(env, factor);
                }
                this.explosions[i].draw(canvas, env, factor);
                if(this.explosions[i].check_expiry()){
                    if(this.explosions[i].getName() == CONST.SHIP_EXPLOSION){
                        if(this.state.getLives() === 0){
                            this.end();
                        }else{
                            this.reset_view();
                        }
                    }
                    explosions_to_remove.push(this.explosions[i]);
                }     
            }
            this.explosions = this.explosions.diff(explosions_to_remove);   

            this.state.drawStateDetails(canvas);

            if(!this.is_game_on()){
                this.splash.draw(canvas, env, true);
            }else if(this.paused){
                this.pausedMessage.draw(canvas, env, true);
            }
        }
            

        // timer handler that spawns a rock    
        spawner(self){
            let CONST = self.env.getResources().CONST;
            if(self.asteroids.length < Math.round(self.state.level / 2 + 1)){
                let org1 = Math.randInt(0, 3)
                let width = self.getEnvironment().getCanvasWidth();
                let level = self.getState().getLevel();
                let rnd_pos_org = Math.randInt(width-30, width-20);
                let rnd_neg_org = 20;
                let rnd_pos_vel = Math.randInt(1, level + 1)
                let rnd_neg_vel = -(Math.randInt(1, level + 1))
                let origin = [];
                let velocity = [];
                if(org1 < 2){
                    origin = [rnd_pos_org, 0];
                    velocity = [rnd_neg_vel, 0];
                    if(org1 === 0){
                        origin[1] = rnd_pos_org;
                        velocity[1] = rnd_neg_vel;
                    }
                    else{
                        origin[1] = rnd_neg_org;
                        velocity[1] = rnd_pos_vel;
                    }  
                } 
                else{
                    origin = [rnd_neg_org, 0];
                    velocity = [rnd_pos_vel, 0];
                    if(org1 === 2){
                        origin[1] = rnd_pos_org;
                        velocity[1] = rnd_neg_vel;
                    }
                    else{
                        origin[1] = rnd_neg_org;
                        velocity[1] = rnd_pos_vel;
                    }  
                }
                let spin = (org1 + 1) / 5000;
                self.addSpaceProjectile(CONST.ASTEROID, origin, velocity, 0, spin);
            }
        }
            
            // splash screen
            /*
                canvas.draw_text('Lives', (20, 20), 24, 'Red')
                canvas.draw_text(str(lives), (20, 40), 20, 'Red')
                canvas.draw_text('Score', (100, 20), 24, 'Red')
                canvas.draw_text(str(score), (100, 40), 20, 'Red')
            if(!game_on){
                canvas.draw_image(splash_image, splash_info.get_center(), splash_info.get_size(), [width / 2, height / 2], splash_info.get_size());
            }*/
        

        start(){
            this.gameOn();
            this.soundTrack.volume = 0.5;
            this.soundTrack.loop = true;
            this.soundTrack.play();
            this.reset_view();
            this.state.setScore(0);
            this.state.setLevel(1);
            this.state.setLives(3);
            this.startSpawning();
        }

        gameContext(){
            return this;
        }

        pause(){
            this.paused = !this.paused;
        } 

        end(){
            this.gameOff();
            this.soundTrack.pause();
            this.soundTrack.loop = false;
            this.soundTrack.currentTime = 0;
        }

        reset_view(){
            let CONST = env.getResources().CONST;
            if(this.is_game_on()){
                this.missiles = [];
                this.asteroids = [];
                this.asteroid_debris = [];
                this.addShip(CONST.BASIC_SHIP, env.getCanvasCenter(), [0, 0], 0, 0);
                //this.explosions = [];
                //
            }
        }
    }
    return new Game(resources, env, state, factory);
}