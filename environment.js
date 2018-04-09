
    function init_environment(resources){

        class Enviornment{
            constructor(resources, utils){
                this.context = null;
                this.canvas = null;
                this.lastRender = 0;
                this.progress = 0;
                this.resources = resources;
                this.center = null;
                this.utils = utils;
            }
            create(tag, size, color){
                
                let body = document.getElementsByTagName("body")[0];
                body.innerHTML = '<canvas id="canvas" width="' + size[0] + '" height="' + size[1] + '"></canvas>';
                this.canvas = document.getElementById(tag);
                this.context = this.canvas.getContext("2d");
                this.center = [this.canvas.width / 2, this.canvas.height / 2];
                return this.context;
            }
        }

        let utils = init_util();
        let size = utils.calc_size();
        let environment = new Enviornment(resources, utils);
        let factory = createSpriteFactory();
        let canvas = environment.create("canvas", size, "black");
        let state = init_game_state();
        let game = init_game(resources, environment, state, factory);
        let input = init_input_handler(game, environment);

        function loop(t){
            let progress = t - environment.lastRender;
            let factor = progress / (1000 / 60)
            draw(environment, factor);
            environment.lastRender = t;
            window.requestAnimationFrame(loop);
        }

        function update(progress) {
            // Update the state of the world for the elapsed time since last render
            console.log(progress)
        }
        
        function draw(environment, factor) {
            game.draw(environment, factor)
            // Draw the state of the world
        }

        window.requestAnimationFrame(loop)
        return {environment: environment};
    }
    
