const root = document.getElementById("root");
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

root.appendChild(canvas);

const ctx = canvas.getContext("2d");
let angle = 0;

function animate() {
  if (angle === 0) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  if (angle - 2 < 0.01) {
    ctx.beginPath();
    ctx.arc(300, 300, 100, angle, (angle + 0.01) * Math.PI);
    ctx.stroke();
    angle += 0.01;
  }

  requestAnimationFrame(animate);
}

animate();
