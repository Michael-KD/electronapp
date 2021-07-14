let sun;
let planets = []
let G = 50;
let numPlanets = 5;
let destabilise = 0.2;
let trailLength = 30;
let reverseChance = 0.1;
let minSize = 3;
let maxSize = 15;
let sunSize = 50;

        

function setup() {
    createCanvas(windowWidth*0.70,windowHeight)
    sun = new Body(sunSize, createVector(0,0), createVector(0,0))

 
    // Initialise the planets
    for (let i = 0; i < numPlanets; i++) {
        let mass = random(minSize, maxSize)
        let radius = random(sun.d, min(windowWidth*0.70/2,windowHeight/2))
        let angle = random(0, TWO_PI)
        let planetPos = createVector(radius * cos(angle), radius * sin(angle))
    
        // Find direction of orbit and set velocity
        let planetVel = planetPos.copy()
        if (random(1) < reverseChance) planetVel.rotate(-HALF_PI)
        else planetVel.rotate(HALF_PI)  // Direction of orbit
        planetVel.normalize()
        planetVel.mult( sqrt((G * sun.mass)/(radius)) ) // Circular orbit velocity
        planetVel.mult( random( 1-destabilise, 1+destabilise) ) // create elliptical orbit
    
        planets.push( new Body(mass, planetPos, planetVel) )
      }
    }
    
    function draw() {
      smooth()
      background(180)
      translate(width/2, height/2)
      for (let i = numPlanets-1; i >= 0; i--) {
        sun.attract(planets[i])
        planets[i].move()
        
        planets[i].show(255, 255, 255)
      }
      sun.show(255, 204, 100)
    }
    
    
    function Body(_mass, _pos, _vel){
      this.mass = _mass
      this.pos = _pos
      this.vel = _vel
      this.d = this.mass*2
      this.thetaInit = 0
      this.path = []
    
      this.show = function(color1, color2, color3) {
        stroke(255, 204, 100)
        for (let i = 0; i < this.path.length-2; i++) {
          line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
        }
        fill(color1, color2, color3); noStroke()
        ellipse(this.pos.x, this.pos.y, this.d, this.d)
      }
    
    
      this.move = function() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        this.path.push(createVector(this.pos.x,this.pos.y))
        if (this.path.length > trailLength) this.path.splice(0,1)
      }
    
      this.applyForce = function(f) {
        this.vel.x += f.x / this.mass
        this.vel.y += f.y / this.mass
      }
    
      this.attract = function(child) {
        let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
        let f = (this.pos.copy()).sub(child.pos)
        f.setMag( (G * this.mass * child.mass)/(r * r) )
        child.applyForce(f)
      }
    
    }