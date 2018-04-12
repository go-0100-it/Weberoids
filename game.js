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
            this.blueNebula = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.BASIC_SPACE));
            this.splash = this.spriteFactory.createStatic(this.env.getCanvasCenter, [0,0], 0, 0, resources.getResource(this.resources.CONST.SPLASH));
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
            this.game_on = true;
        };

        gameOff(){
            this.game_on = false;
        };

        is_game_on(){
            return this.game_on;
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
        

        draw(env, factor, state){
            let canvas = env.getContext();
            let CONST = env.getResources().CONST;
            // should be calling ship.update(); and ship.draw(); methods here.
            // Also ship.check_for_collisions();
            this.blueNebula.draw(canvas, env);
            if(!this.is_game_on()){
                this.splash.draw(canvas, env, true);
            }
           
            //ship.draw(canvas, env, factor);
            //asteroid.draw(canvas, env, factor);
        /// asteroid.update(env, factor);

            // animiate background
            
            /*=====================================================================================================
            TODO:
                Add this, as a new function, to a new static sprite class "Background"

                time += 1
                this.width = env.canvas.width;
                this.height = env.canvas.height;
                this.wtime = (time / 4) % width;
                this.center = debris_info.get_center();
                this.size = debris_info.get_size();
                canvas.draw_image(debris_image, center, size, (wtime - width / 2, width / 2), (width, height));
                canvas.draw_image(debris_image, center, size, (wtime + width / 2, width / 2), (width, height));

            =======================================================================================================*/



            // draw and update ships and sprites
            let missiles_to_remove = [];
            let len = this.missiles.length;
            for(let i = 0; i < len; i++){
                this.missiles[i].update(env, factor);
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
                this.ships[i].update(env, factor);
                this.asteroids = this.ships[i].check_for_collision(this.asteroids, ships_to_remove, this);
                this.asteroid_debris = this.ships[i].check_for_collision(this.asteroid_debris, ships_to_remove, this);
                this.ships[i].draw(canvas, env, factor);
            }    
            this.ships = this.ships.diff(ships_to_remove);
            


            let asteroids_to_remove = [];
            len = this.asteroids.length;
            for(let i = 0; i < len; i++){
                this.asteroids[i].update(env, factor);
                this.asteroids[i].draw(canvas, env, factor);
                this.missiles = this.asteroids[i].check_for_collision(this.missiles, this.asteroids, asteroids_to_remove, this);
            } 
            this.asteroids = this.asteroids.diff(asteroids_to_remove);
            


            let asteroid_debris_to_remove = [];
            len = this.asteroid_debris.length;
            for(let i = 0; i < len; i++){
                this.asteroid_debris[i].update(env, factor);
                this.asteroid_debris[i].draw(canvas, env, factor);
                this.missiles = this.asteroid_debris[i].check_for_collision(this.missiles, this.asteroid_debris, asteroid_debris_to_remove, this);
            }            
            this.asteroid_debris = this.asteroid_debris.diff(asteroid_debris_to_remove);
            


            let explosions_to_remove = [];
            len = this.explosions.length;
            for(let i = 0; i < len; i++){
                this.explosions[i].update(env, factor);
                this.explosions[i].draw(canvas, env, factor);
                if(this.explosions[i].check_expiry()){
                    if(this.explosions[i].getName() == CONST.SHIP_EXPLOSION){
                        //reset_view();
                    }
                    explosions_to_remove.push(this.explosions[i]);
                }     
            }
            this.explosions = this.explosions.diff(explosions_to_remove);
        }

        // timer handler that spawns a rock    
        spawner(self){
            let CONST = self.env.getResources().CONST;
            if(self.asteroids.length < self.state.level + 1){
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
        } 

        end(){
            this.gameOff();
            soundtrack.pause();
            soundtrack.rewind();
        }

        reset_view(){
            let CONST = env.getResources().CONST;
            if(this.is_game_on()){
                this.missiles = [];
                this.asteroids = [];
                this.asteroid_debris = [];
                this.explosions = [];
                this.addShip(CONST.BASIC_SHIP, env.getCanvasCenter(), [0, 0], 0, 0);
            }
        }
    }
    return new Game(resources, env, state, factory);
}