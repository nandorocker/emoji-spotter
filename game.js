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
let emojisFound = 0;
let maxCombo = 0;
let isFirstGame = true;
let particles = null;

// DOM elements - with error handling
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const comboElement = document.getElementById('combo');
const timerFillElement = document.getElementById('timer-fill');
const timerTextElement = document.getElementById('timer-text');
const targetEmojiElement = document.getElementById('target-emoji');
const targetPulseElement = document.getElementById('target-pulse');
const emojiGridElement = document.getElementById('emoji-grid');
const categoryTabsElement = document.querySelector('.category-tabs');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const finalScoreDisplay = document.getElementById('final-score-display');
const emojisFoundElement = document.getElementById('emojis-found');
const maxComboElement = document.getElementById('max-combo');
const maxLevelElement = document.getElementById('max-level');
const restartButton = document.getElementById('restart-button');
const shareButton = document.getElementById('share-button');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownElement = document.getElementById('countdown');
const tutorialModal = document.getElementById('tutorial-modal');
const startGameButton = document.getElementById('start-game-button');

// Set initial display states
if (countdownOverlay) countdownOverlay.style.display = 'none';

// Initialize particles - with error handling
function initParticles() {
    try {
        if (window.particlesJS) {
            particles = window.particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: ["#5271ff", "#ff5757", "#ffbd59"]
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 4,
                            size_min: 0.3,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#5271ff",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        } else {
            console.log("particles.js not loaded, skipping particle effect");
        }
    } catch (error) {
        console.error("Error initializing particles:", error);
    }
}

// Display tutorial on first visit
function showTutorial() {
    if (isFirstGame && tutorialModal) {
        tutorialModal.style.display = 'flex';
    } else {
        startCountdown();
    }
}

// Start countdown before game begins
function startCountdown() {
    if (!countdownOverlay || !countdownElement) {
        console.error("Countdown elements not found, starting game directly");
        initGame();
        return;
    }
    
    countdownOverlay.style.display = 'flex';
    let count = 3;
    countdownElement.textContent = count;
    
    const countInterval = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(countInterval);
            countdownOverlay.style.display = 'none';
            initGame();
        } else {
            countdownElement.textContent = count;
        }
    }, 1000);
}

// Initialize the game
function initGame() {
    // Reset game variables
    score = 0;
    level = 1;
    combo = 0;
    timeLeft = 30;
    isGameOver = false;
    emojisFound = 0;
    maxCombo = 0;
    lastFoundTime = 0;
    
    // Reset UI with error handling
    if (scoreElement) scoreElement.textContent = score;
    if (levelElement) levelElement.textContent = level;
    if (comboElement) comboElement.textContent = combo;
    if (timerFillElement) timerFillElement.style.width = '100%';
    if (timerTextElement) timerTextElement.textContent = timeLeft;
    
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
    if (!categoryTabsElement) return;
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
            
            // Instead of regenerating the grid, just scroll to the selected category
            const categoryElement = document.getElementById(`category-${category}`);
            if (categoryElement) {
                categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
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
    let activeTab = null;
    
    tabs.forEach(tab => {
        if (tab.dataset.category === selectedCategory) {
            tab.classList.add('active');
            activeTab = tab;
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Scroll the selected tab into view
    if (activeTab && categoryTabsElement) {
        // Calculate if tab is out of view
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = categoryTabsElement.getBoundingClientRect();
        
        const isTabLeftOfView = tabRect.left < containerRect.left;
        const isTabRightOfView = tabRect.right > containerRect.right;
        
        if (isTabLeftOfView || isTabRightOfView) {
            // Smooth scroll to bring it into view
            const scrollOptions = { 
                behavior: 'smooth',
                inline: 'center' // Center the tab in the visible area
            };
            
            try {
                // Use scrollIntoView with options if supported
                activeTab.scrollIntoView(scrollOptions);
            } catch (error) {
                // Fallback for older browsers
                const scrollLeft = activeTab.offsetLeft - (categoryTabsElement.offsetWidth / 2) + (activeTab.offsetWidth / 2);
                categoryTabsElement.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// Generate emoji grid with all emojis in a continuous scrollable list
function generateEmojiGrid(activeCategory = null) {
    if (!emojiGridElement) return;
    emojiGridElement.innerHTML = '';
    
    // If activeCategory is null, show all categories
    // Otherwise, show all categories but scroll to the active one
    const allCategories = Object.keys(emojiList);
    
    // Generate all emojis in one continuous list
    allCategories.forEach((category, index) => {
        // Create an invisible marker for scroll detection (used for category tab selection)
        const categoryMarker = document.createElement('div');
        categoryMarker.id = `category-${category}`;
        categoryMarker.className = 'emoji-category-marker';
        emojiGridElement.appendChild(categoryMarker);
        
        // Create emojis for this category
        const emojis = emojiList[category];
        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-category-container';
        emojiContainer.dataset.category = category;
        
        emojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji';
            emojiElement.textContent = emoji;
            emojiElement.dataset.category = category;
            
            emojiElement.addEventListener('click', () => {
                handleEmojiClick(emoji, emojiElement);
            });
            
            emojiContainer.appendChild(emojiElement);
        });
        
        emojiGridElement.appendChild(emojiContainer);
    });
    
    // If an active category is specified, scroll to it
    if (activeCategory) {
        const categoryElement = document.getElementById(`category-${activeCategory}`);
        if (categoryElement) {
            // Scroll the emoji grid to the selected category with smooth animation
            setTimeout(() => {
                categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Update which category is visible in the viewport
    setupScrollListener();
}

// Handle emoji click
function handleEmojiClick(emoji, emojiElement) {
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
        if (combo > maxCombo) maxCombo = combo;
        if (comboElement) {
            comboElement.textContent = combo;
            comboElement.classList.add('pulse');
            setTimeout(() => comboElement.classList.remove('pulse'), 500);
        }
        
        // Update emojis found
        emojisFound++;
        
        // Apply combo bonuses
        if (combo >= 3) {
            if (foundQuickly) {
                // Additional bonus for quick successive finds
                pointsEarned *= 2;
                showMessage(`Quick combo! +${pointsEarned} pts!`, '#ff9500');
                playComboAnimation(emoji, emojiElement);
            } else {
                // Regular combo bonus
                pointsEarned = Math.floor(pointsEarned * 1.5);
                showMessage(`Combo x${combo}! +${pointsEarned} pts!`, '#4CAF50');
            }
        }
        
        // Update score
        score += pointsEarned;
        if (scoreElement) {
            scoreElement.textContent = score;
            scoreElement.classList.add('pulse');
            setTimeout(() => scoreElement.classList.remove('pulse'), 500);
        }
        
        // Show the emoji with a "correct" animation
        highlightEmoji(emoji, emojiElement);
        
        // Progress level if enough points
        checkLevelProgress();
        
        // Set new target emoji
        setNewTargetEmoji();
        
        // Add time bonus for successful find
        if (combo > 3) {
            timeLeft = Math.min(60, timeLeft + 1);
            updateTimer();
        }
        
        // Reset combo timeout
        if (comboTimeoutId) clearTimeout(comboTimeoutId);
        comboTimeoutId = setTimeout(() => {
            combo = 0;
            if (comboElement) comboElement.textContent = combo;
        }, 10000); // Reset combo after 10 seconds of inactivity
        
    } else {
        // Wrong emoji, penalize
        combo = 0;
        if (comboElement) comboElement.textContent = combo;
        if (comboTimeoutId) clearTimeout(comboTimeoutId);
        
        // Small time penalty (2 seconds)
        timeLeft = Math.max(1, timeLeft - 2);
        updateTimer();
        
        showMessage('Wrong emoji! -2 sec', '#ff3b30');
        
        // Shake animation - handle case where animate.css might not be loaded
        try {
            if (emojiElement.classList.contains('animate__animated')) {
                emojiElement.classList.remove('animate__animated', 'animate__shakeX');
            }
            
            emojiElement.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                emojiElement.classList.remove('animate__animated', 'animate__shakeX');
            }, 500);
        } catch (error) {
            console.error("Error applying shake animation:", error);
            // Simple fallback animation using CSS
            emojiElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                emojiElement.style.animation = '';
            }, 500);
        }
    }
}

// Simple shake animation fallback
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    </style>
`);

// Play combo animation
function playComboAnimation(emoji, emojiElement) {
    if (!emojiElement) return;
    
    try {
        // Create floating text animation
        const floatingText = document.createElement('div');
        floatingText.textContent = `+${combo}x COMBO!`;
        floatingText.style.position = 'fixed';
        floatingText.style.fontSize = '24px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.color = '#ffbd59';
        floatingText.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        
        // Position the text near the clicked emoji
        const rect = emojiElement.getBoundingClientRect();
        floatingText.style.left = `${rect.left + rect.width/2}px`;
        floatingText.style.top = `${rect.top}px`;
        floatingText.style.transform = 'translate(-50%, -100%)';
        
        // Add animation
        floatingText.style.transition = 'all 1s ease-out';
        document.body.appendChild(floatingText);
        
        // Trigger animation
        setTimeout(() => {
            floatingText.style.transform = 'translate(-50%, -200%)';
            floatingText.style.opacity = '0';
        }, 10);
        
        // Remove element after animation
        setTimeout(() => {
            if (document.body.contains(floatingText)) {
                document.body.removeChild(floatingText);
            }
        }, 1000);
    } catch (error) {
        console.error("Error in combo animation:", error);
    }
}

// Highlight the found emoji with animation
function highlightEmoji(emoji, emojiElement) {
    if (!emojiElement) return;
    
    try {
        // Apply animation directly to clicked element
        emojiElement.classList.add('correct-animation');
        setTimeout(() => {
            emojiElement.classList.remove('correct-animation');
        }, 600);
        
        // Create particles effect
        createEmojiParticles(emojiElement);
    } catch (error) {
        console.error("Error highlighting emoji:", error);
    }
}

// Create particles effect when finding correct emoji
function createEmojiParticles(element) {
    if (!element) return;
    
    try {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create particles - limit to fewer particles for better performance
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.position = 'fixed';
            particle.style.fontSize = '16px';
            particle.style.zIndex = '100';
            particle.style.pointerEvents = 'none';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.transform = 'translate(-50%, -50%)';
            
            // Random trajectory
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 70;
            const destX = centerX + Math.cos(angle) * distance;
            const destY = centerY + Math.sin(angle) * distance;
            
            document.body.appendChild(particle);
            
            // Animate
            particle.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
            
            setTimeout(() => {
                particle.style.left = `${destX}px`;
                particle.style.top = `${destY}px`;
                particle.style.opacity = '0';
            }, 10);
            
            // Remove after animation completes
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 1000);
        }
    } catch (error) {
        console.error("Error creating particles:", error);
    }
}

// Check if player should level up
function checkLevelProgress() {
    const levelThreshold = level * 100;
    if (score >= levelThreshold) {
        level++;
        if (levelElement) {
            levelElement.textContent = level;
            levelElement.classList.add('level-up');
            setTimeout(() => levelElement.classList.remove('level-up'), 1000);
        }
        
        // Extend time as a reward
        timeLeft = Math.min(60, timeLeft + 5);
        updateTimer();
        
        showMessage(`Level up! +5 sec`, '#ff9500');
        
        try {
            // Create a flash effect for level up
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.right = '0';
            flash.style.bottom = '0';
            flash.style.backgroundColor = 'rgba(255, 189, 89, 0.3)';
            flash.style.zIndex = '90';
            flash.style.pointerEvents = 'none';
            document.body.appendChild(flash);
            
            // Animate the flash
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                flash.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(flash)) {
                        document.body.removeChild(flash);
                    }
                }, 500);
            }, 300);
        } catch (error) {
            console.error("Error creating level-up flash:", error);
        }
    }
}

// Select a new random target emoji from all categories
function setNewTargetEmoji() {
    if (!targetEmojiElement) return;
    
    // Get a random category
    const categories = Object.keys(emojiList);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get a random emoji from that category
    const emojis = emojiList[randomCategory];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    targetEmoji = emojis[randomIndex];
    
    // Update the target display with animation
    targetEmojiElement.style.transform = 'scale(0)';
    
    setTimeout(() => {
        targetEmojiElement.textContent = targetEmoji;
        targetEmojiElement.style.transform = 'scale(1)';
    }, 300);
    
    // Hint the player which category contains the emoji (subtle hint for higher levels)
    const targetCategory = document.querySelector(`.category-tab[data-category="${randomCategory}"]`);
    
    // Remove previous hints
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.style.border = '2px solid transparent';
    });
    
    // Add subtle hint
    if (level < 3 && targetCategory) {
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
    if (!timerFillElement || !timerTextElement) return;
    
    const percentage = (timeLeft / 30) * 100;
    timerFillElement.style.width = `${percentage}%`;
    timerTextElement.textContent = timeLeft;
    
    // Change color based on time remaining
    if (timeLeft <= 5) {
        timerFillElement.style.background = 'linear-gradient(90deg, #ff3b30, #ff634d)';
        // Add pulse animation when time is running out
        timerFillElement.style.animation = 'pulse 0.5s infinite';
    } else if (timeLeft <= 10) {
        timerFillElement.style.background = 'linear-gradient(90deg, #ff9500, #ffbd59)';
        timerFillElement.style.animation = 'none';
    } else {
        timerFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        timerFillElement.style.animation = 'none';
    }
}

// Show a temporary message
function showMessage(message, color) {
    try {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.color = color || '#ffffff';
        messageElement.style.fontSize = '28px';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        messageElement.style.zIndex = '50';
        messageElement.style.pointerEvents = 'none';
        messageElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '20px';
        
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
                if (document.body.contains(messageElement)) {
                    document.body.removeChild(messageElement);
                }
            }, 500);
        }, 1200);
    } catch (error) {
        console.error("Error showing message:", error);
    }
}

// End the game
function endGame() {
    if (gameTimer) clearInterval(gameTimer);
    isGameOver = true;
    
    // Create funny assessment based on score
    let assessment = '';
    let emoji = '';
    if (score < 50) {
        assessment = 'Need more emoji practice!';
        emoji = '👀';
    } else if (score < 100) {
        assessment = 'Getting better! Maybe try glasses?';
        emoji = '👓';
    } else if (score < 200) {
        assessment = 'Emoji apprentice!';
        emoji = '🔍';
    } else if (score < 300) {
        assessment = 'Emoji hunter!';
        emoji = '🏆';
    } else if (score < 500) {
        assessment = 'Emoji master!';
        emoji = '👑';
    } else {
        assessment = 'Emoji GOD!';
        emoji = '🔱';
    }
    
    // Update game stats
    if (finalScoreDisplay) finalScoreDisplay.textContent = score;
    if (emojisFoundElement) emojisFoundElement.textContent = emojisFound;
    if (maxComboElement) maxComboElement.textContent = maxCombo;
    if (maxLevelElement) maxLevelElement.textContent = level;
    
    // Show game over modal
    if (modalTitle) modalTitle.textContent = 'Game Over!';
    if (modalMessage) modalMessage.innerHTML = `${assessment} ${emoji}`;
    if (modal) modal.style.display = 'flex';
    
    // No longer first game
    isFirstGame = false;
}

// Share score on social media
if (shareButton) {
    shareButton.addEventListener('click', () => {
        const text = `I scored ${score} points in Emoji Spotter! Can you beat my score? I found ${emojisFound} emojis with a max combo of ${maxCombo}! 🎮`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Emoji Spotter Score',
                text: text,
                url: window.location.href
            })
            .catch(error => {
                // Fallback to copy to clipboard
                copyToClipboard(text);
                showMessage('Score copied to clipboard!', '#4CAF50');
            });
        } else {
            // Fallback to copy to clipboard
            copyToClipboard(text);
            showMessage('Score copied to clipboard!', '#4CAF50');
        }
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    } catch (error) {
        console.error("Error copying to clipboard:", error);
    }
}

// Restart the game
if (restartButton) {
    restartButton.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        startCountdown();
    });
}

// Start game from tutorial
if (startGameButton) {
    startGameButton.addEventListener('click', () => {
        if (tutorialModal) tutorialModal.style.display = 'none';
        startCountdown();
    });
}

// Initialize game on load with error handling
window.addEventListener('load', () => {
    try {
        // Make sure overlay is hidden initially
        if (countdownOverlay) countdownOverlay.style.display = 'none';
        
        // Initialize particle effects
        initParticles();
        
        // Show tutorial or start game
        showTutorial();
    } catch (error) {
        console.error("Error initializing game:", error);
        // Fallback to direct game start if there's an error
        initGame();
    }
});

// Setup scroll listener to update active category tab based on scroll position
function setupScrollListener() {
    if (!emojiGridElement) return;
    
    // Remove any existing scroll listeners
    emojiGridElement.removeEventListener('scroll', handleEmojiGridScroll);
    
    // Add scroll listener
    emojiGridElement.addEventListener('scroll', handleEmojiGridScroll);
    
    // Initial check of which category is visible
    handleEmojiGridScroll();
}

// Handle emoji grid scroll to update the active category tab
function handleEmojiGridScroll() {
    if (!emojiGridElement) return;
    
    // Get all category markers
    const categoryMarkers = document.querySelectorAll('.emoji-category-marker');
    if (!categoryMarkers.length) return;
    
    // Get the visible area of the emoji grid
    const gridRect = emojiGridElement.getBoundingClientRect();
    const gridTop = gridRect.top;
    const gridCenter = gridTop + (gridRect.height / 3); // Use upper third as detection point
    
    // Find which category marker is closest to the top of the visible area
    let closestMarker = null;
    let closestDistance = Infinity;
    
    categoryMarkers.forEach(marker => {
        const markerRect = marker.getBoundingClientRect();
        const distance = Math.abs(markerRect.top - gridCenter);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestMarker = marker;
        }
    });
    
    // Update the selected category
    if (closestMarker) {
        const categoryId = closestMarker.id.replace('category-', '');
        if (categoryId !== selectedCategory) {
            selectedCategory = categoryId;
            updateCategoryTabs();
        }
    }
}