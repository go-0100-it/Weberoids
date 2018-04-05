function init_environment(){

    let height = (window.innerHeight * 0.99);
    let container = document.getElementById('container');
    container.style.backgroundColor = "black";
    let loader = document.getElementById("load");
    container.removeChild(loader);
    let canvas = document.createElement("canvas");
    canvas.style.width = (height * 1.5) + "px";
    canvas.style.height = height + "px";
    container.appendChild(canvas);
}