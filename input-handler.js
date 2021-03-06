function init_input_handler(game, environment){

    let fired = false;
    let paused = false;

    function inbounds(coord, center, size){
        return (coord > center - size / 2) && (coord < center + size / 2)
    }

    environment.canvas.addEventListener('click', function(e){

        if(game.splash.isShowing){
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
        }else if(game.levelUp.isShowing){
            let leveled_up_splash = game.levelUp;
            let pos = [];
            pos[0] = e.layerX ? e.layerX : e.offsetX;
            pos[1] = e.layerY ? e.layerY : e.offsetY;
            let size = leveled_up_splash.getImageSize();
            let center = environment.getCanvasCenter();
            let in_x = inbounds(pos[0], center[0], size[0]);
            let in_y = inbounds(pos[1], center[1], size[1]);
            if(in_x && in_y){
                game.resetLevelUp();
            }  
        }
    });


    document.addEventListener('keypress', function(e){
        let len = game.ships.length;
        switch(e.key){
            case ' ':
                if(!game.paused && !fired){
                    for(let i = 0; i < len > 0; i++){
                        game.ships[i].shoot(game);
                    }
                    fired = true;
                }
                break;
            case 'p':
                if(!paused && !game.leveled_up){
                    game.pause();
                    paused = true;
                }
                break;
            case 'Enter':
                if(game.leveled_up && game.paused){
                    game.resetLevelUp();
                }
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', function(e){
        let len = game.ships.length;
        if(!game.paused){
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
                case ' ':
                    fired = false;
                    break;
                case 'p':
                    paused = false;
                    break;
                default:
                    break;
            }
        }else if(e.key === "p"){
            paused = false;
        }
    });

    document.addEventListener('keydown', function(e){
        let len = game.ships.length;
        if(!game.paused){
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
        }
    });
}