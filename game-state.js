function init_game_state(){
    class State{
        constructor(){
            this.score = 0;
            this.time = 0;
            this.game_on = false;
            this.level = 1;
            this.lives = 3;
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

        increment_score(inc){
            this.score += inc;
        }

        increment_time(){
            this.time += 1;
        }

        drawStateDetails(canvas){
            canvas.font="20px Arial";
            canvas.fillStyle="#FFFFFF";
            canvas.fillText("SCORE  " + this.score,15,30);
            canvas.fillText("LIVES  " + this.lives,1100,30);
            canvas.font="40px Arial";
            canvas.fillText("LEVEL  " + this.level,530,50);
            //console.log("TEXTING")
        }
        
        gain_life(){
            this.lives += 1;
        }

        update_level(){
            let leveled_up = true;
            if(this.level === 1 && this.score > 4999){
                this.level = 2;
                this.lives += this.level;
            }
            else if(this.level === 2 && this.score > 9999){
                this.level = 3;
                this.lives += this.level;
            }
            else if(this.level === 3 && this.score > 17499){
                this.level = 4;
                this.lives += this.level;
            }
            else if(this.level === 4 && this.score > 24999){
                this.level = 5;
                this.lives += this.level;
            }
            else if(this.level === 5 && this.score > 32499){
                this.level = 6;
                this.lives += this.level;
            }
            else if(this.level === 6 && this.score > 49999){
                this.level = 7;
                this.lives += this.level;
            }else{
                leveled_up = false;
            }
            return leveled_up;
        }
    }
        return new State();
};