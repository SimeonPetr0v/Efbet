// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const balanceDisplay = document.getElementById('balance');
const multiplierDisplay = document.getElementById('multiplier');
const cashoutBtn = document.getElementById('cashout-btn');
const resetBtn = document.getElementById('reset-btn');
const resultMessage = document.getElementById('result-message');
const betInput = document.getElementById('bet-amount');
const countdownDisplay = document.getElementById('countdown');

let balance = 100;
let betAmount = parseInt(betInput.value);
let multiplier = 1.01;  // Start at a minimum of 1.01x
let crashPoint;
let gameRunning = false;
let planeX = 0;
let planeY = canvas.height - 20;
let planeSpeed = 0.5;  // Slower plane speed
let planeAcceleration = 0.02;  // Even slower multiplier growth
let crashOccurred = false;
let cashedOut = false;
let countdown = 5;
let countdownInterval;

// Function to generate a random crash point (at any point after 1.01x, but typically up to 20x)
function getRandomCrashPoint() {
    return (Math.random() * 19 + 1.01).toFixed(2);  // Generates a crash point between 1.01 and 20x
}

// Function to start the countdown before game starts
function startCountdown() {
    countdown = 5;
    resultMessage.textContent = 'Place your bet before the game starts!';
    countdownDisplay.textContent = countdown;

    countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

// Function to start the game
function startGame() {
    multiplier = 1.01;  // Reset to start at 1.01x
    crashPoint = getRandomCrashPoint();
    gameRunning = true;
    cashedOut = false;
    cashoutBtn.disabled = false;
    resultMessage.textContent = 'Press Cash Out to secure your winnings!';

    // Disable bet input during the game
    betInput.disabled = true;
    resetBtn.disabled = true;

    // Reset positions and variables
    planeX = 0;
    planeY = canvas.height - 20;
    crashOccurred = false;

    requestAnimationFrame(drawGame);
}

// Function to draw the graph and plane's flight path
function drawGame() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

        drawGraph();  // Draw the graph
        movePlane();  // Move the plane

        // Format multiplier to two decimals and replace dot with comma
        multiplierDisplay.textContent = `${multiplier.toFixed(2).replace('.', ',')}x`;

        if (multiplier >= crashPoint) {  // Check if the plane has crashed
            crash();
        }

        if (!crashOccurred && !cashedOut) {
            requestAnimationFrame(drawGame);  // Continue drawing if game hasn't ended
        }
    }
}

// Function to draw the graph (simple quadratic curve)
function drawGraph() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);

    for (let x = 0; x <= canvas.width; x++) {
        let y = canvas.height - (Math.pow(x * 0.01, 2) + 20);
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#1abc9c';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to move the plane along the graph
function movePlane() {
    let newY = canvas.height - (Math.pow(planeX * 0.01, 2) + 20);  // Calculate new position

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('✈️', planeX, planeY);  // Draw the plane at current position

    planeX += planeSpeed;  // Update the plane's position (move slower)
    planeY = newY;
    multiplier += planeAcceleration;  // Increment the multiplier slower
}

// Function to handle crashing
function crash() {
    crashOccurred = true;
    gameRunning = false;
    cashoutBtn.disabled = true;
    resultMessage.textContent = `Crash! The plane crashed at ${multiplier.toFixed(2).replace('.', ',')}x. You lost!`;
    resetBtn.disabled = false;  // Enable reset button
}

// Function to handle cashing out
cashoutBtn.addEventListener('click', () => {
    if (gameRunning) {
        cashedOut = true;
        cashoutBtn.disabled = true;
        
        // Calculate winnings, round to two decimals, and format with comma
        let winnings = (betAmount * multiplier).toFixed(2).replace('.', ',');
        balance += parseFloat(winnings.replace(',', '.'));  // Update balance as a number

        balanceDisplay.textContent = balance.toFixed(2).replace('.', ',');  // Display rounded balance
        resultMessage.textContent = `You cashed out at ${multiplier.toFixed(2).replace('.', ',')}x and won ${winnings} coins!`;
        
        gameRunning = false;
        resetBtn.disabled = false;
    }
});

// Function to reset the game
resetBtn.addEventListener('click', () => {
    resetGame();
});

// Function to reset the game after crash or cash out
function resetGame() {
    // Reset variables and states
    cashoutBtn.disabled = true;
    resetBtn.disabled = true;
    betInput.disabled = false;
    betAmount = parseInt(betInput.value);
    resultMessage.textContent = 'Place your bet before the game starts!';
    countdownDisplay.textContent = '5';
    
    startCountdown();
}

// Start the countdown when the page loads
window.onload = function() {
    resetGame();
};
