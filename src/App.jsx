import { useEffect } from "react";
import ImgUrl from "./assets/background.jpg";

const backgroundImg = new Image();
backgroundImg.src = ImgUrl;

const gameSpeed = 5;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

class Layer {
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

function App() {
  let ctx = null;
  const initCanvas = () => {
    const root = document.getElementById("root");

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    root.appendChild(canvas);

    ctx = canvas.getContext("2d");
  };

  useEffect(() => {
    initCanvas();
    const layer1 = new Layer(ctx, backgroundImg, 1);

    function animate() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      layer1.update();
      layer1.draw();
      requestAnimationFrame(animate);
    }
    animate();
  }, []);
}

export default App;
