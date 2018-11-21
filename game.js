function init_game(resources, env, state, factory){

    class Game{
        constructor(resources, env, state, factory){
            this.env = env;
            this.resources = resources;
            this.state = state;
            this.missiles = [];
            this.ships = [];
            this.asteroids = [];
            this.bonusProjectiles = [];
            this.asteroid_debris = [];
            this.animations = [];
            this.spriteFactory = factory;
            this.spawn_interval = 2500;
            this.spawn_timer = null;
            this.leveled_up = false;
            this.bonusCnt = 0;
            this.soundsPlaying = [];
            this.shipHealthLow = false;
            this.soundTrack = resources.getResource("Sound track").sound;
            this.blueNebula = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.BASIC_SPACE));
            this.debris = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.DEBRIS));
            this.splash = this.spriteFactory.createStatic(this.env.getCanvasCenter(), [0,0], 0, 0, resources.getResource(this.resources.CONST.SPLASH));
            this.warn_frame = this.spriteFactory.createStaticAnimated([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.WARN_FRAME));
            this.pausedMessage = this.spriteFactory.createStatic(this.env.getCanvasCenter, [0,0], 0, 0, resources.getResource(this.resources.CONST.PAUSED));
            this.levelUp = this.spriteFactory.createStaticAnimated(this.env.getCanvasCenter(), [0,0], 0, 0, resources.getResource(this.resources.CONST.LEVEL_UP));
            this.health_icon = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.HEART));
            this.plasma_icon = this.spriteFactory.createStatic([0,0], [0,0], 0, 0, resources.getResource(this.resources.CONST.GREEN_ORB));
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

        getanimations(){return this.animations;};

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

        drawShipHealth(canvas){
            canvas.drawImage(this.health_icon.image, 12, 42, 22, 22);
            canvas.beginPath();
            canvas.rect(45, 45, 250, 15);
            canvas.lineWidth = 1;
            canvas.globalAlpha = 1;
            canvas.strokeStyle = '#ff1c17';
            canvas.stroke();
            canvas.closePath();
            if(this.ships.length > 0){
                let len = this.ships[0].health;
                for(let i = 0; i < len ; i++){
                    canvas.beginPath();
                    canvas.rect(45+i, 45, 1, 15);
                    canvas.globalAlpha = 0.5;
                    canvas.fillStyle = '#ff1c17';
                    canvas.fill();
                    canvas.closePath();
                }
            }
            canvas.globalAlpha = 1;
        }

        drawPlasmLevel(canvas){
            canvas.drawImage(this.plasma_icon.image, 0, 0, this.plasma_icon.image_size[0], this.plasma_icon.image_size[1], 7, 62, 30, 30);
            canvas.beginPath();
            canvas.rect(45, 70, 250, 15);
            canvas.lineWidth = 1;
            canvas.globalAlpha = 1;
            canvas.strokeStyle = '#38ff84';
            canvas.stroke();
            canvas.closePath();
            if(this.ships.length > 0){
                let len = this.ships[0].plasma;
                for(let i = 0; i < len ; i++){
                    canvas.beginPath();
                    canvas.rect(45+i, 70, 1, 15);
                    canvas.globalAlpha = 0.5;
                    canvas.fillStyle = '#38ff84';
                    canvas.fill();
                    canvas.closePath();
                }
            }
            canvas.globalAlpha = 1;
        }

        is_game_on(){
            return this.state.game_on;
        };

        addShip(type, pos, vel, ang, ang_vel){
            this.ships.push(this.spriteFactory.createShip(pos, vel, ang, ang_vel, this.resources.getResource(type)));
        };

        addSpaceProjectile(type, pos, vel, ang, ang_vel){
            let CONST = this.resources.CONST;
            let sprite;
            switch(type){
                case CONST.ASTEROID_DEBRIS:
                    this.addMultiple(type, pos, vel);
                    break;
                case CONST.ASTEROID:
                    sprite = this.spriteFactory.createSpaceProjectile(pos, vel, ang, ang_vel, this.resources.getResource(type));
                    this.asteroids.push(sprite);
                    break;
                case CONST.HEART:
                    sprite = this.spriteFactory.createBonusProjectile(pos, vel, ang, ang_vel, this.resources.getResource(type));
                    this.bonusProjectiles.push(sprite);
                    break;
                case CONST.GREEN_ORB:
                    sprite = this.spriteFactory.createBonusProjectile(pos, vel, ang, ang_vel, this.resources.getResource(type));
                    this.bonusProjectiles.push(sprite);
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
                case CONST.FORCE_MISSILE:
                    if(sprite.sound){
                        let sound = sprite.sound[0].cloneNode();
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
                sprite.sound[0].play();
            }
            this.animations.push(sprite);
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

        level_up(){
            this.pause("levelUp");
            this.levelUp.sound[0].play();
            this.leveled_up = true;
            this.levelUp.isShowing = true;
        }


        resetLevelUp(){
            this.clearProjectiles();
            this.pause();
            this.leveled_up = false;
            this.levelUp.isShowing = false;
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

            let bonus_projectiles_to_remove = [];
            let len9 = this.bonusProjectiles.length;
            for(let i = 0; i < len9; i++){
                if(!this.paused){
                    this.bonusProjectiles[i].update(env, factor, CONST);
                }
                this.bonusProjectiles[i].check_expiry() 
                if(this.bonusProjectiles[i].toBeRemoved){
                    console.log("REMOVING HEART")
                    if(this.bonusProjectiles.indexOf(this.bonusProjectiles[i] !== -1)){
                        bonus_projectiles_to_remove.push(this.bonusProjectiles[i]);
                    }
                }else{
                    this.bonusProjectiles[i].draw(canvas, env, factor);
                }
            }
            this.bonusProjectiles = this.bonusProjectiles.diff(bonus_projectiles_to_remove);

            // draw and update ships and sprites
            let missiles_to_remove = [];
            let len = this.missiles.length;
            for(let i = 0; i < len; i++){
                if(!this.paused){
                    this.missiles[i].update(env, factor, CONST);
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
            let len2 = this.ships.length;
            for(let i = 0; i < len2; i++){
                if(!this.paused){
                    this.ships[i].update(env, factor, CONST);
                }
                this.bonusProjectiles = this.ships[i].check_for_collision(this.bonusProjectiles, ships_to_remove, this);
                this.asteroids = this.ships[i].check_for_collision(this.asteroids, ships_to_remove, this);
                this.asteroid_debris = this.ships[i].check_for_collision(this.asteroid_debris, ships_to_remove, this);
                this.ships[i].draw(canvas, env, factor);
            }    
            this.ships = this.ships.diff(ships_to_remove);
            

            let asteroids_to_remove = [];
            let len3 = this.asteroids.length;
            for(let i = 0; i < len3; i++){
                if(!this.paused){
                    this.asteroids[i].update(env, factor, CONST);
                }
                this.asteroids[i].draw(canvas, env, factor);
                this.missiles = this.asteroids[i].check_for_collision(this.missiles, this.asteroids, asteroids_to_remove, this);
            } 
            this.asteroids = this.asteroids.diff(asteroids_to_remove);
            


            let asteroid_debris_to_remove = [];
            let len4 = this.asteroid_debris.length;
            for(let i = 0; i < len4; i++){
                if(!this.paused){
                    this.asteroid_debris[i].update(env, factor, CONST);
                }
                this.asteroid_debris[i].draw(canvas, env, factor);
                this.missiles = this.asteroid_debris[i].check_for_collision(this.missiles, this.asteroid_debris, asteroid_debris_to_remove, this);
            }            
            this.asteroid_debris = this.asteroid_debris.diff(asteroid_debris_to_remove);
            


            let animations_to_remove = [];
            let len5 = this.animations.length;
            for(let i = 0; i < len5; i++){
                if(!this.paused){
                    this.animations[i].update(env, factor, CONST);
                }
                this.animations[i].draw(canvas, env, factor);
                if(this.animations[i].check_expiry()){
                    if(this.animations[i].getName() == CONST.SHIP_EXPLOSION){
                        if(this.state.getLives() === 0){
                            this.end();
                        }else{
                            this.reset_view();
                        }
                    }
                    animations_to_remove.push(this.animations[i]);
                }     
            }
            this.animations = this.animations.diff(animations_to_remove);   

            this.state.drawStateDetails(canvas);

            if(!this.is_game_on()){
                this.splash.draw(canvas, env, true);
                this.splash.isShowing = true;
            }else if(this.paused){
                if(this.leveled_up){
                    if(this.levelUp.getAge() < 49){
                        this.levelUp.update(env, 0, CONST);
                    }  
                    this.levelUp.draw(canvas, env, true);
                }else{
                    this.pausedMessage.draw(canvas, env, true);
                }
            }else{
                this.levelUp.age = 0;
            }

            if(this.is_game_on()){
                this.drawPlasmLevel(canvas);
                this.drawShipHealth(canvas);
            }

            if(this.warn_frame.getAge() === this.warn_frame.lifespan){
                this.warn_frame.age = 0;
            }

            if(this.shipHealthLow){
                this.warn_frame.update(env, 0, CONST);
                this.warn_frame.draw(canvas, env, true);
            }
        }
            

        // timer handler that spawns a rock    
        spawner(self){
            self.bonusCnt += 1;
            let CONST = self.env.getResources().CONST;
            let level = self.getState().getLevel();
            if(self.asteroids.length < Math.ceil(level / 4) + 3){
                let org1 = Math.randInt(0, 3)
                let width = self.getEnvironment().getCanvasWidth();
                let rnd_pos_org = Math.randInt(width-30, width-20);
                let rnd_neg_org = 20;
                let rnd_y_org = Math.randInt(100, self.getEnvironment().getCanvasHeight() - 100);
                let rnd_pos_vel = (Math.randInt(1, Math.ceil(level / 2.75) + 2));
                let rnd_neg_vel = -(Math.randInt(1, Math.ceil(level / 2.75) + 2))
                let origin = [];
                let velocity = [];
                let pos_neg = 1;
                if(org1 < 2){
                    pos_neg = -1;
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
                if(self.bonusCnt % 7 === 0){
                    self.addSpaceProjectile(CONST.HEART, [-20, rnd_y_org], [pos_neg*(Math.ceil(level / 4)+2), 0], 0, 0, 5);
                }
                if(self.bonusCnt % 5 === 0){
                    self.addSpaceProjectile(CONST.GREEN_ORB, [-20, rnd_y_org], [(Math.ceil(level / 4)+3), 0], 0, 0, 5);
                }
                self.addSpaceProjectile(CONST.ASTEROID, origin, velocity, 0, spin, 5);
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
            this.splash.isShowing = false;
            this.soundTrack.volume = 0.2;
            this.soundTrack.loop = true;
            this.soundsPlaying.push(this.soundTrack[0])
            this.soundTrack[0].play();
            this.reset_view();
            this.state.setScore(0);
            this.state.setLevel(1);
            this.state.setLives(0);
            this.bonusCnt = 0;
            this.startSpawning();
        }

        gameContext(){
            return this;
        }

        pause(){
            this.paused = !this.paused;
            let len = this.soundsPlaying.length;
            if(this.paused){
                for(let i = 0; i < len; i++){
                    this.soundsPlaying[i].pause();
                }
            }else{
                for(let i = 0; i < len; i++){
                    this.soundsPlaying[i].play();
                }
            }
        } 

        end(){
            this.gameOff();
            this.soundTrack[0].pause();
            this.soundTrack[0].loop = false;
            this.soundTrack[0].currentTime = 0;
            this.soundsPlaying = [];
        }

        clearProjectiles(){
            this.missiles = [];
            this.asteroids = [];
            this.asteroid_debris = [];
            this.bonusProjectiles = [];
        }

        reset_view(){
            let CONST = env.getResources().CONST;
            if(this.is_game_on()){
                this.clearProjectiles();
                this.bonusCnt = 0;
                this.addShip(CONST.BLUE_SHIP, env.getCanvasCenter(), [0, 0], 0, 0);
            }
        }
    }
    return new Game(resources, env, state, factory);
}