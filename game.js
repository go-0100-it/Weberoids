function init_game(resources){
    let blueNebula = resources.spriteFactory.createStatic([0, 0], [0, 0], 0, 0, resources.getResource("Blue Nebula"));
    let ship = resources.spriteFactory.createShip([0, 0], [0, 0], 0, 0, resources.getResource("Basic ship"));
    let asteroid = resources.spriteFactory.createSpaceProjectile([0, 0], [1, 1], 0, 0, resources.getResource("Asteroid"));

    let draw = function(canvas){

        // should be calling ship.update(); and ship.draw(); methods here.
        // Also ship.check_for_collisions();

        blueNebula.draw(canvas, this.env);
        ship.draw(canvas, this.env)
        asteroid.draw(canvas, this.env);
        asteroid.update(this.env);
    }
    
    return {draw: draw};
}