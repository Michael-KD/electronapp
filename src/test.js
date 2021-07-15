const electron = require('electron');
const remote = electron.remote;
const $ = require('jquery');


let angle = 0;

function setup() {
    createCanvas(windowWidth*0.70, windowHeight, WEBGL);
    cam = createCapture(VIDEO);
    cam.hide();
}


function draw() {
    ambientLight(255);
    background(175);
    rotateX(angle);
    rotateY(angle*0.3);
    rotateZ(angle*1.2);
    noStroke();
    texture(cam);
    box(200);

    angle += 0.03;
}


let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

if (darkMode == true) {
    document.body.classList.toggle("dark-theme");
  }

//load new html page
$(".test-button").on('click', function test() {
    remote.getCurrentWindow().loadFile(__dirname + '/index.html');
  });