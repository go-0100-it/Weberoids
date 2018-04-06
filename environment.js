
    function init_environment(resources){

        console.dir(resources);
        console.dir(resources.spriteFactory);

        class Enviornment{
            constructor(resources){
                this.context = null;
                this.canvas = null;
                this.lastRender = 0;
                this.progress = 0;
                this.resources = resources;
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

        let environment = new Enviornment(resources);
        let canvas = environment.create("canvas", 1000, 750, "black");
        let game = init_game(resources, environment);

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
            game.draw(canvas)
            // Draw the state of the world
        }

        window.requestAnimationFrame(loop)
        return {environment: environment};
    }
    
