
    function init_environment(game){

        class Enviornment{
            constructor(game){
                this.context = null;
                this.canvas = null;
                this.lastRender = 0;
                this.progress = 0;
                this.resources = null;
                this.game = game;
            }
            create(tag, w, h, color){
                let height = (window.innerHeight * 0.99);
                let body = document.getElementsByTagName("body")[0];
                let container = document.getElementById("container");
                body.removeChild(container);
                body.style.backgroundColor = color;

                this.canvas = document.getElementById(tag);
                this.context = this.canvas.getContext("2d");
                return this.context;
            }
        }

        let environment = new Enviornment(game);
        let canvas = environment.create("canvas", 1200, 900, "black");

        function loop(t){

            environment.progress = t - environment.lastRender;
        
            update(environment.progress);
            draw(environment.context);
        
            environment.lastRender = t;
            window.requestAnimationFrame(loop);
        }

        function update(progress) {
            // Update the state of the world for the elapsed time since last render
        }
        
        function draw(canvas) {
            console.log(game)
            game.draw(canvas)
            // Draw the state of the world
        }

        window.requestAnimationFrame(loop)
        return {environment: environment};
    }
    
