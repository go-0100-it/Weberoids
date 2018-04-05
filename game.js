function init_game(resources){
     let str = "Game Loaded";
     let nebula = resources.getResource("Nebula");
     let ship = resources.getResource("Basic ship");

     let draw = function(canvas){
        canvas.drawImage(nebula.image, 0, 0, 800, 600, 0, 0, 800, 600);
        canvas.drawImage(ship.image, 0, 0, 90, 90, 400-45, 300-45, 90, 90);
     }
     let game = {draw: draw};
    
    return game;
}