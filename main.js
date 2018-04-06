
function init_main(resources){
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
    Math.ang = function (radians) {
        return radians * (180 / Math.PI);
    }
    let environment = init_environment(resources);
    
}