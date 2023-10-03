import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import "./main.css";

export default function WhiteBoard() {
  const [url, setUrl] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);

  let myWhiteBoard = useRef<HTMLDivElement | null>(null);
  let myCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (myWhiteBoard.current) {
      setCanvasWidth(myWhiteBoard.current.clientWidth);
      setCanvasHeight(myWhiteBoard.current.clientHeight);
    }
    if (myCanvas.current) {
      const ctx = myCanvas.current.getContext("2d");
      if (!ctx) return;
      initHandler(myCanvas.current, ctx);
    }
  }, []);

  function initHandler(
    myCanvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    // Set Background Color
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    // Mouse Event Handlers

    let isDown = false;
    let canvasX = 0;
    let canvasY = 0;
    ctx.lineWidth = 4;

    const mouseDraw = {
      mousedown: function (evt: MouseEvent) {
        isDown = true;
        ctx.beginPath();
        const scrollTop = window.scrollY;
        canvasX = evt.pageX - myCanvas.getBoundingClientRect().left;
        canvasY = evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop;
        ctx.moveTo(canvasX, canvasY);
      },
      mousemove: function (evt: MouseEvent) {
        if (isDown !== false) {
          const scrollTop = window.scrollY;
          canvasX = evt.pageX - myCanvas.getBoundingClientRect().left;
          canvasY =
            evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop;
          ctx.lineTo(canvasX, canvasY);
          ctx.strokeStyle = "#000";
          ctx.stroke();
        }
      },
      mouseup: function (evt: MouseEvent) {
        isDown = false;
        ctx.closePath();
      },
      mouseleave: function (evt: MouseEvent) {
        isDown = false;
        ctx.closePath();
      },
    };

    // Mouse Events
    myCanvas.addEventListener("mousedown", mouseDraw.mousedown, false);
    myCanvas.addEventListener("mouseup", mouseDraw.mouseup, false);
    myCanvas.addEventListener("mousemove", mouseDraw.mousemove, false);
    myCanvas.addEventListener("mouseleave", mouseDraw.mouseleave, false);

    // Touch Events Handlers
    const touchDraw = {
      started: false,
      start: function (evt: TouchEvent) {
        ctx.beginPath();
        const scrollTop = window.scrollY;
        canvasX = evt.touches[0].pageX - myCanvas.getBoundingClientRect().left;
        canvasY =
          evt.touches[0].pageY -
          myCanvas.getBoundingClientRect().top -
          scrollTop;

        ctx.moveTo(canvasX, canvasY);
        this.started = true;
      },
      move: function (evt: TouchEvent) {
        evt.preventDefault();

        if (this.started) {
          const scrollTop = window.scrollY;
          canvasX =
            evt.touches[0].pageX - myCanvas.getBoundingClientRect().left;
          canvasY =
            evt.touches[0].pageY -
            myCanvas.getBoundingClientRect().top -
            scrollTop;

          ctx.lineTo(canvasX, canvasY);
          ctx.strokeStyle = "#000";
          ctx.stroke();
        }
      },
      end: function (evt: TouchEvent) {
        this.started = false;
      },
    };

    // Touch Events
    myCanvas.addEventListener("touchstart", touchDraw.start, false);
    myCanvas.addEventListener("touchend", touchDraw.end, false);
    myCanvas.addEventListener("touchmove", touchDraw.move, false);

    // Disable Page Move
    document.body.addEventListener(
      "touchmove",
      function (evt) {
        evt.stopPropagation();
      },
      false
    );
  }

  const handleReset = () => {
    const ctx = myCanvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(
      0,
      0,
      myCanvas.current?.width || canvasWidth,
      myCanvas.current?.height || canvasHeight
    );
  };

  const handlePreview = () => {
    const ctx = myCanvas.current?.getContext("2d");
    if (!ctx) return;
    // 默认png/base64
    let imgUrl = myCanvas.current?.toDataURL() || "";
    setUrl(imgUrl);
  };

  return (
    <div className="white-board">
      <div className="action-bar">
        <Button variant="outlined" onClick={handleReset}>
          重置
        </Button>
      </div>
      <div className="white-board-content" ref={myWhiteBoard}>
        <canvas
          id="my-canvas"
          width={canvasWidth}
          height={canvasHeight}
          ref={myCanvas}
        />
      </div>
    </div>
  );
}
