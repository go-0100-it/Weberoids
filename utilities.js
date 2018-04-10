function init_util(){

    /**
     * Returns a random integer between `min` and `max`.
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {number} a random integer
     */
    Math.randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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
    }

    return new Utilities();
}