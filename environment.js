
    function init_environment(resources, size){

        class Enviornment{
            constructor(resources, size){
                this.context = null;
                this.canvas = null;
                this.lastRender = 0;
                this.progress = 0;
                this.resources = resources;
                this.center = null;
            }
            create(tag, size, color){
                let height = (window.innerHeight * 0.99);
                let body = document.getElementsByTagName("body")[0];
                body.innerHTML = '<canvas id="canvas" width="' + size[0] + '" height="' + size[1] + '"></canvas>';
                this.canvas = document.getElementById(tag);
                this.context = this.canvas.getContext("2d");
                this.center = [this.canvas.width / 2, this.canvas.height / 2];
                return this.context;
            }
        }

        let environment = new Enviornment(resources);
        let canvas = environment.create("canvas", size, "black");
        let state = init_game_state();
        let game = init_game(resources, environment, state);
        let input = init_input_handler(game, environment);

        function loop(t){
            environment.progress = t - environment.lastRender;
            draw(environment);
            environment.lastRender = t;
            window.requestAnimationFrame(loop);
        }

        function update(progress) {
            // Update the state of the world for the elapsed time since last render
        }
        
        function draw(environment) {
            game.draw(environment)
            // Draw the state of the world
        }

        window.requestAnimationFrame(loop)
        return {environment: environment};
    }
    
