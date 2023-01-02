import { useEffect } from "react";
import { Layer, CANVAS_WIDTH, CANVAS_HEIGHT } from "./components/layer";
import ImgUrl from "./assets/background.jpg";

let ctx = null;

const backgroundImg = new Image();
backgroundImg.src = ImgUrl;

function App() {
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
