// This file contains the main game logic for the "Pop the Lock" arcade game.
// It handles user interactions, game mechanics, and the overall flow of the game.

let isGameActive = false;
let score = 0;

const canvas = document.getElementById('lock-canvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Tune this value so the marker follows the center of the dark blue ring
const markerRadius = 110; // Try values between 100 and 120 for best fit

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
    ctx.arc(markerX, markerY, 8, 0, 2 * Math.PI); // Instead of 12
    ctx.fillStyle = '#3498db';
    ctx.fill();
}

// Animate the marker
function animateMarker() {
    if (!isGameActive) return;
    markerAngle += markerSpeed;
    if (markerAngle > 2 * Math.PI) markerAngle -= 2 * Math.PI;
    drawLock();
    requestAnimationFrame(animateMarker);
}

// Update target position when starting game
function startGame() {
    isGameActive = true;
    score = 0;
    // Pick a random target angle
    targetAngle = Math.random() * 2 * Math.PI;
    markerAngle = 0;
    updateGameUI();
    drawLock();
    animateMarker();
}

// Check if marker is close to target when spacebar is pressed
function checkLock() {
    if (!isGameActive) return;
    const diff = Math.abs(markerAngle - targetAngle);
    if (diff < 0.2 || Math.abs(diff - 2 * Math.PI) < 0.2) { // Allow some margin
        score++;
        targetAngle = Math.random() * 2 * Math.PI;
        updateGameUI();
    } else {
        resetGame();
    }
}

function resetGame() {
    isGameActive = false;
    alert(`Game Over! Your score: ${score}`);
}

function updateGameUI() {
    document.getElementById('score').textContent = `Score: ${score}`;
    // You can add more UI updates here if needed
}

// Wire up the Start Game button
document.getElementById('start-button').addEventListener('click', startGame);

// Listen for spacebar keydown to "pop" the lock
document.addEventListener('keydown', function(event) {
    if (isGameActive && event.code === 'Space') {
        checkLock();
    }
});


// Exporting functions for use in other modules
export { startGame, checkLock, resetGame };