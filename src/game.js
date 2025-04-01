// Import the emoji list from the module
import emojiList from './appleEmojis.js';
import { levelConfig } from './config/levelConfig.js';

// Game variables
let score = 0;
let level = 1;
let gameTimer = null;
let timeLeft = 30;
let targetEmoji = null;
let selectedCategory = 'smileys';
let isGameOver = false;
let lastFoundTime = 0;
let emojisFound = 0;
let isFirstGame = true;
let particles = null;
let debugMode = false; // Add debug mode flag
let currentLevelConfig = null;
let matchesRequired = 0;
let matchesCompleted = 0;
let availableCategories = [];
let isPaused = false; // Track if game is paused

// Scoring system variables
let targetRevealTime = 0;     // When the current target emoji was revealed
let incorrectAttempts = 0;    // Number of incorrect attempts for current target emoji
let categoryBonusMultipliers = {
    smileys: 1,
    people: 1.1,
    animalsAndNature: 1.2,
    foodAndDrink: 1.3,
    activity: 1.4,
    travelAndPlaces: 1.5,
    objects: 1.6,
    symbols: 1.7,
    flags: 2
};

// Initialize drag scrolling variables
let isDragging = false;
let startY = 0;
let scrollTop = 0;
let moveDetected = false;
let scrollVelocity = 0;
let lastY = 0;
let lastTime = 0;
let animationFrameId = null;

// DOM elements - with error handling
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
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
const preloader = document.getElementById('preloader');

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
    isGameOver = false;
    emojisFound = 0;
    lastFoundTime = 0;
    matchesCompleted = 0;
    
    // Initialize level configuration
    loadLevelConfig(level);
    
    // Reset UI with error handling
    if (scoreElement) scoreElement.textContent = score;
    if (levelElement) levelElement.textContent = level;
    if (timerFillElement) {
        timerFillElement.style.width = '100%';
        timerFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        timerFillElement.style.animation = 'none';
    }
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
    
    // Setup drag scrolling
    setupDragScrolling();
}

// Create tabs for emoji categories
function createCategoryTabs() {
    if (!categoryTabsElement) return;
    categoryTabsElement.innerHTML = '';
    
    // Create a tab for each emoji category
    Object.keys(emojiList).forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        
        // Check if category is available in current level
        const isAvailable = availableCategories.includes(category);
        
        // Apply locked styling if category is not available yet
        if (!isAvailable) {
            tab.classList.add('locked');
            
            // Use Lucide icon for locked categories
            const helpIcon = document.createElement('i');
            helpIcon.dataset.lucide = 'help-circle';
            tab.appendChild(helpIcon);
            
            tab.title = "Unlock this category by progressing through levels";
        } else {
            tab.textContent = formatCategoryName(category);
        }
        
        tab.dataset.category = category;
        
        // Only allow clicking available categories
        if (isAvailable) {
            tab.addEventListener('click', () => {
                selectedCategory = category;
                updateCategoryTabs();
                
                // Scroll to the selected category
                const categoryElement = document.getElementById(`category-${category}`);
                if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
        
        categoryTabsElement.appendChild(tab);
    });
    
    // Initialize Lucide icons after adding to DOM if available
    if (window.lucide) {
        try {
            lucide.createIcons();
        } catch (error) {
            console.warn("Error initializing Lucide icons:", error);
        }
    }
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
    
    // Only show categories available in the current level
    const categoriesToShow = availableCategories || ['smileys'];
    
    // Generate only the available emoji categories
    categoriesToShow.forEach((category, index) => {
        // Create an invisible marker for scroll detection
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
            emojiElement.dataset.emoji = emoji;
            
            // Use mouseup instead of click to better control when emojis are selected
            emojiElement.addEventListener('mousedown', (e) => {
                // Mark this element as potentially receiving a click
                emojiElement.dataset.clickStart = 'true';
            });
            
            emojiElement.addEventListener('mouseup', (e) => {
                // Only handle as a click if we've marked it as clickStart and not moved
                if (emojiElement.dataset.clickStart === 'true' && !moveDetected) {
                    handleEmojiClick(emoji, emojiElement);
                }
                delete emojiElement.dataset.clickStart;
            });
            
            // For touch devices
            emojiElement.addEventListener('touchstart', (e) => {
                emojiElement.dataset.clickStart = 'true';
            });
            
            emojiElement.addEventListener('touchend', (e) => {
                if (emojiElement.dataset.clickStart === 'true' && !moveDetected) {
                    handleEmojiClick(emoji, emojiElement);
                }
                delete emojiElement.dataset.clickStart;
            });
            
            emojiContainer.appendChild(emojiElement);
        });
        
        emojiGridElement.appendChild(emojiContainer);
    });
    
    // If an active category is specified, scroll to it
    if (activeCategory && categoriesToShow.includes(activeCategory)) {
        const categoryElement = document.getElementById(`category-${activeCategory}`);
        if (categoryElement) {
            // Scroll the emoji grid to the selected category
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
        lastFoundTime = now;
        
        // Get emoji category
        const category = emojiElement.dataset.category;
        
        // Calculate score with bonuses
        const pointsEarned = calculateScore(category);
        
        // Update counters
        score += pointsEarned;
        emojisFound++;
        matchesCompleted++;
        
        // Update UI
        if (scoreElement) {
            scoreElement.textContent = score;
            scoreElement.classList.add('pulse');
            setTimeout(() => scoreElement.classList.remove('pulse'), 500);
        }
        
        // Show message with score breakdown
        if (debugMode) {
            const timeTaken = ((now - targetRevealTime) / 1000).toFixed(1);
            showMessage(`+${pointsEarned} pts! (${timeTaken}s, ${incorrectAttempts} errors)`, '#4CAF50');
        } else {
            showMessage(`+${pointsEarned} pts!`, '#4CAF50');
        }
        
        // Show the emoji with a "correct" animation
        highlightEmoji(emoji, emojiElement);
        
        // Check if level is complete
        if (matchesCompleted >= matchesRequired) {
            advanceToNextLevel();
        } else {
            // Set new target emoji if level not complete
            setNewTargetEmoji();
        }
    } else {
        // Wrong emoji, track this attempt
        incorrectAttempts++;
        
        // Apply time penalty (2 seconds)
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
        
        // Update level in both header and game display
        if (levelElement) {
            levelElement.textContent = level;
            levelElement.classList.add('level-up');
            setTimeout(() => levelElement.classList.remove('level-up'), 1000);
        }
        
        const levelDisplay = document.getElementById('level-display');
        if (levelDisplay) {
            levelDisplay.textContent = level;
            levelDisplay.classList.add('level-up');
            setTimeout(() => levelDisplay.classList.remove('level-up'), 1000);
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

// Advance to the next level
function advanceToNextLevel() {
    // Stop the current timer
    if (gameTimer) clearInterval(gameTimer);
    
    // Show level complete message
    showLevelCompleteMessage();
    
    // Wait a moment before showing the countdown
    setTimeout(() => {
        // Increment level
        level++;
        
        // Load new level configuration
        loadLevelConfig(level);
        
        // Update level display
        if (levelElement) {
            levelElement.textContent = level;
            levelElement.classList.add('level-up');
            setTimeout(() => levelElement.classList.remove('level-up'), 1000);
        }
        
        // Show level transition with countdown
        showLevelTransition();
    }, 2000); // 2 second delay before showing countdown
}

// Show a level complete message
function showLevelCompleteMessage() {
    try {
        // Create level complete container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.zIndex = '200';
        container.style.backdropFilter = 'blur(5px)';
        container.style.userSelect = 'none';
        
        // Create level complete text
        const text = document.createElement('div');
        text.textContent = 'LEVEL COMPLETE!';
        text.style.color = '#fff';
        text.style.fontSize = '48px';
        text.style.fontWeight = 'bold';
        text.style.marginBottom = '20px';
        text.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Create stars animation
        const stars = document.createElement('div');
        stars.textContent = '⭐⭐⭐';
        stars.style.fontSize = '64px';
        stars.style.letterSpacing = '20px';
        stars.style.animation = 'starPulse 1s infinite alternate';
        
        // Add star pulse animation
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes starPulse {
                0% { transform: scale(0.8); }
                100% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Assemble and display
        container.appendChild(text);
        container.appendChild(stars);
        document.body.appendChild(container);
        
        // Remove after delay
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 2000);
    } catch (error) {
        console.error("Error showing level complete message:", error);
    }
}

// Show level transition with countdown
function showLevelTransition() {
    if (!countdownOverlay || !countdownElement) {
        startNextLevel();
        return;
    }
    
    // Show overlay with countdown
    countdownOverlay.style.display = 'flex';
    countdownOverlay.style.flexDirection = 'column';
    countdownOverlay.innerHTML = '';
    
    // Create level info for the countdown overlay
    const levelInfo = document.createElement('div');
    levelInfo.className = 'level-transition-info';
    levelInfo.style.fontSize = '24px';
    levelInfo.style.fontWeight = 'normal';
    levelInfo.style.textAlign = 'center';
    levelInfo.style.color = 'white';
    levelInfo.style.maxWidth = '80%';
    levelInfo.style.padding = '20px';
    levelInfo.style.backgroundColor = 'rgba(82, 113, 255, 0.2)';
    levelInfo.style.borderRadius = '16px';
    levelInfo.style.backdropFilter = 'blur(5px)';
    levelInfo.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    levelInfo.style.transition = 'transform 0.5s ease';
    levelInfo.style.userSelect = 'none';
    levelInfo.style.webkitUserSelect = 'none';
    levelInfo.style.MozUserSelect = 'none';
    levelInfo.style.msUserSelect = 'none';
    
    // Create level heading
    const levelTitle = document.createElement('div');
    levelTitle.textContent = `LEVEL ${level}`;
    levelTitle.style.fontSize = '36px';
    levelTitle.style.fontWeight = 'bold';
    levelTitle.style.marginBottom = '15px';
    levelTitle.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
    levelTitle.style.webkitBackgroundClip = 'text';
    levelTitle.style.webkitTextFillColor = 'transparent';
    levelTitle.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    
    // Add required matches info
    const objectiveText = document.createElement('div');
    objectiveText.innerHTML = `Find <b>${matchesRequired}</b> emojis in <b>${timeLeft}</b> seconds`;
    objectiveText.style.marginBottom = '15px';
    
    // Add level info elements
    levelInfo.appendChild(levelTitle);
    levelInfo.appendChild(objectiveText);
    
    // Add new category info if there is one
    if (currentLevelConfig.newCategory) {
        const formattedCategory = formatCategoryName(currentLevelConfig.newCategory);
        const newCategoryText = document.createElement('div');
        newCategoryText.innerHTML = `<span style="color:#ffbd59">NEW CATEGORY:</span> <b>${formattedCategory}</b>`;
        newCategoryText.style.marginTop = '15px';
        newCategoryText.style.padding = '10px 15px';
        newCategoryText.style.backgroundColor = 'rgba(255, 189, 89, 0.2)';
        newCategoryText.style.borderRadius = '8px';
        levelInfo.appendChild(newCategoryText);
        
        // Add a simpler emoji preview from the new category
        const categoryEmojis = emojiList[currentLevelConfig.newCategory];
        if (categoryEmojis && categoryEmojis.length > 0) {
            const previewContainer = document.createElement('div');
            previewContainer.style.marginTop = '10px';
            previewContainer.style.fontSize = '32px';
            
            // Display only 3 random emojis from the category
            const sampleSize = 3;
            const samples = [];
            for (let i = 0; i < sampleSize; i++) {
                const randomIndex = Math.floor(Math.random() * categoryEmojis.length);
                samples.push(categoryEmojis[randomIndex]);
            }
            
            previewContainer.textContent = samples.join(' ');
            levelInfo.appendChild(previewContainer);
        }
    }
    
    // Add info box to overlay first (centered)
    levelInfo.style.position = 'absolute';
    levelInfo.style.top = '50%';
    levelInfo.style.left = '50%';
    levelInfo.style.transform = 'translate(-50%, -50%)';
    countdownOverlay.appendChild(levelInfo);
    
    // Create countdown element - initially hidden
    const countdownWrapper = document.createElement('div');
    countdownWrapper.style.fontSize = '120px';
    countdownWrapper.style.fontWeight = 'bold';
    countdownWrapper.style.color = 'white';
    countdownWrapper.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
    countdownWrapper.style.opacity = '0';
    countdownWrapper.style.position = 'absolute';
    countdownWrapper.style.top = '50%';
    countdownWrapper.style.left = '50%';
    countdownWrapper.style.transform = 'translate(-50%, -50%)';
    countdownWrapper.style.transition = 'opacity 0.5s ease';
    countdownWrapper.style.userSelect = 'none';
    countdownWrapper.style.webkitUserSelect = 'none';
    countdownWrapper.style.MozUserSelect = 'none';
    countdownWrapper.style.msUserSelect = 'none';
    countdownWrapper.textContent = '3';
    countdownOverlay.appendChild(countdownWrapper);
    
    // Delay showing countdown number
    setTimeout(() => {
        // Move level info up (less distance to prevent overlap)
        levelInfo.style.transform = 'translate(-50%, -140%)';
        
        // Show countdown
        countdownWrapper.style.opacity = '1';
        
        // Start countdown
        let count = 3;
        const countInterval = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countInterval);
                countdownOverlay.style.display = 'none';
                startNextLevel();
            } else {
                countdownWrapper.textContent = count;
            }
        }, 1000);
    }, 2000);
}

// Start the next level after transition
function startNextLevel() {
    // Reset match counter
    matchesCompleted = 0;
    
    // Update UI
    if (timerFillElement) {
        timerFillElement.style.width = '100%';
        timerFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        timerFillElement.style.animation = 'none';
    }
    
    // Recreate category tabs with updated available categories
    createCategoryTabs();
    
    // If newly unlocked category is available, set it as selected
    if (currentLevelConfig.newCategory && availableCategories.includes(currentLevelConfig.newCategory)) {
        selectedCategory = currentLevelConfig.newCategory;
    }
    
    updateCategoryTabs();
    
    // Regenerate emoji grid with new available categories
    generateEmojiGrid(selectedCategory);
    
    // Set new target emoji
    setNewTargetEmoji();
    
    // Start the timer
    startTimer();
}

// Select a new random target emoji from all categories
function setNewTargetEmoji() {
    if (!targetEmojiElement) return;
    
    // Filter to only use available categories for the current level
    const availableCategoryList = availableCategories || ['smileys'];
    
    // Get a random category from available ones
    const randomCategory = availableCategoryList[Math.floor(Math.random() * availableCategoryList.length)];
    
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
    
    // Hint the player which category contains the emoji
    const targetCategory = document.querySelector(`.category-tab[data-category="${randomCategory}"]`);
    
    // Remove previous hints
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.style.border = '2px solid transparent';
    });
    
    // Add orange border hint to the category
    if (targetCategory) {
        targetCategory.style.border = '2px solid #ff9500';
    }
    
    // Reset scoring variables for the new target
    targetRevealTime = Date.now();
    incorrectAttempts = 0;
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
    
    // Get max time from current level config
    const maxTime = currentLevelConfig ? currentLevelConfig.time : 30;
    const percentage = (timeLeft / maxTime) * 100;
    
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
        // Green color for good time remaining (more than 10 seconds)
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
    if (maxLevelElement) maxLevelElement.textContent = level;
    
    // Show game over modal
    if (modalTitle) modalTitle.textContent = 'Game Over!';
    if (modalMessage) modalMessage.innerHTML = `${assessment} ${emoji}`;
    if (modal) modal.style.display = 'flex';
    
    // No longer first game
    isFirstGame = false;
}

// Reset the game (for debug mode)
function resetGame() {
    if (modal) modal.style.display = 'none';
    startCountdown();
}

// Toggle debug mode
function toggleDebugMode() {
    debugMode = !debugMode;
    showMessage(`Debug Mode: ${debugMode ? 'ON' : 'OFF'}`, debugMode ? '#4CAF50' : '#ff3b30');
    
    // Create or update debug indicator
    let debugIndicator = document.getElementById('debug-indicator');
    
    if (debugMode) {
        if (!debugIndicator) {
            debugIndicator = document.createElement('div');
            debugIndicator.id = 'debug-indicator';
            debugIndicator.style.position = 'fixed';
            debugIndicator.style.bottom = '10px'; // Changed from top to bottom
            debugIndicator.style.right = '10px';
            debugIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
            debugIndicator.style.color = '#4CAF50';
            debugIndicator.style.padding = '5px 10px';
            debugIndicator.style.borderRadius = '4px';
            debugIndicator.style.fontSize = '12px';
            debugIndicator.style.fontWeight = 'bold';
            debugIndicator.style.zIndex = '1000';
            document.body.appendChild(debugIndicator);
        }
        debugIndicator.textContent = '🐛 DEBUG ON';
        debugIndicator.style.display = 'block';
    } else if (debugIndicator) {
        debugIndicator.style.display = 'none';
        
        // If debug mode is being turned off, ensure the timer is running if game is not over
        if (!isGameOver && !gameTimer) {
            startTimer();
            showMessage('Timer resumed', '#4CAF50');
        }
    }
}

// Stop timer (for debug mode)
function stopTimer() {
    if (!debugMode) return;
    
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
        showMessage('Timer stopped', '#ff9500');
    } else {
        startTimer();
        showMessage('Timer resumed', '#4CAF50');
    }
}

// Share score on social media
if (shareButton) {
    shareButton.addEventListener('click', () => {
        const text = `I scored ${score} points in Emoji Spotter! Can you beat my score? I found ${emojisFound} emojis! 🎮`;
        
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

// Load level configuration
function loadLevelConfig(currentLevel) {
    // Get level config or use the last level if beyond config
    currentLevelConfig = levelConfig.find(config => config.level === currentLevel) || 
                         levelConfig[levelConfig.length - 1];
    
    // Set game parameters from level config
    matchesRequired = currentLevelConfig.matches;
    matchesCompleted = 0;
    timeLeft = currentLevelConfig.time;
    availableCategories = currentLevelConfig.categories;
    
    if (timerTextElement) timerTextElement.textContent = timeLeft;
}

// Initialize game on load with error handling
window.addEventListener('load', () => {
    try {
        // Show preloader while resources are loading
        if (preloader) {
            preloader.style.display = 'flex';
        }

        // Start resource loading and game initialization
        const resourcesLoadedPromise = Promise.all([
            // Add promises for any resources that need to be loaded
            new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('DOMContentLoaded', resolve);
                }
            }),
            new Promise(resolve => setTimeout(resolve, 1000)) // Minimum display time for preloader
        ]);

        // When resources are loaded, hide preloader and initialize game
        resourcesLoadedPromise.then(() => {
            // Hide preloader with fade-out effect
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.visibility = 'hidden';
                    preloader.style.display = 'none';
                }, 500);
            }

            // Initialize Lucide icons if available
            if (window.lucide) {
                lucide.createIcons();
            } else {
                console.warn("Lucide icons library not loaded, skipping icon initialization");
            }
            
            // Make sure overlay is hidden initially
            if (countdownOverlay) countdownOverlay.style.display = 'none';
            
            // Initialize particle effects
            initParticles();
            
            // Show tutorial or start game
            showTutorial();

            // Add keyboard event listeners for debug mode
            document.addEventListener('keydown', handleKeyPress);
        }).catch(error => {
            console.error("Error during resource loading:", error);
            // Hide preloader even if there was an error
            if (preloader) {
                preloader.style.display = 'none';
            }
            // Fallback to direct game start
            setTimeout(initGame, 100);
        });
    } catch (error) {
        console.error("Error initializing game:", error);
        // Hide preloader even if there was an error
        if (preloader) {
            preloader.style.display = 'none';
        }
        // Fallback to direct game start if there's an error
        setTimeout(initGame, 500);
    }
});

// Handle keyboard shortcuts for debug mode
function handleKeyPress(event) {
    // Toggle pause with ESC key
    if (event.key === 'Escape') {
        togglePause();
        return;
    }

    // Toggle debug mode with 'd' key
    if (event.key === 'd') {
        toggleDebugMode();
    }
    
    // Only process other debug shortcuts if debug mode is on
    if (debugMode) {
        // Stop/resume timer with 't' key
        if (event.key === 't') {
            stopTimer();
        }
        
        // Reset game with 'r' key
        if (event.key === 'r') {
            if (!isGameOver) {
                showMessage('Game reset', '#ff9500');
            }
            resetGame();
        }
        
        // Restart current level with 'l' key
        if (event.key === 'l') {
            if (!isGameOver) {
                showMessage('Restarting level', '#ff9500');
                restartCurrentLevel();
            }
        }
        
        // Skip to next level with 'n' key
        if (event.key === 'n') {
            if (!isGameOver) {
                showMessage('Skipping to next level', '#ff9500');
                advanceToNextLevel();
            }
        }
    }
} 

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
    // Use the middle of the viewport as the detection point
    const gridMiddle = gridRect.top + (gridRect.height / 2);
    
    // Find which category marker is closest to or just passed the middle
    let visibleCategory = null;
    
    // Sort markers by their position (top to bottom)
    const sortedMarkers = Array.from(categoryMarkers).sort((a, b) => {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
    
    // Find the last marker that's above or at the middle point
    for (let i = 0; i < sortedMarkers.length; i++) {
        const marker = sortedMarkers[i];
        const markerRect = marker.getBoundingClientRect();
        
        if (markerRect.top <= gridMiddle) {
            visibleCategory = marker.id.replace('category-', '');
            
            // If we're at the last marker or the next marker is below the middle,
            // this is our category
            if (i === sortedMarkers.length - 1 || 
                sortedMarkers[i+1].getBoundingClientRect().top > gridMiddle) {
                break;
            }
        } else {
            // If the first marker is already below the middle, use the first category
            if (i === 0 && visibleCategory === null) {
                visibleCategory = sortedMarkers[0].id.replace('category-', '');
            }
            break;
        }
    }
    
    // Update the selected category
    if (visibleCategory && visibleCategory !== selectedCategory) {
        selectedCategory = visibleCategory;
        updateCategoryTabs();
    }
}

// Start drag scrolling for emoji grid
function setupDragScrolling() {
    if (!emojiGridElement) return;
    
    // Clean up any existing event listeners
    emojiGridElement.removeEventListener('mousedown', startDrag);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    emojiGridElement.removeEventListener('touchstart', startDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
    
    // Check if using touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Only setup drag scrolling for non-touch devices
    if (!isTouchDevice) {
        // Mouse events for desktop only
        emojiGridElement.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    // Cancel animation frame if it's running
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// Start drag operation
function startDrag(e) {
    // Only handle primary mouse button (left click)
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    // Cancel any ongoing momentum scrolling
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Store initial positions
    isDragging = true;
    moveDetected = false;
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    lastY = startY;
    lastTime = Date.now();
    scrollTop = emojiGridElement.scrollTop;
    scrollVelocity = 0;
    
    // Change cursor
    emojiGridElement.classList.add('grabbing');
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
}

// Handle drag movement
function drag(e) {
    if (!isDragging) return;
    
    // Calculate new position
    const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const walkY = (startY - y);
    
    // Track velocity for momentum
    const now = Date.now();
    const elapsed = now - lastTime;
    if (elapsed > 0) {
        scrollVelocity = (lastY - y) / elapsed * 15; // Scale factor for momentum
    }
    lastY = y;
    lastTime = now;
    
    // Set flag to detect movement - use a smaller threshold for better detection
    if (Math.abs(walkY) > 3) {
        moveDetected = true;
        
        // If we've detected movement, prevent the click from firing later
        const emojis = emojiGridElement.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            delete emoji.dataset.clickStart;
        });
        
        // Prevent default after confirming movement
        e.preventDefault();
    }
    
    // Update scroll position
    emojiGridElement.scrollTop = scrollTop + walkY;
}

// End drag operation
function stopDrag(e) {
    if (!isDragging) return;
    
    // Start momentum scrolling if there's velocity
    if (Math.abs(scrollVelocity) > 0.5 && moveDetected) {
        momentum();
    }
    
    // Only prevent default emoji click if we actually moved
    if (moveDetected && e && e.type !== 'touchend') {
        e.preventDefault();
        
        // Temporary disable emoji clicks to avoid accidental selections
        const emojis = emojiGridElement.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.style.pointerEvents = 'none';
        });
        
        // Re-enable after a short delay
        setTimeout(() => {
            emojis.forEach(emoji => {
                emoji.style.pointerEvents = 'auto';
            });
        }, 100);
    }
    
    isDragging = false;
    emojiGridElement.classList.remove('grabbing');
}

// Momentum scrolling animation
function momentum() {
    // Continue scrolling with momentum
    emojiGridElement.scrollTop += scrollVelocity;
    // Apply friction to gradually slow down
    scrollVelocity *= 0.95;
    
    // Stop when velocity is very small
    if (Math.abs(scrollVelocity) > 0.1) {
        animationFrameId = requestAnimationFrame(momentum);
    } else {
        animationFrameId = null;
    }
}

// Calculate score with bonuses based on speed and accuracy
function calculateScore(category) {
    // Base points for finding the emoji
    const basePoints = 10 * level;
    
    // Calculate speed bonus
    const timeTaken = (Date.now() - targetRevealTime) / 1000; // in seconds
    let speedMultiplier = 1.0;
    
    // Faster finds get higher multipliers
    if (timeTaken < 1.5) {
        speedMultiplier = 2.0; // Very fast (under 1.5 seconds)
    } else if (timeTaken < 3) {
        speedMultiplier = 1.5; // Fast (1.5 to 3 seconds)
    } else if (timeTaken < 5) {
        speedMultiplier = 1.2; // Decent (3 to 5 seconds)
    }
    
    // Penalty for mistakes
    const accuracyMultiplier = Math.max(0.5, 1 - (incorrectAttempts * 0.2));
    
    // Category difficulty multiplier
    const categoryMultiplier = categoryBonusMultipliers[category] || 1;
    
    // Calculate total score with all multipliers
    const totalPoints = Math.round(basePoints * speedMultiplier * accuracyMultiplier * categoryMultiplier);
    
    // For debugging
    if (debugMode) {
        console.log(`Score breakdown: Base=${basePoints}, Speed=${speedMultiplier.toFixed(1)}x, Accuracy=${accuracyMultiplier.toFixed(1)}x, Category=${categoryMultiplier.toFixed(1)}x, Total=${totalPoints}`);
    }
    
    return totalPoints;
}

// Toggle game pause
function togglePause() {
    if (isGameOver) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        // Pause the game
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        
        // Show pause overlay
        showPauseOverlay();
    } else {
        // Resume the game
        startTimer();
        
        // Hide pause overlay
        hidePauseOverlay();
    }
}

// Show pause overlay
function showPauseOverlay() {
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.position = 'fixed';
    pauseOverlay.style.top = '0';
    pauseOverlay.style.left = '0';
    pauseOverlay.style.width = '100%';
    pauseOverlay.style.height = '100%';
    pauseOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    pauseOverlay.style.display = 'flex';
    pauseOverlay.style.flexDirection = 'column';
    pauseOverlay.style.alignItems = 'center';
    pauseOverlay.style.justifyContent = 'center';
    pauseOverlay.style.zIndex = '500';
    pauseOverlay.style.backdropFilter = 'blur(5px)';
    
    // Pause text
    const pauseText = document.createElement('div');
    pauseText.textContent = 'PAUSED';
    pauseText.style.color = '#fff';
    pauseText.style.fontSize = '48px';
    pauseText.style.fontWeight = 'bold';
    pauseText.style.marginBottom = '20px';
    
    // Instructions
    const instructions = document.createElement('div');
    instructions.textContent = 'Press ESC to resume';
    instructions.style.color = '#fff';
    instructions.style.fontSize = '24px';
    
    pauseOverlay.appendChild(pauseText);
    pauseOverlay.appendChild(instructions);
    document.body.appendChild(pauseOverlay);
}

// Hide pause overlay
function hidePauseOverlay() {
    const pauseOverlay = document.getElementById('pause-overlay');
    if (pauseOverlay) {
        document.body.removeChild(pauseOverlay);
    }
}