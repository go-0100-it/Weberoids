
    let media = null;
    function init(){
        media = resources();
    }
    

    function init_environment(){

        class Enviornment{
            constructor(){
                this.context = null;
                this.canvas = null;
                this.lastRender = 0;
                this.progress = 0;
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

        let environment = new Enviornment();
        let canvas = environment.create("canvas", 1200, 900, "black");

        nebula = media.getResource("Nebula");
        ship = media.getResource("Basic ship");

        function loop(t){

            environment.progress = t - environment.lastRender;
        
            update(environment.progress);
            draw();
        
            environment.lastRender = t;
            window.requestAnimationFrame(loop);
        }

        function update(progress) {
            // Update the state of the world for the elapsed time since last render
        }
        
        function draw() {
            canvas.drawImage(nebula.image, 0, 0, 800, 600, 0, 0, 1200, 900);
            canvas.drawImage(ship.image, 0, 0, 90, 90, 600-45, 450-45, 90, 90);
            // Draw the state of the world
        }

        window.requestAnimationFrame(loop)
    
    }
    
