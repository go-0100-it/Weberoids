function init_game(resources, env, state){

    let missiles = [];
    let ships = [];
    let asteroids = [];
    let asteroid_debris = [];
    let explosions = [];

    let time = 0;
    let blueNebula = resources.spriteFactory.createStatic([0, 0], [0, 0], 0, 0, resources.getResource("Blue Nebula"));
    let ship = resources.spriteFactory.createShip([env.canvas.width / 2 , 0], [0, 0], 0, 0, resources.getResource("Basic ship"));
    ship.update_position(env.canvas, [env.canvas.width / 2, env.canvas.height / 2]);
    let asteroid = resources.spriteFactory.createSpaceProjectile([0, 0], [1, 1], 0, 0, resources.getResource("Asteroid"));

    function draw(environment){
        let canvas = environment.context
        let time_factor = environment.progress/(1000/60)
        // should be calling ship.update(); and ship.draw(); methods here.
        // Also ship.check_for_collisions();
        blueNebula.draw(canvas, env);
        ship.draw(canvas, env);
        asteroid.draw(canvas, env);
        asteroid.update(env);

        // animiate background

        
        /*=====================================================================================================
         TODO:
            Add this, as a new function, to a new static sprite class "Background"

            time += 1
            let width = env.canvas.width;
            let height = env.canvas.height;
            let wtime = (time / 4) % width;
            let center = debris_info.get_center();
            let size = debris_info.get_size();
            canvas.draw_image(debris_image, center, size, (wtime - width / 2, width / 2), (width, height));
            canvas.draw_image(debris_image, center, size, (wtime + width / 2, width / 2), (width, height));

        =======================================================================================================*/



        // draw and update ships and sprites
        let missiles_to_remove = [];
        let len = missiles.lenght;
        for(i = 0; i < len; i++){
            missiles[i].update(env);
            missiles[i].draw(canvas);
            if(missiles[i].check_expiry()){
                if(missiles.indexOf(missiless[i] !== -1)){
                    missiles_to_remove.push(missile[i]);
                }
            }           
        }
        missiles = missiles.diff(missiles_to_remove);
        


        let ships_to_remove = [];
        len = ships.length;
        for(i = 0; i < len; i++){
            ship[i].update(env);
            ship[i].check_for_collision(asteroids, ships_to_remove);
            ship[i].check_for_collision(asteroid_debris, ships_to_remove);
            ship[i].draw(canvas, env);
        }    
        ships = ships.diff(ships_to_remove);
        


        asteroids_to_remove = [];
        len = asteroids.length;
        for(i = 0; i < len; i++){
            asteroid[i].update(env);
            asteroid[i].draw(canvas, env);
            asteroid[i].check_for_collision(missiles, asteroids, asteroids_to_remove);
        } 
        asteroids = asteroids.diff(asteroids_to_remove);
        


        asteroid_debris_to_remove = [];
        len = asteroid_debris.length;
        for(i = 0; i < len; i++){
            asteroid_debris[i].update(env);
            asteroid_debris[i].draw(canvas, env);
            asteroid_debris[i].check_for_collision(missiles, asteroid_debris, asteroid_debris_to_remove);
        }            
        asteroid_debris = asteroid_debris.diff(asteroid_debris_to_remove);
        


        explosions_to_remove = [];
        len = explosions.length;
        for(i = 0; i < len; i++){
            explosions[i].update(env);
            explosions[i].draw(canvas, env);
            if(explosions[i].check_expiry()){
                if(explosions[i].name == "Ship explosion"){
                    reset_view();
                }
                explosions_to_remove.push(explosions[i]);
            }     
        }
        explosions = explosions.diff(explosions_to_remove);
        
        // splash screen
        /*
            canvas.draw_text('Lives', (20, 20), 24, 'Red')
            canvas.draw_text(str(lives), (20, 40), 20, 'Red')
            canvas.draw_text('Score', (100, 20), 24, 'Red')
            canvas.draw_text(str(score), (100, 40), 20, 'Red')
        if(!game_on){
            canvas.draw_image(splash_image, splash_info.get_center(), splash_info.get_size(), [width / 2, height / 2], splash_info.get_size());
        }*/
    }

    function start(){
        this.game_on = True;
        this.reset_view();
        this.score = 0;
        this.level = 1;
        this.lives = this.game.lives;
        this.game.spawn_timer.start();
    }

    function pause(){
    }

    function end(){
        this.game_on = False;
        soundtrack.pause();
        soundtrack.rewind();
    }

    function reset_view(){
        env = this.game.env;
        ship = this.game.sprite("Basic ship");
        if(this.game_on){
            this.game.missiles = set([]);
            this.game.asteroids = set([]);
            this.game.asteroid_debris = set([]);
            this.game.explosions = set([]);
            this.game.add_sprite(Ship(env.center(), [0, 0], 0, ship.image, ship.info, this.game, ship.sound));
        }
    }
    
    return {
        draw: draw,
        ship: ship
    };
}