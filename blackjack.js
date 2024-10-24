// script.js
const balanceDisplay = document.getElementById('balance');
const currentBetDisplay = document.getElementById('current-bet');
const dealerCardsArea = document.getElementById('dealer-cards');
const playerCardsArea = document.getElementById('player-cards');
const dealerScoreDisplay = document.getElementById('dealer-score-value');
const playerScoreDisplay = document.getElementById('player-score-value');
const messageDisplay = document.getElementById('message');

const hitButton = document.getElementById('hit-btn');
const standButton = document.getElementById('stand-btn');
const resetButton = document.getElementById('reset-btn');

let balance = 1000;
let currentBet = 0;
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// Card values
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

// Initialize a new game
function initGame() {
    playerHand = [];
    dealerHand = [];
    currentBet = 0;
    updateBalanceDisplay();
    resetMessage();
    dealerCardsArea.innerHTML = '';
    playerCardsArea.innerHTML = '';
    gameOver = false;

    // Allow player to place a bet
    placeBet();
}

// Function to place a bet
function placeBet() {
    let betAmount = prompt("Enter your bet amount:", "100");
    if (betAmount && !isNaN(betAmount) && betAmount > 0 && betAmount <= balance) {
        currentBet = parseInt(betAmount);
        balance -= currentBet;
        currentBetDisplay.textContent = currentBet;
        updateBalanceDisplay();
        startGame();
    } else {
        alert("Invalid bet amount.");
        placeBet();
    }
}

// Start the game
function startGame() {
    // Deal two cards to player and dealer
    playerHand.push(drawCard(), drawCard());
    dealerHand.push(drawCard(), drawCard());
    updateScores();
    renderHands();

    // Check for Blackjack
    if (getScore(playerHand) === 21) {
        messageDisplay.textContent = "Blackjack! You win!";
        gameOver = true;
        balance += currentBet * 2.5; // 1.5x for blackjack
        updateBalanceDisplay();
    } else if (getScore(dealerHand) === 21) {
        messageDisplay.textContent = "Dealer has blackjack! You lose!";
        gameOver = true;
        updateBalanceDisplay();
    }
}

// Draw a card randomly from the deck
function drawCard() {
    const cards = Object.keys(cardValues);
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    return randomCard;
}

// Calculate the score of a hand
function getScore(hand) {
    let score = hand.reduce((sum, card) => sum + cardValues[card], 0);
    let aceCount = hand.filter(card => card === 'A').length;

    // Adjust for Aces
    while (score > 21 && aceCount > 0) {
        score -= 10; // Convert Ace from 11 to 1
        aceCount--;
    }
    return score;
}

// Update scores and display
function updateScores() {
    playerScoreDisplay.textContent = getScore(playerHand);
    dealerScoreDisplay.textContent = getScore(dealerHand);
}

// Render hands on screen with animation
function renderHands() {
    // Render dealer's cards
    dealerCardsArea.innerHTML = '';
    dealerHand.forEach((card, index) => {
        const cardElement = createCardElement(card);
        dealerCardsArea.appendChild(cardElement);
        // Animate the card dealing
        setTimeout(() => {
            cardElement.classList.add('show');
        }, 300 + index * 300); // Delay each card for the animation
    });

    // Render player's cards
    playerCardsArea.innerHTML = '';
    playerHand.forEach((card, index) => {
        const cardElement = createCardElement(card);
        playerCardsArea.appendChild(cardElement);
        // Animate the card dealing
        setTimeout(() => {
            cardElement.classList.add('show');
        }, 300 + index * 300); // Delay each card for the animation
    });
}

// Create card element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = card;
    return cardElement;
}

// Hit button action
hitButton.addEventListener('click', () => {
    if (!gameOver) {
        playerHand.push(drawCard());
        updateScores();
        renderHands();

        if (getScore(playerHand) > 21) {
            messageDisplay.textContent = "Bust! You lose.";
            gameOver = true;
            updateBalanceDisplay();
        }
    }
});

// Stand button action
standButton.addEventListener('click', () => {
    if (!gameOver) {
        while (getScore(dealerHand) < 17) {
            dealerHand.push(drawCard());
            updateScores();
            renderHands();
        }
        
        // Determine winner
        const playerScore = getScore(playerHand);
        const dealerScore = getScore(dealerHand);

        if (dealerScore > 21 || playerScore > dealerScore) {
            messageDisplay.textContent = "You win!";
            balance += currentBet * 2; // Win amount
        } else if (playerScore < dealerScore) {
            messageDisplay.textContent = "Dealer wins! You lose.";
        } else {
            messageDisplay.textContent = "It's a tie!";
            balance += currentBet; // Return bet
        }
        gameOver = true;
        updateBalanceDisplay();
    }
});

// Reset game button action
resetButton.addEventListener('click', initGame);

// Update balance display
function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
}

// Reset message display
function resetMessage() {
    messageDisplay.textContent = '';
}

// Start the game on page load
window.onload = initGame;
