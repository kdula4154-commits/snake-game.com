const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const ui = document.querySelector(".ui");
const bgMusic = document.getElementById("bgMusic");
const bgVideo = document.getElementById("bgVideo");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScore = document.getElementById("finalScore");

const box = 20;
let snake, direction, food, score, game;

// Resize canvas (responsive)
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Init game
function initGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = score;

  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// Keyboard controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch controls (mobile swipe)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && direction !== "LEFT") direction = "RIGHT";
    if (dx < -30 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 30 && direction !== "UP") direction = "DOWN";
    if (dy < -30 && direction !== "DOWN") direction = "UP";
  }

  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: false });

// Start / Restart
startBtn.addEventListener("click", () => {
  ui.style.display = "none";
  gameOverMessage.style.display = "none";

  clearInterval(game);
  initGame();
  game = setInterval(draw, 120);

  bgMusic.currentTime = 0;
  bgMusic.play();

  bgVideo.currentTime = 0;
  bgVideo.play();
});

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((p, i) => {
    ctx.fillStyle = i === 0 ? "#7CFC00" : "#32CD32";
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, box, box, 8);
    ctx.fill();

    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(p.x + 5, p.y + 5, 3, 3);
      ctx.fillRect(p.x + 12, p.y + 5, 3, 3);
    }
  });

  // Food
  ctx.font = "20px Arial";
  ctx.fillText("🍎", food.x, food.y + box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat
  if (headX === food.x && headY === food.y) {
    score++;
    scoreEl.textContent = score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Game over
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(p => p.x === newHead.x && p.y === newHead.y)
  ) {
    clearInterval(game);
    ui.style.display = "block";
    startBtn.textContent = "Restart Game";
    finalScore.textContent = score;
    gameOverMessage.style.display = "block";
    bgMusic.pause();
    bgVideo.pause();
    return;
  }

  snake.unshift(newHead);
}
