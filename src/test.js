const electron = require('electron');
const remote = electron.remote;
const $ = require('jquery');


let angle = 0;

function setup() {
    createCanvas(windowWidth*0.70, windowHeight, WEBGL);
}


function draw() {
    background(175);

    rectMode(CENTER);
    noStroke();
    fill(0, 0, 255);
    translate(mouseX - width/2, mouseY - height/2);
    rotateX(angle);
    rotateY(angle * 0.3);
    rotateZ(angle * 1.2);
    // rect(0, 0, 150, 100);
    
    box(10, 100, 50);
    

    angle += 0.03; // 0.01 radians = 1 degree 
}

//load new html page
$(".test-button").click(function() {
    remote.getCurrentWindow().loadFile(__dirname + '/index.html');
  });