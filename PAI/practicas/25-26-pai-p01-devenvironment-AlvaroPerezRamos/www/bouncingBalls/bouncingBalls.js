/**
 * @author       F. de Sande
 * @since 27.01.2020
 *
 * Object building practice
 * In this article we will write a classic "bouncing balls" demo, to show you how useful objects can be in JavaScript. 
 * Our little balls will bounce around on the screen, and change color when they touch each other. 
 * 
 * This example will make use of the Canvas API for drawing the balls to the screen, and the requestAnimationFrame API 
 * for animating the whole display — you don't need to have any previous knowledge of these APIs, and we hope that by 
 * the time you've finished this article you'll be interested in exploring them more. 
 * Along the way we'll make use of some nifty objects, and show you a couple of nice techniques like bouncing balls off walls, 
 * and checking whether they have hit each other (otherwise known as collision detection.
 * 
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
 * https://github.com/mdn/learning-area/blob/master/javascript/oojs/bouncing-balls/main-finished.js
 */


// setup canvas

const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');

const WIDTH = CANVAS.width = window.innerWidth;
const HEIGHT = CANVAS.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const NUM = Math.floor(Math.random()*(max-min)) + min;
  return NUM;
}

class Ball {
  constructor (x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
	}

  // ball draw method
  draw () {
    CTX.beginPath();
    CTX.fillStyle = this.color;
    CTX.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    CTX.fill();
  }

  // ball update method
  update () {
    if((this.x + this.size) >= WIDTH) {
      this.velX = -(this.velX);
    }
    if((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
    if((this.y + this.size) >= HEIGHT) {
      this.velY = -(this.velY);
    }
    if((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  // ball collision detection
  collisionDetect () {
    const MAX_RGB_COLOR = 255;
    for(let j = 0; j < balls.length; j++) {
      if(!(this === balls[j])) {
        const DX = this.x - balls[j].x;
        const DY = this.y - balls[j].y;
        const DISTANCE = Math.sqrt(DX * DX + DY * DY);
        if (DISTANCE < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, MAX_RGB_COLOR) + ',' + random(0, MAX_RGB_COLOR) + ',' + random(0, MAX_RGB_COLOR) +')';
        }
      }
    }
  }
}


// define array to store balls and populate it
let balls = [];
const NUM_BALLS = 25;
const MAX_RGB_COLOR = 255;

while(balls.length < NUM_BALLS) {
  const size = random(10, 20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size, WIDTH - size),
    random(0 + size, HEIGHT - size),
    random(-7, 7),
    random(-7, 7),
    'rgb(' + random(0, MAX_RGB_COLOR) + ',' + random(0, MAX_RGB_COLOR) + ',' + random(0, MAX_RGB_COLOR) +')',
    size
  );
  balls.push(ball);
}

// define loop that keeps drawing the scene constantly
function loop() {
  CTX.fillStyle = 'rgba(0, 0, 0, 0.25)';
  CTX.fillRect(0, 0, WIDTH, HEIGHT);

  for(let i = 0; i < NUM_BALLS; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();
