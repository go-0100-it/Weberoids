function init_input_handler(game, environment){

    function inbounds(coord, center, size){
        return (coord > center - size / 2) && (coord < center + size / 2)
    }

    environment.canvas.addEventListener('click', function(e){
        if(!game.is_game_on()){
            let splash = game.splash;
            let pos = [];
            pos[0] = e.layerX ? e.layerX : e.offsetX;
            pos[1] = e.layerY ? e.layerY : e.offsetY;
            let size = splash.getImageSize();
            let center = environment.getCanvasCenter();
            let in_x = inbounds(pos[0], center[0], size[0]);
            let in_y = inbounds(pos[1], center[1], size[1]);
            if(in_x && in_y){
                game.start();
            }  
        }
    });


    document.addEventListener('keypress', function(e){
        let len = game.ships.length;
        switch(e.key){
            case ' ':
                for(let i = 0; i < len > 0; i++){
                    game.ships[i].shoot(game);
                }
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', function(e){
        let len = game.ships.length;
        switch(e.key){
            case 'ArrowUp':
                for(let i = 0; i < len > 0; i++){
                    game.ships[i].thrustersOff();
                }
                break;
            case 'ArrowDown':
                console.log("ArrowDown Release");
                break;
            case 'ArrowRight':
            case 'ArrowLeft':
                for(let i = 0; i < len > 0; i++){
                    game.ships[i].rotate(null);
                }
                break;
            default:
                break;
        }
    });

    document.addEventListener('keydown', function(e){
        let len = game.ships.length;
        switch(e.key){
            case 'ArrowUp':
                for(let i = 0; i < len > 0; i++){
                    game.ships[0].thrustersOn();
                }
                break;
            case 'ArrowDown':
                console.log("ArrowDown Depress");
                break;
            case 'ArrowRight':
                for(let i = 0; i < len > 0; i++){
                    game.ships[i].rotate("CLOCKWISE");
                }
                break;
            case 'ArrowLeft':
                for(let i = 0; i < len > 0; i++){
                    game.ships[0].rotate("COUNTERCLOCKWISE");
                }
                break;
            default:
                break;
        }
    });
}