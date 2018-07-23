var points = [];
var canvas;
var speed;
var stars = 1000;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  speed = 10;
  background(0);
  for(var i=0; i<stars; i++){
    //points.push(new Point(100*random(), 100*random()));
    points.push(new Point(random()*width-width/2, random()*height-height/2));
   // points.push(new Point(0,0));
    stroke(255);
  }
  
}

var time = 0;
var noiseScale=0.01;


class Point {
  constructor(x, y) {
    this.xpos = x;
    this.ypos = y;
    this.zpos = random()*width;
    this.pz = this.zpos;
    this.px = this.xpos;
  }
}

function keyPressed(){
  if (keyCode === 32) {
    speed = 6;
    if(speed){
      jump = true;
    }

  }
  console.log(keyCode);
  if(keyCode === 13)
  {
    speed = 0;
  }
  console.log(speed);
}

var jump = false;
//var angle = PI/6;

function draw() {
  time+=0.01;
  //stroke("#88aaff");
  stroke(150,150,180+speed);
  background(0);
  if(jump){
    jump= false;
  }
 
  points.map(point=>{
    point.xpos-=(mouseX-width/2)/width*point.zpos/100;
    point.ypos-=(mouseY-height/2)/height*point.zpos/100;
  })

  if (keyIsDown(RIGHT_ARROW)) {
    points.map(point=>{point.xpos-=3;});
  } else if (keyIsDown(LEFT_ARROW)) {
    points.map(point=>{point.xpos+=3;});
  } 
  if (keyIsDown(UP_ARROW)) {
    points.map(point=>{point.ypos+=3;});
  } else if (keyIsDown(DOWN_ARROW)) {
    points.map(point=>{point.ypos-=3;});
  } else if (keyIsDown(32)) {
    if(speed<120)
      speed= speed*1.1;
      jump =true;
  } else {
    //console.log(speed);
    if(speed>5 || speed===0){
      speed/=1.3;
    } else {
      speed = 5;
    }
    
  }



  // loop through stars
  for(var i=0; i<stars; i++){

    //current scaled position
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
    if(!(jump && speed<=50)){
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
}