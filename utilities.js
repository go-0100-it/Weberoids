function init_util(){

    /**
     * Returns a random integer between `min` and `max`.
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {number} a random integer
     */
    Math.randInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }


    /**
     * Returns a random floating point number between `min` and `max`.
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {number} a random floating point number
     */
    Math.randFloat = function(min, max) {
        return Math.random() * (max - min) + min;
    }


    /**
     * Returns a random boolean value.
     * 
     * @return {boolean} a random true/false
     */
    Math.randBool = function() {
        return Math.random() >= 0.5;
    }



    Array.prototype.diff = function(a){
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };


    //helper
    /**
     * converts degree to radians
     * @param degree
     * @returns {number}
     */
    Math.rad = function (degree) {
        return degree * (Math.PI / 180);
    };



    /**
     * Converts radian to degree
     * @param radians
     * @returns {number}
     */
    Math.deg = function (radians) {
        return radians * (180 / Math.PI);
    }

    class Utilities{

        constructor(){
            this.const = 0.02;
        }

        calc_size(){
            let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            if(((width * 0.75) > height) && (height * (1 / 0.75) <= width)){
                height = height * 0.99;
                width = height * (1 / 0.75);
            }else if(height * (1 / 0.75) > width && (width * 0.75) <= height){
                width = width * 0.99;
                height = width * 0.75;
            }
            return [width, height];
        };

        relativeVelocity(level, vel){
            let diff_1;
            let diff_2;
            if(level < 3){
                diff_1 = Math.randInt(0, 2);
                diff_2 = Math.randInt(0, 2);
            }else if(level < 5){
                diff_1 = Math.randInt(0, 3);
                diff_2 = Math.randInt(0, 2);
            }else if(level < 7){
                diff_1 = Math.randInt(0, 3);
                diff_2 = Math.randInt(0, 3);
            }
            if(vel[0] < 0){
                diff_1 = -(diff_1);
            }  
            if(vel[1] < 0){
                diff_2 = -(diff_2)
            }
            return [vel[0] + diff_1, vel[1] + diff_2];
        };
    }

    return new Utilities();
}