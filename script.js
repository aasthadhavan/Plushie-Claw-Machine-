let gameState = {
    score: 0,
    attempts: 10,
    clawPosition: 225,
    isDropping: false,
    collectedPlushies: []
};

const plushieEmojis = ['🧸', '🐻', '🐼', '🐨', '🦊', '🐱', '🐰', '🐸', '🐷', '🐮', '🦁', '🐯', '🐵', '🐺', '🦝'];

function updateDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('attempts').textContent = gameState.attempts;
    
    const prizeDisplay = document.getElementById('prizeDisplay');
    if (gameState.collectedPlushies.length > 0) {
        prizeDisplay.innerHTML = gameState.collectedPlushies.join(' ');
    } else {
        prizeDisplay.innerHTML = 'Collected plushies will appear here!';
    }
}

function createPlushie() {
    const plushie = document.createElement('div');
    plushie.className = 'plushie';
    plushie.textContent = plushieEmojis[Math.floor(Math.random() * plushieEmojis.length)];
    plushie.style.left = Math.random() * 420 + 20 + 'px';
    plushie.style.top = Math.random() * 250 + 100 + 'px';
    plushie.onclick = () => clickPlushie(plushie);
    return plushie;
}

function addPlushies() {
    const plushiesContainer = document.getElementById('plushies');
    const numToAdd = Math.floor(Math.random() * 3) + 2; // Add 2-4 plushies
    
    for (let i = 0; i < numToAdd; i++) {
        plushiesContainer.appendChild(createPlushie());
    }
    
    showMessage(`Added ${numToAdd} new plushies!`);
}

function moveClaw(direction) {
    if (gameState.isDropping) return;
    
    const claw = document.getElementById('claw');
    
    if (direction === 'left' && gameState.clawPosition > 25) {
        gameState.clawPosition -= 50;
    } else if (direction === 'right' && gameState.clawPosition < 425) {
        gameState.clawPosition += 50;
    }
    
    claw.style.left = gameState.clawPosition + 'px';
}

function dropClaw() {
    if (gameState.isDropping || gameState.attempts <= 0) return;
    
    gameState.isDropping = true;
    gameState.attempts--;
    
    const claw = document.getElementById('claw');
    claw.classList.add('dropping');
    
    // Disable controls during drop
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    
    // Check for plushie collision after delay
    setTimeout(() => {
        checkPlushieCollision();
    }, 1000);
    
    setTimeout(() => {
        claw.classList.remove('dropping');
        gameState.isDropping = false;
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
        
        if (gameState.attempts <= 0) {
            endGame();
        }
        
        updateDisplay();
    }, 2000);
    
    updateDisplay();
}

function checkPlushieCollision() {
    const plushies = document.querySelectorAll('.plushie');
    const clawRect = {
        left: gameState.clawPosition,
        right: gameState.clawPosition + 50,
        top: 300, // Bottom position of claw
        bottom: 350
    };
    
    plushies.forEach(plushie => {
        const rect = plushie.getBoundingClientRect();
        const containerRect = document.getElementById('gameContainer').getBoundingClientRect();
        
        const plushieRect = {
            left: plushie.offsetLeft,
            right: plushie.offsetLeft + 60,
            top: plushie.offsetTop,
            bottom: plushie.offsetTop + 60
        };
        
        // Check collision
        if (clawRect.left < plushieRect.right &&
            clawRect.right > plushieRect.left &&
            clawRect.top < plushieRect.bottom &&
            clawRect.bottom > plushieRect.top) {
            
            catchPlushie(plushie);
        }
    });
}

function catchPlushie(plushie) {
    const plushieEmoji = plushie.textContent;
    gameState.collectedPlushies.push(plushieEmoji);
    gameState.score += 10;
    
    plushie.classList.add('caught');
    showMessage(`Caught a ${plushieEmoji}! +10 points!`);
    
    setTimeout(() => {
        plushie.remove();
    }, 1000);
}

function clickPlushie(plushie) {
    if (!gameState.isDropping) {
        showMessage('Use the claw to catch plushies!');
        plushie.style.transform = 'scale(1.2)';
        setTimeout(() => {
            plushie.style.transform = 'scale(1)';
        }, 200);
    }
}

function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.style.color = 'rgba(194, 126, 186, 1)';
    
    setTimeout(() => {
        messageEl.textContent = 'Use the buttons to move the claw and try to catch plushies!';
        messageEl.style.color = 'rgba(194, 126, 186, 0.868)';
    }, 3000);
}

function resetGame() {
    gameState = {
        score: 0,
        attempts: 10,
        clawPosition: 225,
        isDropping: false,
        collectedPlushies: []
    };
    
    // Reset claw position
    const claw = document.getElementById('claw');
    claw.style.left = '225px';
    
    // Clear existing plushies
    document.getElementById('plushies').innerHTML = '';
    
    // Add initial plushies
    addPlushies();
    
    updateDisplay();
    showMessage('Game reset! Good luck catching plushies!');
}

function endGame() {
    if (gameState.collectedPlushies.length > 0) {
        showMessage(`Game Over! You collected ${gameState.collectedPlushies.length} plushies with ${gameState.score} points!`);
    } else {
        showMessage('Game Over! Try again to catch some plushies!');
    }
}

// Initialize game
window.onload = function() {
    addPlushies();
    updateDisplay();
};

// Keyboard controls
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        moveClaw('left');
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        moveClaw('right');
    } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        dropClaw();
    }
});