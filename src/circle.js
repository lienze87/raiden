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
