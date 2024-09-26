const canvas = document.getElementById('flappyBirdGame');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Game state
let isGameOver = false;
let isGameStarted = false;

// Bird settings
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  gravity: 0.2, // Decreased gravity
  lift: -4, // Adjusted lift
  velocity: 0,
  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the beak
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width + 10, this.y + this.height / 4);
    ctx.lineTo(this.x + this.width + 10, this.y + (3 * this.height) / 4);
    ctx.fill();
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.height > canvas.height - 40) {
      this.y = canvas.height - 40 - this.height;
      this.velocity = 0;
      isGameOver = true;
    } else if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  flap() {
    this.velocity = this.lift;
  },
  reset() {
    this.y = canvas.height / 2;
    this.velocity = 0;
  }
};

// Pipe settings
const pipes = [];
const pipeWidth = 40;
const gap = 150;
let frameCount = 0;
let score = 0;

function createPipe() {
  const pipeHeight = Math.random() * (canvas.height - gap - 50) + 50;
  pipes.push({
    x: canvas.width,
    topPipeHeight: pipeHeight,
    bottomPipeHeight: canvas.height - pipeHeight - gap
  });
}

function drawPipes() {
  pipes.forEach(pipe => {
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x, canvas.height);
    gradient.addColorStop(0, 'lightgreen');
    gradient.addColorStop(1, 'green');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topPipeHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomPipeHeight - 40, pipeWidth, pipe.bottomPipeHeight);
    pipe.x -= 2;

    if (pipe.x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.topPipeHeight || bird.y + bird.height > canvas.height - pipe.bottomPipeHeight - 40)
    ) {
      isGameOver = true;
    }
  });
}

// Draw the score
function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.textAlign = 'left'; // Align text to the left
  ctx.fillText('Score: ' + score, 10, 30); // Adjusted y position for better visibility
}

// Draw the ground
function drawGround() {
  ctx.fillStyle = 'saddlebrown';
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

// Reset the game state
function resetGame() {
  bird.reset();
  pipes.length = 0;
  score = 0;
  frameCount = 0;
  isGameOver = false;
}

// Draw start screen with graphical enhancements
function drawStartScreen() {
  ctx.fillStyle = 'skyblue'; // Background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(40, canvas.height / 2 - 60, 240, 120);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(40, canvas.height / 2 - 60, 240, 120);

  ctx.fillStyle = '#000';
  ctx.font = '30px Comic Sans MS';
  ctx.textAlign = 'center';
  ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.fillStyle = '#000';
  ctx.font = '20px Comic Sans MS';
  ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2 + 20);
}

// Draw game over screen with graphical enhancements
function drawGameOverScreen() {
  ctx.fillStyle = 'skyblue'; // Background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(40, canvas.height / 2 - 60, 240, 120);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(40, canvas.height / 2 - 60, 240, 120);
  
  ctx.fillStyle = '#000';
  ctx.font = '30px Comic Sans MS';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.fillStyle = '#000';
  ctx.font = '20px Comic Sans MS';
  ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
  ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 40);
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#87CEEB'; // Sky color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (isGameStarted && !isGameOver) {
    bird.draw();
    bird.update();

    if (frameCount % 120 === 0) {
      createPipe();
    }

    drawPipes();
    drawScore();
    drawGround();

    frameCount++;
  } else if (!isGameStarted) {
    drawStartScreen();
  } else if (isGameOver) {
    drawGameOverScreen();
  }

  requestAnimationFrame(gameLoop);
}

// Start or reset the game on click
canvas.addEventListener('click', function() {
  if (isGameOver) {
    resetGame();
    isGameStarted = true;
  } else if (!isGameStarted) {
    isGameStarted = true;
  }
});

// Key listener for flapping the bird
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && isGameStarted && !isGameOver) {
    bird.flap();
  } else if (event.key === ' ' && isGameOver) {
    resetGame();
    isGameStarted = true;
  }
});

gameLoop();
