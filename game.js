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
            this.spriteFactory = factory
            this.resources = resources;

            this.blueNebula = this.spriteFactory.createStatic([0, 0], [0, 0], 0, 0, resources.getResource("Blue Nebula"));
            this.ships.push(this.spriteFactory.createShip([env.canvas.width / 2 , 0], [0, 0], 0, 0, resources.getResource("Basic ship")));
            this.ships[0].update_position(env.canvas, 0, [env.canvas.width / 2, env.canvas.height / 2]);
            this.asteroids.push(this.spriteFactory.createSpaceProjectile([0, 0], [4, 4], 0, 0, resources.getResource("Asteroid")));
        
        }

        draw(env, factor, state){
            let canvas = env.context
            // should be calling ship.update(); and ship.draw(); methods here.
            // Also ship.check_for_collisions();
            this.blueNebula.draw(canvas, env, factor);
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
            this.missiles_to_remove = [];
            let len = this.missiles.lenght;
            for(let i = 0; i < len; i++){
                this.missiles[i].update(env, factor);
                this.missiles[i].draw(canvas, env, factor);
                if(this.missiles[i].check_expiry()){
                    if(this.missiles.indexOf(this.missiless[i] !== -1)){
                        this.missiles_to_remove.push(this.missile[i]);
                    }
                }           
            }
            this.missiles = this.missiles.diff(this.missiles_to_remove);
            

            this.ships_to_remove = [];
            len = this.ships.length;
            for(let i = 0; i < len; i++){
                this.ships[i].update(env, factor);
                this.asteroids = this.ships[i].check_for_collision(this.asteroids, this.ships_to_remove, this);
                this.asteroid_debris = this.ships[i].check_for_collision(this.asteroid_debris, this.ships_to_remove, this);
                this.ships[i].draw(canvas, env, factor);
            }    
            this.ships = this.ships.diff(this.ships_to_remove);
            


            this.asteroids_to_remove = [];
            len = this.asteroids.length;
            for(let i = 0; i < len; i++){
                this.asteroids[i].update(env, factor);
                this.asteroids[i].draw(canvas, env, factor);
                this.asteroids[i].check_for_collision(this.missiles, this.asteroids, this.asteroids_to_remove, this);
            } 
            this.asteroids = this.asteroids.diff(this.asteroids_to_remove);
            


            this.asteroid_debris_to_remove = [];
            len = this.asteroid_debris.length;
            for(let i = 0; i < len; i++){
                this.asteroid_debris[i].update(env, factor);
                this.asteroid_debris[i].draw(canvas, env, factor);
                this.asteroid_debris[i].check_for_collision(this.missiles, this.asteroid_debris, this.asteroid_debris_to_remove, this);
            }            
            this.asteroid_debris = this.asteroid_debris.diff(this.asteroid_debris_to_remove);
            


            this.explosions_to_remove = [];
            len = this.explosions.length;
            for(let i = 0; i < len; i++){
                this.explosions[i].update(env, factor);
                this.explosions[i].draw(canvas, env, factor);
                if(this.explosions[i].check_expiry()){
                    console.log(this.explosions[i].image);
                    if(this.explosions[i].name == "Ship explosion"){
                        //reset_view();
                    }
                    this.explosions_to_remove.push(this.explosions[i]);
                }     
            }
            this.explosions = this.explosions.diff(this.explosions_to_remove);
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
            this.game_on = True;
            this.reset_view();
            this.score = 0;
            this.level = 1;
            this.lives = this.game.lives;
            this.game.spawn_timer.start();
        }

        gameContext(){
            return this;
        }

        pause(){
        }

        end(){
            this.game_on = False;
            soundtrack.pause();
            soundtrack.rewind();
        }

        reset_view(){
            let ship = this.sprite("Basic ship");
            if(this.game_on){
                this.missiles = [];
                this.asteroids = [];
                this.asteroid_debris = [];
                this.explosions = [];
                this.add_sprite(Ship(env.center(), [0, 0], 0, ship.image, ship.info, this, ship.sound));
            }
        }
    }
    return new Game(resources, env, state, factory);
}