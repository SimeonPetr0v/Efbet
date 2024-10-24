// script.js
const symbols = ['🍀', '🌈', '💰', '🎩', '🍺', '🍄', '💎', '🍎']; // Add more symbols
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3'),
    document.getElementById('slot4'),
    document.getElementById('slot5')
];
const messageDisplay = document.getElementById('message');
const spinButton = document.getElementById('spin-btn');
const balanceAmount = document.getElementById('balance-amount');
let balance = 100;

spinButton.addEventListener('click', spinSlots);

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinSlots() {
    if (balance < 10) {
        messageDisplay.textContent = 'Not enough coins to spin!';
        return;
    }

    balance -= 10; // Deduct spin cost
    balanceAmount.textContent = balance;
    messageDisplay.textContent = 'Spinning...';
    spinButton.disabled = true;

    // Clear any previous highlights
    clearHighlights();

    // Simulate spinning animation
    let spinCount = 15;
    let spinInterval = setInterval(() => {
        slots.forEach(slot => {
            slot.textContent = getRandomSymbol();
        });
        spinCount--;
        if (spinCount === 0) {
            clearInterval(spinInterval);
            checkResult();
            spinButton.disabled = false;
        }
    }, 100);
}

function clearHighlights() {
    slots.forEach(slot => {
        slot.classList.remove('highlight');
    });
}

function checkResult() {
    const result = slots.map(slot => slot.textContent);
    let winnings = 0;

    // Check for 3, 4, or 5 matching symbols in a row
    for (let i = 0; i < result.length - 2; i++) {
        if (result[i] === result[i + 1] && result[i] === result[i + 2]) {
            winnings += 30; // Win 30 coins for 3 matches
            highlightSlots(i, i + 1, i + 2);
            if (result[i + 3] === result[i]) {
                winnings += 20; // Additional 20 coins for 4 matches
                highlightSlots(i + 3);
                if (result[i + 4] === result[i]) {
                    winnings += 50; // Additional 50 coins for 5 matches
                    highlightSlots(i + 4);
                }
            }
            break; // Only one winning combination per spin
        }
    }

    if (winnings > 0) {
        messageDisplay.textContent = `You win ${winnings} coins!`;
        balance += winnings;
    } else {
        messageDisplay.textContent = 'No match, try again!';
    }

    balanceAmount.textContent = balance;
}

function highlightSlots(...indices) {
    indices.forEach(i => {
        slots[i].classList.add('highlight');
    });
}
