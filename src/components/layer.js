export const gameSpeed = 5;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export class Layer {
  constructor(ctx, image, speedModifier) {
    this.ctx = ctx;
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
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}
