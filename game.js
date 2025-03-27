// Game variables
let score = 0;
let level = 1;
let combo = 0;
let gameTimer = null;
let timeLeft = 30;
let targetEmoji = null;
let selectedCategory = 'smileys';
let isGameOver = false;
let comboTimeoutId = null;
let lastFoundTime = 0;

// DOM elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const comboElement = document.getElementById('combo');
const timerFillElement = document.getElementById('timer-fill');
const timerTextElement = document.getElementById('timer-text');
const targetEmojiElement = document.getElementById('target-emoji');
const emojiGridElement = document.getElementById('emoji-grid');
const categoryTabsElement = document.querySelector('.category-tabs');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const restartButton = document.getElementById('restart-button');

// Initialize the game
function initGame() {
    // Reset game variables
    score = 0;
    level = 1;
    combo = 0;
    timeLeft = 30;
    isGameOver = false;
    
    // Reset UI
    scoreElement.textContent = score;
    levelElement.textContent = level;
    comboElement.textContent = combo;
    timerFillElement.style.width = '100%';
    timerTextElement.textContent = timeLeft;
    
    // Create category tabs
    createCategoryTabs();
    
    // Set initial category
    selectedCategory = 'smileys';
    updateCategoryTabs();
    
    // Generate emojis grid
    generateEmojiGrid(selectedCategory);
    
    // Set new target emoji
    setNewTargetEmoji();
    
    // Start the timer
    startTimer();
}

// Create tabs for emoji categories
function createCategoryTabs() {
    categoryTabsElement.innerHTML = '';
    
    // Create a tab for each emoji category
    Object.keys(emojiList).forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.textContent = formatCategoryName(category);
        tab.dataset.category = category;
        
        tab.addEventListener('click', () => {
            selectedCategory = category;
            updateCategoryTabs();
            generateEmojiGrid(category);
        });
        
        categoryTabsElement.appendChild(tab);
    });
}

// Format category name for display
function formatCategoryName(category) {
    return category
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/And/g, '&'); // Replace 'And' with '&'
}

// Update active category tab
function updateCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        if (tab.dataset.category === selectedCategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Generate emoji grid for the selected category
function generateEmojiGrid(category) {
    emojiGridElement.innerHTML = '';
    
    // Get emojis for the selected category
    const emojis = emojiList[category];
    
    // Create emoji elements
    emojis.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.className = 'emoji';
        emojiElement.textContent = emoji;
        
        emojiElement.addEventListener('click', () => {
            handleEmojiClick(emoji);
        });
        
        emojiGridElement.appendChild(emojiElement);
    });
}

// Handle emoji click
function handleEmojiClick(emoji) {
    if (isGameOver) return;
    
    if (emoji === targetEmoji) {
        // Found the correct emoji!
        const now = Date.now();
        const foundQuickly = lastFoundTime > 0 && (now - lastFoundTime) < 10000; // Within 10 seconds
        lastFoundTime = now;
        
        // Update score based on level
        const basePoints = 10 * level;
        let pointsEarned = basePoints;
        
        // Update combo
        combo++;
        comboElement.textContent = combo;
        
        // Apply combo bonuses
        if (combo >= 3) {
            if (foundQuickly) {
                // Additional bonus for quick successive finds
                pointsEarned *= 2;
                showMessage(`Quick combo! +${pointsEarned} pts!`, '#ff9500');
            } else {
                // Regular combo bonus
                pointsEarned = Math.floor(pointsEarned * 1.5);
                showMessage(`Combo x${combo}! +${pointsEarned} pts!`, '#4CAF50');
            }
        }
        
        // Update score
        score += pointsEarned;
        scoreElement.textContent = score;
        
        // Show the emoji with a "correct" animation
        highlightEmoji(emoji);
        
        // Progress level if enough points
        checkLevelProgress();
        
        // Set new target emoji
        setNewTargetEmoji();
        
        // Reset combo timeout
        if (comboTimeoutId) clearTimeout(comboTimeoutId);
        comboTimeoutId = setTimeout(() => {
            combo = 0;
            comboElement.textContent = combo;
        }, 10000); // Reset combo after 10 seconds of inactivity
        
    } else {
        // Wrong emoji, penalize
        combo = 0;
        comboElement.textContent = combo;
        if (comboTimeoutId) clearTimeout(comboTimeoutId);
        
        // Small time penalty (2 seconds)
        timeLeft = Math.max(1, timeLeft - 2);
        updateTimer();
        
        showMessage('Wrong emoji! -2 sec', '#ff3b30');
    }
}

// Highlight the found emoji with animation
function highlightEmoji(emoji) {
    const emojiElements = document.querySelectorAll('.emoji');
    emojiElements.forEach(element => {
        if (element.textContent === emoji) {
            element.classList.add('correct-animation');
            setTimeout(() => {
                element.classList.remove('correct-animation');
            }, 500);
        }
    });
}

// Check if player should level up
function checkLevelProgress() {
    const levelThreshold = level * 100;
    if (score >= levelThreshold) {
        level++;
        levelElement.textContent = level;
        levelElement.classList.add('level-up');
        
        // Extend time as a reward
        timeLeft = Math.min(60, timeLeft + 5);
        updateTimer();
        
        showMessage(`Level up! +5 sec`, '#ff9500');
        
        setTimeout(() => {
            levelElement.classList.remove('level-up');
        }, 800);
    }
}

// Select a new random target emoji from all categories
function setNewTargetEmoji() {
    // Get a random category
    const categories = Object.keys(emojiList);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get a random emoji from that category
    const emojis = emojiList[randomCategory];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    targetEmoji = emojis[randomIndex];
    
    // Update the target display
    targetEmojiElement.textContent = targetEmoji;
    
    // Hint the player which category contains the emoji (subtle hint for higher levels)
    const targetCategory = document.querySelector(`.category-tab[data-category="${randomCategory}"]`);
    
    // Remove previous hints
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.style.border = '2px solid transparent';
    });
    
    // Add subtle hint
    if (level < 3) {
        targetCategory.style.border = '2px solid #ff9500';
    }
}

// Start the game timer
function startTimer() {
    if (gameTimer) clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    const percentage = (timeLeft / 30) * 100;
    timerFillElement.style.width = `${percentage}%`;
    timerTextElement.textContent = timeLeft;
    
    // Change color based on time remaining
    if (timeLeft <= 5) {
        timerFillElement.style.backgroundColor = '#ff3b30';
    } else if (timeLeft <= 10) {
        timerFillElement.style.backgroundColor = '#ff9500';
    } else {
        timerFillElement.style.backgroundColor = '#4CAF50';
    }
}

// Show a temporary message
function showMessage(message, color) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.color = color;
    messageElement.style.fontSize = '24px';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
    messageElement.style.zIndex = '50';
    
    document.body.appendChild(messageElement);
    
    // Animate
    messageElement.style.opacity = '0';
    messageElement.style.transition = 'opacity 0.3s, transform 0.5s';
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translate(-50%, -100%)';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 1000);
}

// End the game
function endGame() {
    clearInterval(gameTimer);
    isGameOver = true;
    
    // Create funny assessment based on score
    let assessment = '';
    if (score < 50) {
        assessment = 'Need more emoji practice! 👀';
    } else if (score < 100) {
        assessment = 'Getting better! Maybe try glasses? 👓';
    } else if (score < 200) {
        assessment = 'Emoji apprentice! 🔍';
    } else if (score < 300) {
        assessment = 'Emoji hunter! 🏆';
    } else if (score < 500) {
        assessment = 'Emoji master! 👑';
    } else {
        assessment = 'Emoji GOD! 🔱';
    }
    
    // Show game over modal
    modalTitle.textContent = 'Game Over!';
    modalMessage.innerHTML = `Your final score: <strong>${score}</strong><br>${assessment}`;
    modal.style.display = 'flex';
}

// Restart the game
restartButton.addEventListener('click', () => {
    modal.style.display = 'none';
    initGame();
});

// Initialize game on load
window.addEventListener('load', initGame);