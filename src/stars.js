var points = []; // all the stars
var canvas; //p5.js canvas element
var speed; // speed we are flying though the star field
var stars = 1000; //number of stars in our universe at any one time
//var jump = false; // are we jumping to light speed???

// class to represent a star
class Point {
  constructor(x, y) {
    this.xpos = x;
    this.ypos = y;
    this.zpos = random()*width;
    this.pz = this.zpos;
    this.px = this.xpos;
  }
}

//p5.js setup function, gets run once
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  speed = 10;
  background(0);
  //spawn random stars
  for(var i=0; i<stars; i++){
    points.push(new Point(random()*width-width/2, random()*height-height/2));
  }
}

// p5 function, gets called when a key on the keyboard is pressed
// keyCode is what ASCII code for the key
function keyPressed(){
  //enter key to stop the movement
  if(keyCode === 13){
    speed = 0;
  } else if(keyCode === 32 || keyCode === 16){
    if(speed === 0)
      speed = 5;  
  }
  // TODO: add more keys to do things, lasers?
}

// p5 draw function gets called often
function draw() {
  // color change with 'dopler shifted' speed
  stroke(150,150,180+speed);
  //refresh screen
  background(0);
  //make sure we are not jumping to light speed forever
  // if(jump){
  //   jump= false;
  // }
 
  //angle the stars according to the mouse
  //TODO: create dead zone for straight flying 
  points.map(point=>{
    point.xpos-=(mouseX-width/2)/width*point.zpos/100;
    point.ypos-=(mouseY-height/2)/height*point.zpos/100;
  });

  // slide according to arrow keys
  if (keyIsDown(RIGHT_ARROW)) {
    points.map(point=>{point.xpos-=3;});
  } else if (keyIsDown(LEFT_ARROW)) {
    points.map(point=>{point.xpos+=3;});
  } 
  if (keyIsDown(UP_ARROW)) {
    points.map(point=>{point.ypos+=3;});
  } else if (keyIsDown(DOWN_ARROW)) {
    points.map(point=>{point.ypos-=3;});
  } else if (keyIsDown(32) || mouseIsPressed) {
    if(speed<120)
      speed= speed*1.075;
      //jump =true;
  } else if(keyIsDown(16)) {
    if(speed<20){
      speed= speed*1.10;
    }
  } else{
    if(speed>5 || speed===0){
      speed/=1.3;
    } else {
      speed = 5;
    }
  }

  // loop through all stars
  for(var i=0; i<stars; i++){

    //current scaled position on screen
    var sx = map(points[i].xpos/points[i].zpos, -0.5, 0.5, 0, width);
    var sy = map(points[i].ypos/points[i].zpos, -0.5, 0.5, 0, height);

    //old scaled position for streak effect
    var px = map(points[i].xpos/points[i].pz, -0.5, 0.5, 0, width);
    var py = map(points[i].ypos/points[i].pz, -0.5, 0.5, 0, height);

    //closer objects are bigger
    strokeWeight(map(points[i].zpos, 0, width, 6, 0));
    //draw star
    line(sx, sy, px, py);

    //if we are making the jump to light speed, make the stars streak by keeping old position
    if(!(keyIsDown(32) && speed<=50)){
      points[i].pz = points[i].zpos;
      points[i].px = points[i].xpos;
    }

    //move stars by speed of universe
    points[i].zpos-=speed;
    
    //if we pass the star, reset the star
    if(points[i].zpos<0){
      points[i].zpos = width;
      points[i].xpos = random()*width-width/2;
      points[i].ypos = random()*height*2-height;
      points[i].pz = width;
    }
    //if the star is out of our field of vision
    //reset it 
    //this is mainly for when the user is stopped, 
    //and they steer passed the stars
    if(sx/width > 1.1 && mouseX<width/2)
    {
      points[i].zpos = width*random();
      points[i].xpos = -random()*width/2-width/2
      points[i].ypos = random()*height*2-height;
      points[i].pz = points[i].zpos;
    }
    else if(sx/width< -0.1 && mouseX>width/2)
    {
      points[i].zpos = width*random();
      points[i].xpos = random()*width/2+width/2;
      points[i].ypos = random()*height*2-height;
      points[i].pz = points[i].zpos;
    }
    if(sy/height > 1.1 && mouseY<height/2)
    {
      points[i].zpos = width*random();
      points[i].xpos = random()*width-width/2;
      points[i].ypos = -random()*height/2-height/2;
      points[i].pz = points[i].zpos;
    }
    else if(sy/height < -0.1 && mouseY>height/2)
    {
      points[i].zpos = width*random();
      points[i].xpos = random()*width-width/2;
      points[i].ypos = random()*height/2+height/2
      points[i].pz = points[i].zpos;
    }
  }

  strokeWeight(3);
  rect(15, height/2-map(speed, 0, 120, 0, height/3), 15, map(speed, 0, 120, 0, height/3));
}