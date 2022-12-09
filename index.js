// get canvas related references
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different figures
var rects = [];

// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

// call to draw the scene
draw();

// draw a single rect
function rect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}
// draw a single circle
function circ(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

// clear the canvas
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
  clear();
  ctx.fillStyle = "#FAF7F8";
  rect(0, 0, WIDTH, HEIGHT);
  // redraw each fig in the rects[] array
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i];
    ctx.fillStyle = r.fill;
    if (r.circle) circ(r.x, r.y, r.radius);
    else rect(r.x, r.y, r.width, r.height);
  }
}

function createRect() {
  rects.push({
    x: 75 - 15,
    y: 50 - 15,
    width: 30,
    height: 30,
    fill: "#444444",
    isDragging: false,
    circle: false,
  });
  draw();
}

function createCirc() {
  rects.push({
    x: 200,
    y: 100,
    radius: 20,
    fill: "#444444",
    isDragging: false,
    circle: true,
  });
  draw();
}

// handle mousedown events
function myDown(e) {
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  var mx = parseInt(e.clientX - offsetX);
  var my = parseInt(e.clientY - offsetY);

  // test each rect to see if mouse is inside
  dragok = false;
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i];
    if (
      !r.circle &&
      mx > r.x &&
      mx < r.x + r.width &&
      my > r.y &&
      my < r.y + r.height
    ) {
      dragok = true;
      r.isDragging = true;
    }
    if (
      r.circle &&
      mx > r.x - r.radius &&
      mx < r.x + r.radius &&
      my > r.y - r.radius &&
      my < r.y + r.radius
    ) {
      dragok = true;
      r.isDragging = true;
    }
  }
  // save the current mouse position
  startX = mx;
  startY = my;
}

// handle mouseup events
function myUp(e) {
  e.preventDefault();
  e.stopPropagation();

  dragok = false;
  for (var i = 0; i < rects.length; i++) {
    rects[i].isDragging = false;
  }
}

// handle mouse moves
function myMove(e) {
  if (dragok) {
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    var dx = mx - startX;
    var dy = my - startY;

    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      if (r.isDragging) {
        r.x += dx;
        r.y += dy;
      }
    }

    // redraw the scene with the new positions
    draw();

    // reset the starting mouse position for the next mousemove
    startX = mx;
    startY = my;
  }
}
