// Constants
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 20;
const PLATFORM_GAP = 100;
const PLATFORM_SPEED = 2;
const MAX_PLATFORMS = 10;
const GRAVITY = 0.1;
const JUMP_SPEED = 4;

// Variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let platforms = [];
let player = null;
let score = 0;

// Platform class
class Platform {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	draw() {
		ctx.fillStyle = '#000';
		ctx.fillRect(this.x, this.y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
	}
	
	move() {
		this.y += PLATFORM_SPEED;
	}
}

// Player class
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.velocityY = 0;
		this.onPlatform = false;
	}
	
	draw() {
		ctx.fillStyle = '#F00';
		ctx.fillRect(this.x, this.y, 20, 20);
	}
	
	move() {
		if (this.onPlatform) {
			this.velocityY = -JUMP_SPEED;
			this.onPlatform = false;
		}
		this.y += this.velocityY;
		this.velocityY += GRAVITY;
	}
	
	checkCollision() {
		for (let i = 0; i < platforms.length; i++) {
			if (this.x + 20 >= platforms[i].x && this.x <= platforms[i].x + PLATFORM_WIDTH &&
				this.y + 20 >= platforms[i].y && this.y + 20 <= platforms[i].y + PLATFORM_HEIGHT &&
				this.velocityY > 0) {
				this.velocityY = -JUMP_SPEED;
				this.onPlatform = true;
				score++;
				break;
			}
		}
	}
}

// Create initial platforms
for (let i = 0; i < MAX_PLATFORMS; i++) {
	let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
	let y = canvas.height - (i + 1) * PLATFORM_GAP;
	platforms.push(new Platform(x, y));
}

// Create the player
player = new Player(canvas.width / 2 - 10, canvas.height - PLATFORM_GAP);

// Game loop
function gameLoop() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Move and draw the platforms
	for (let i = 0; i < platforms.length; i++) {
		platforms[i].move();
		platforms[i].draw();
		
		// Remove platforms that have gone off the screen
		if (platforms[i].y > canvas.height) {
			platforms.splice(i, 1);
			score++;
			i--;
		}
	}
	
	// Add new platforms at the top
	if (platforms.length < MAX_PLATFORMS && platforms[0].y < canvas.height - PLATFORM_GAP) {
        let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
		let y = -PLATFORM_GAP;
		platforms.push(new Platform(x, y));
	}
	
	// Move and draw the player
	player.move();
	player.checkCollision();
	player.draw();
	
	// Draw the score
	ctx.font = 'bold 24px Arial';
	ctx.fillStyle = '#000';
	ctx.fillText('Score: ' + score, 10, 30);
	
	// Game over if player falls off the bottom
	if (player.y > canvas.height) {
		alert('Game over! Your score was ' + score);
		location.reload();
	}
	
	// Request next animation frame
	window.requestAnimationFrame(gameLoop);
}

// Start the game loop
window.requestAnimationFrame(gameLoop);

