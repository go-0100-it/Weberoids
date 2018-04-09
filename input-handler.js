function init_input_handler(game, environment){

    function inbounds(coord, center, size){
        return (coord > center - size / 2) && (coord < center + size / 2)
    }
    environment.canvas.addEventListener('click', function(e){
        let pos = [];
        pos[0] = e.layerX ? e.layerX : e.offsetX;
        pos[1] = e.layerY ? e.layerY : e.offsetY;
        let size = game.ships[0].image_size;
        let center = environment.center;
        let in_x = inbounds(pos[0], center[0], size[0]);
        let in_y = inbounds(pos[1], center[1], size[1]);
        if(in_x && in_y){
            console.log("START");
        }  
    });

    document.addEventListener('keypress', function(e){
        switch(e.key){
            case ' ':
                console.log("YOU GOT IT");
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', function(e){
        switch(e.key){
            case 'ArrowUp':
                game.ships[0].thrusters_off();
                break;
            case 'ArrowDown':
                console.log("ArrowDown");
                break;
            case 'ArrowRight':
                console.log("ArrowRight");
                break;
            case 'ArrowLeft':
                console.log("ArrowLeft");
                break;
            default:
                break;
        }
    });

    document.addEventListener('keydown', function(e){
        switch(e.key){
            case 'ArrowUp':
                game.ships[0].thrusters_on();
                break;
            case 'ArrowDown':
                
                break;
            case 'ArrowRight':
                console.log("ArrowRight");
                break;
            case 'ArrowLeft':
                console.log("ArrowLeft");
                break;
            default:
                break;
        }
    });
}