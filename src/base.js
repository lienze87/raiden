const root = document.getElementById("root");
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
root.appendChild(canvas);

const ctx = canvas.getContext("2d");
