let isDrawing = false;
let currentColor = "#f5576c";

function createPixelGrid() {
  const size = parseInt(document.getElementById("gridSize").value);
  const grid = document.getElementById("pixelGrid");
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.innerHTML = "";

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";

    pixel.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDrawing = true;
      paintPixel(pixel);
    });

    pixel.addEventListener("mouseover", () => {
      if (isDrawing) paintPixel(pixel);
    });

    pixel.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDrawing = true;
      paintPixel(pixel);
    });

    pixel.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.classList.contains("pixel")) {
        paintPixel(element);
      }
    });

    grid.appendChild(pixel);
  }
}

document.addEventListener("mouseup", () => (isDrawing = false));
document.addEventListener("touchend", () => (isDrawing = false));

function paintPixel(pixel) {
  currentColor = document.getElementById("pixelColor").value;
  pixel.style.background = currentColor;
}

function clearPixels() {
  document.querySelectorAll(".pixel").forEach((p) => (p.style.background = "white"));
}

function fillAll() {
  currentColor = document.getElementById("pixelColor").value;
  document.querySelectorAll(".pixel").forEach((p) => (p.style.background = currentColor));
}

function setColor(color) {
  document.getElementById("pixelColor").value = color;
  currentColor = color;
}

function randomFill() {
  document.querySelectorAll(".pixel").forEach((pixel) => {
    const randomColor =
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    pixel.style.background = randomColor;
  });
}

function downloadArt() {
  const grid = document.getElementById("pixelGrid");
  const size = parseInt(document.getElementById("gridSize").value);
  const canvas = document.createElement("canvas");
  const scale = 20;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d");

  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach((pixel, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const color = pixel.style.background || "white";
    ctx.fillStyle = color;
    ctx.fillRect(col * scale, row * scale, scale, scale);
  });

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixel-art.png";
    a.click();
    URL.revokeObjectURL(url);
  });
}

createPixelGrid();

document.getElementById("pixelColor").addEventListener("change", (e) => {
  currentColor = e.target.value;
});
