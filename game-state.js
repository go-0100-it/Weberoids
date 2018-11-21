function init_game_state(){
    class State{
        constructor(){
            this.score = 0;
            this.time = 0;
            this.game_on = false;
            this.level = 1;
            this.universe = 1;
            this.lives = 1;
            this.ships = [];
            this.explosiveProjectiles = {};
            this.shields = 0;
        }

        setLives(int){
            this.lives = int;
        }

        getLives(){
            return this.lives;
        };

        is_game_on(){
            return this.game_on;
        };

        getLevel(){
            return this.level;
        };

        getScore(){
            return this.score;
        };

        setScore(int){
            this.score = int;
        }
        
        setLevel(int){
            this.level = int;
        }
            
        lose_life(){
            if(this.lives > 0){
                this.lives -= 1;
            }
        }

        gain_life(n = 1){
            this.lives += n;
        }

        increment_score(inc){
            this.score += inc;
        }

        increment_universe(n = 1){
            this.universe += n;
        }

        increment_shields(n = 1){
            this.shields += n;
        }

        increment_time(){
            this.time += 1;
        }

        drawStateDetails(canvas){
            canvas.font="20px Arial";
            canvas.fillStyle="#FFFFFF";
            canvas.fillText("SCORE  " + this.score,15,30);
            canvas.font="40px Arial";
            canvas.fillText("LEVEL  " + this.level,530,50);
            //console.log("TEXTING")
        }

        addShip(ship){
            this.ships.push(ship);
        }

        addExplosiveProjectiles(projectile){
            this.explosiveProjectiles.push(projectile);
        }
        
        gain_life(n = 1){
            this.lives += n;
        }

        update_level(){
            let leveled_up = true;
            if(this.level === 1 && this.score > 4999){
                this.level = 2;
            }
            else if(this.level === 2 && this.score > 9999){
                this.level = 3;
            }
            else if(this.level === 3 && this.score > 15999){
                this.level = 4;
            }
            else if(this.level === 4 && this.score > 21999){
                this.level = 5;
            }
            else if(this.level === 5 && this.score > 28999){
                this.level = 6;
            }
            else if(this.level === 6 && this.score > 35999){
                this.level = 7;
            }
            else if(this.level === 7 && this.score > 43999){
                this.level = 8;
            }
            else if(this.level === 8 && this.score > 51999){
                this.level = 9;
            }
            else if(this.level === 9 && this.score > 60999){
                this.level = 10;
            }
            else if(this.level === 10 && this.score > 69999){
                this.level = 100;
            }
            else{
                leveled_up = false;
            }
            return leveled_up;
        }
    }
        return new State();
};