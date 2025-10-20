// This file contains the main game logic for the "Pop the Lock" arcade game.
// It handles user interactions, game mechanics, and the overall flow of the game.

let gameState = "idle"; // "idle", "active", "over", "victory"
let score = 50; // Start at 50

const canvas = document.getElementById('lock-canvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Tune this value so the marker follows the center of the dark blue ring
const markerRadius = 85; // Adjust this value to fit the dark blue ring

let markerAngle = 0;
let markerSpeed = 0.05; // Radians per frame
let targetAngle = 0;

const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';

function drawLock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if loaded
    if (backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    // Draw target
    const targetX = centerX + markerRadius * Math.cos(targetAngle);
    const targetY = centerY + markerRadius * Math.sin(targetAngle);
    ctx.beginPath();
    ctx.arc(targetX, targetY, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();

    // Draw moving marker
    const markerX = centerX + markerRadius * Math.cos(markerAngle);
    const markerY = centerY + markerRadius * Math.sin(markerAngle);
    ctx.beginPath();
    ctx.arc(markerX, markerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();

    // Draw score centered in the dark green circle
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, centerX, centerY);

    // Draw GAME OVER text if the game ended due to a loss
    if (gameState === "over") {
        drawCircularText("GAME OVER", centerX, centerY, 100, -Math.PI / 2);
    }

    // Draw VICTORY text if score reaches 0
    if (gameState === "victory") {
        drawCircularText("VICTORY!", centerX, centerY, 100, -Math.PI / 2);
    }
}

// Helper to draw circular text
function drawCircularText(text, x, y, radius, startAngle) {
    ctx.save();
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let angle = startAngle;
    const angleStep = (2 * Math.PI) / text.length;
    for (let i = 0; i < text.length; i++) {
        ctx.save();
        ctx.translate(
            x + radius * Math.cos(angle),
            y + radius * Math.sin(angle)
        );
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
        angle += angleStep;
    }
    ctx.restore();
}

// Animate the marker
function animateMarker() {
    if (gameState !== "active") return;
    markerAngle += markerSpeed;
    if (markerAngle > 2 * Math.PI) markerAngle -= 2 * Math.PI;
    drawLock();
    requestAnimationFrame(animateMarker);
}

// Update target position when starting game
function startGame() {
    gameState = "active";
    score = 50;
    targetAngle = Math.random() * 2 * Math.PI;
    markerAngle = 0;
    drawLock();
    animateMarker();
}

// Check if marker is close to target when spacebar is pressed
function checkLock() {
    if (gameState !== "active") return;
    const diff = Math.abs(markerAngle - targetAngle);
    if (diff < 0.2 || Math.abs(diff - 2 * Math.PI) < 0.2) { // Allow some margin
        score--;
        if (score === 0) {
            gameState = "victory";
            drawLock();
            return;
        }
        targetAngle = Math.random() * 2 * Math.PI;
    } else {
        resetGame();
    }
}

function resetGame() {
    gameState = "over"; // Mark the game as over
    drawLock();
}

// Wire up the Start Game button
document.getElementById('start-button').addEventListener('click', startGame);

// Listen for spacebar keydown to start or "pop" the lock
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (gameState === "idle") {
            startGame();
        } else if (gameState === "active") {
            checkLock();
        }
    }
});

// Listen for touch events to start or "pop" the lock on mobile devices
canvas.addEventListener('touchstart', function(event) {
    if (gameState === "idle") {
        startGame();
    } else if (gameState === "active") {
        checkLock();
    }
    event.preventDefault();
}, { passive: false });

// Exporting functions for use in other modules
export { startGame, checkLock, resetGame };