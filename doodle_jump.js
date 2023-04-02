const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const PLATFORM_COUNT = 10;
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 20;
const PLATFORM_PADDING = 10;
const PLATFORM_SPEED = 1;
const PLATFORM_GAP = 100;
const JUMP_VELOCITY = 20;
const GRAVITY = 1;

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = 0;
        this.dy = 0;
    }

    jump() {
        this.dy = -JUMP_VELOCITY;
    }

    moveLeft() {
        this.dx = -PLATFORM_SPEED;
    }

    moveRight() {
        this.dx = PLATFORM_SPEED;
    }

    stopMoving() {
        this.dx = 0;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += GRAVITY;
    }

    draw() {
        context.fillStyle = '#f00';
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        context.fill();
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update() {
        this.x += PLATFORM_SPEED;
    }

    draw() {
        context.fillStyle = '#0f0';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

let player = new Player(canvas.width / 2 - 25, canvas.height - 75, 50, 50);
let platforms = [];

function init() {
    for (let i = 0; i < PLATFORM_COUNT; i++) {
        let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
        let y = (canvas.height - PLATFORM_GAP) - i * (PLATFORM_HEIGHT + PLATFORM_PADDING);
        let platform = new Platform(x, y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platforms.push(platform);
    }
}

function update() {
    player.update();

    if (player.y < canvas.height / 2) {
        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            platform.y += player.dy;

            if (platform.y > canvas.height) {
                let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
                let y = platform.y - PLATFORM_HEIGHT - PLATFORM_PADDING;
                platform.x = x;
                platform.y = y;
            }
        }
    }

    if (player.y > canvas.height) {
        console.log('Game Over!');
        player = new Player(canvas.width / 2 - 25, canvas.height - 75, 50, 50);
        platforms = [];
       
        init();
    }

    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];

        if (player.y < canvas.height / 2) {
            platform.y -= player.dy;
            if (platform.y < 0) {
                platforms.splice(i, 1);
                i--;
                let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
                let y = platform.y + canvas.height + PLATFORM_GAP;
                let newPlatform = new Platform(x, y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
                platforms.push(newPlatform);
            }
        }

        if (platform.x < -PLATFORM_WIDTH) {
            platform.x = canvas.width;
        }
    }

    if (player.y > canvas.height) {
        console.log('Game Over!');
        player = new Player(canvas.width / 2 - 25, canvas.height - 75, 50, 50);
        platforms = [];
        init();
    }

    if (player.x < 0) {
        player.x = canvas.width - player.width;
    }

    if (player.x > canvas.width - player.width) {
        player.x = 0;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        platform.draw();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        player.moveLeft();
    } else if (event.key === 'ArrowRight') {
        player.moveRight();
    } else if (event.key === 'ArrowUp') {
        player.jump();
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        player.stopMoving();
    }
});

init();
loop();


