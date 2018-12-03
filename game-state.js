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
            this.levelUpScores = [ 
                [], 
                [ 0, 4999, 9999, 15999, 21999, 28999, 35999, 43999, 51999, 60999, 69999],
                [ 0, 4999, 9999, 15999, 21999, 28999, 35999, 43999, 51999, 60999, 69999],
                [ 0, 4999, 9999, 15999, 21999, 28999, 35999, 43999, 51999, 60999, 69999],
            ]
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

        setUniverse(int){
            this.universe = int;
        }

        incUniverse(){
            this.universe += 1;
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
            let lvl_up_scores = this.levelUpScores[this.universe];
            if(this.level < lvl_up_scores.length - 1 && this.score > lvl_up_scores[this.level]){
                this.level += 1;
            }
            else if(this.level === lvl_up_scores.length - 1 && this.score > lvl_up_scores[this.level]){
                if(this.universe < this.levelUpScores.length - 1){
                    this.setLevel(1);
                    this.incUniverse();
                }else{
                    leveled_up = false;
                }
            }
            else{
                leveled_up = false;
            }
            return leveled_up;
        }
    }
        return new State();
};