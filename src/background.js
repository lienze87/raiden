let gameSpeed = 5;

const backgroundImg = new Image();
backgroundImg.src = "../assets/background.jpg";

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGHT;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }
  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = Math.floor(this.x - this.speed);
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

const layer1 = new Layer(backgroundImg, 1);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  layer1.update();
  layer1.draw();
  requestAnimationFrame(animate);
}

animate();
