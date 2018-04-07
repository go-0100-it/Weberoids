
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

    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if(((width * 0.75) > height) && (height * (1 / 0.75) <= width)){
        height = height * 0.99;
        width = height * (1 / 0.75);
    }else if(height * (1 / 0.75) > width && (width * 0.75) <= height){
        width = width * 0.99
        height = width * 0.75
    }

    
    let environment = init_environment(resources, [width, height]);
    
}