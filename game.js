function init_game(resources, spriteFactory){
     let str = "Game Loaded";
     let nebula = resources.getResource("Nebula");
     let ship_res = resources.getResource("Basic ship");
     let ship = spriteFactory.createShip([0,0],[0,0],0,0,ship_res.image, ship_res.info, ship_res.sound);
     console.dir(ship);

     let draw = function(canvas){

         // should be calling ship.update(); and ship.draw(); methods here.
         // Also ship.check_for_collisions();

        canvas.drawImage(nebula.image, 0, 0, 800, 600, 0, 0, 800, 600);
        canvas.drawImage(ship.image, 0, 0, 90, 90, 400-45, 300-45, 90, 90);
     }
    
    return {draw: draw};
}