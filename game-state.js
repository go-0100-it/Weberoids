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

        getLives(){return this.lives;};

        is_game_on(){return this.game_on;};

        getLevel(){return this.level;};

        getScore(){return this.score;};

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
            else{
                this.end();
            }
        }

        increment_score(inc){
            this.score += inc;
        }
        
        gain_life(){
            this.lives += 1;
        }

        update_level(){
            if(this.level === 1 && this.score > 9999){
                this.level = 2;
                this.lives += this.level;
            }
            else if(this.level === 2 && this.score > 19999){
                this.level = 3;
                this.lives += this.level;
            }
            else if(this.level === 3 && this.score > 29999){
                this.level = 4;
                this.lives += this.level;
            }
        }
    }
        return new State();
};