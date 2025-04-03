// Import the emoji list from the module
import emojiList from './appleEmojis.js';
import { levelConfig } from './config/levelConfig.js';
import { audioElements, playSound, applyAudioSettings, initializeAudio, preloadAudio } from './audio.js';
import { DEFAULT_VOLUME, DEFAULT_MUTED, DEFAULT_EMOJI_SIZE } from './config/gameConfig.js';

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

// Game settings
let gameSettings = {
    soundVolume: DEFAULT_VOLUME,
    isMuted: DEFAULT_MUTED,
    emojiSize: DEFAULT_EMOJI_SIZE,
};

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
const timerCircleElement = document.getElementById('timer-circle');
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
    
    // Reset the timer circle position to start on the right side
    if (timerCircleElement) {
        timerCircleElement.style.left = 'calc(100% - 45px)';
    }
    if (timerFillElement) {
        timerFillElement.style.width = '100%';
    }
    
    countdownOverlay.style.display = 'flex';
    let count = 3;
    countdownElement.textContent = count;
    
    // Play the first countdown sound (for 3)
    playSound('countdownStart');
    
    const countInterval = setInterval(() => {
        count--;
        
        // Update the display
        countdownElement.textContent = count;
        
        if (count === 2 || count === 1) {
            // Play countdown sound on 2 and 1
            playSound('countdownStart');
        } else if (count === 0) {
            // Play the final "GO!" sound
            playSound('countdownLast');
            
            // Show "GO!" text briefly before starting the game
            countdownElement.textContent = "GO!";
            
            // Wait a moment for the GO text to be visible, then start game
            setTimeout(() => {
                countdownOverlay.style.display = 'none';
                initGame();
            }, 500);
            
            clearInterval(countInterval);
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
        timerCircleElement.style.left = 'calc(100% - 45px)'; // Position circle slightly more to the left
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
    
    // Get emoji size scale factors (more dramatic differences)
    let fontSizeFactor = 1;
    let itemSizeFactor = 1;
    let gridColumns = 6; // Default columns
    
    switch (gameSettings.emojiSize) {
        case 'small':
            fontSizeFactor = 1; // This is now our baseline size
            itemSizeFactor = 1;
            gridColumns = 6; // Small size: 6 columns
            break;
        case 'medium':
            fontSizeFactor = 1.5;
            itemSizeFactor = 1.3;
            gridColumns = 5; // Medium size: 5 columns
            break;
        case 'large':
            fontSizeFactor = 2;
            itemSizeFactor = 1.8;
            gridColumns = 4; // Large size: 4 columns
            break;
    }
    
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
        
        // Apply grid template based on size setting
        emojiContainer.style.display = 'grid';
        emojiContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        emojiContainer.style.gap = `${8 * itemSizeFactor}px`;
        emojiContainer.style.marginBottom = '16px';
        
        emojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji';
            emojiElement.textContent = emoji;
            emojiElement.dataset.category = category;
            emojiElement.dataset.emoji = emoji;
            
            // Apply current emoji size settings
            const baseFontSize = 24; // Base font size in pixels
            emojiElement.style.fontSize = `${baseFontSize * fontSizeFactor}px`;
            
            // Remove explicit width/height to let CSS handle the full width
            // and maintain aspect ratio for proper spacing
            emojiElement.style.padding = `${5 * itemSizeFactor}px`;
            emojiElement.style.borderRadius = `${8 * itemSizeFactor}px`;
            
            // Handle desktop mouse events
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
            
            // For touch devices - separate tracking variable to prevent conflicts
            let touchStarted = false;
            
            emojiElement.addEventListener('touchstart', (e) => {
                touchStarted = true;
                moveDetected = false; // Reset move detection for new touch
            });
            
            emojiElement.addEventListener('touchmove', () => {
                moveDetected = true; // Mark as moved if touchmove triggers
            });
            
            emojiElement.addEventListener('touchend', (e) => {
                if (touchStarted && !moveDetected) {
                    handleEmojiClick(emoji, emojiElement);
                    e.preventDefault(); // Prevent additional mouseup/click events
                }
                touchStarted = false;
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

        playSound('correct');
        
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
        
        // Show floating point indicator
        createFloatingIndicator(emojiElement, `+${pointsEarned}`, true);
        
        // Only show debug message if in debug mode
        if (debugMode) {
            const timeTaken = ((now - targetRevealTime) / 1000).toFixed(1);
            showMessage(`Debug: ${timeTaken}s, ${incorrectAttempts} errors`, '#4CAF50');
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

        playSound('incorrect');
        
        // Apply time penalty (2 seconds)
        timeLeft = Math.max(1, timeLeft - 2);
        updateTimer();
        
        // Show floating error indicator
        createFloatingIndicator(emojiElement, "-2s", false);
        
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

// Create a floating score indicator at the emoji position
function createFloatingIndicator(element, text, isSuccess = true) {
    if (!element) return;
    
    try {
        // Get position of the element
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top;
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `floating-indicator ${isSuccess ? 'success' : 'error'}`;
        indicator.textContent = text;
        indicator.style.left = `${centerX}px`;
        indicator.style.top = `${centerY}px`;
        indicator.style.transform = 'translate(-50%, -50%)';
        
        // Add to DOM
        document.body.appendChild(indicator);
        
        // Remove after animation completes
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 1500);
    } catch (error) {
        console.error("Error creating floating indicator:", error);
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

    playSound('levelComplete');
    
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
        text.style.textAlign = 'center'; // Ensure text is center-aligned on all devices
        
        // Create stars animation
        const stars = document.createElement('div');
        stars.textContent = '⭐⭐⭐';
        stars.style.fontSize = '64px';
        stars.style.letterSpacing = '20px';
        stars.style.animation = 'starPulse 1s infinite alternate';
        stars.style.textAlign = 'center'; // Center the stars
        stars.style.width = '100%'; // Give full width to ensure centering works
        
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
    
    // Create level heading
    const levelTitle = document.createElement('div');
    levelTitle.textContent = `LEVEL ${level}`;
    levelTitle.className = 'level-title';
    
    // Add required matches info
    const objectiveText = document.createElement('div');
    objectiveText.innerHTML = `Find <b>${matchesRequired}</b> emojis in <b>${timeLeft}</b> seconds`;
    objectiveText.className = 'level-objective';
    
    // Add level info elements
    levelInfo.appendChild(levelTitle);
    levelInfo.appendChild(objectiveText);
    
    // Add new category info if there is one
    if (currentLevelConfig.newCategory) {
        const formattedCategory = formatCategoryName(currentLevelConfig.newCategory);
        const newCategoryText = document.createElement('div');
        newCategoryText.innerHTML = `<span style="color:#ffbd59">NEW CATEGORY:</span> <b>${formattedCategory}</b>`;
        newCategoryText.className = 'new-category';
        levelInfo.appendChild(newCategoryText);
        
        // Add a simpler emoji preview from the new category
        const categoryEmojis = emojiList[currentLevelConfig.newCategory];
        if (categoryEmojis && categoryEmojis.length > 0) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'category-emoji-preview';
            
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
    
    countdownOverlay.appendChild(levelInfo);
    
    // Create countdown element - initially hidden
    const countdownWrapper = document.createElement('div');
    countdownWrapper.className = 'level-countdown';
    countdownWrapper.textContent = '3';
    countdownOverlay.appendChild(countdownWrapper);
    
    // Delay showing countdown number
    setTimeout(() => {
        // Move level info up (less distance to prevent overlap)
        levelInfo.style.transform = 'translate(-50%, -140%)';
        
        // Show countdown
        countdownWrapper.style.opacity = '1';
        
        // Play the first countdown sound for "3"
        playSound('countdownStart');
        
        // Start countdown
        let count = 3;
        const countInterval = setInterval(() => {
            count--;
            countdownWrapper.textContent = count;
            
            if (count === 2 || count === 1) {
                // Play countdown sound on 2 and 1
                playSound('countdownStart');
            } else if (count === 0) {
                // Play the final "GO!" sound
                playSound('countdownLast');
                
                // Show "GO!" text briefly before starting the next level
                countdownWrapper.textContent = "GO!";
                
                // Wait a moment for the GO text to be visible, then start the next level
                setTimeout(() => {
                    countdownOverlay.style.display = 'none';
                    startNextLevel();
                }, 500);
                
                clearInterval(countInterval);
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
    
    // Delay the category hint by 2.5 seconds
    setTimeout(() => {
        // Add orange border hint to the category
        if (targetCategory) {
            targetCategory.style.border = '2px solid #ff9500';
        }
    }, 3500);
    
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
    if (!timerFillElement || !timerTextElement || !timerCircleElement) return;
    
    // Get max time from current level config
    const maxTime = currentLevelConfig ? currentLevelConfig.time : 30;
    const percentage = (timeLeft / maxTime) * 100;
    
    // Update the timer text
    timerTextElement.textContent = timeLeft;
    
    // Calculate bar dimensions
    const timerBarWidth = timerFillElement.parentElement.offsetWidth;
    const circleWidth = timerCircleElement.offsetWidth;
    
    // Calculate the effective travel area 
    const effectiveBarWidth = timerBarWidth - circleWidth;
    
    // Update both timer fill and circle in the same animation frame
    // Use the same percentage math for both to ensure sync
    requestAnimationFrame(() => {
        // Set the bar width
        timerFillElement.style.width = `${percentage}%`;
        
        // Calculate circle left position - use the same percentage logic
        const circlePosition = (percentage / 100) * effectiveBarWidth;
        timerCircleElement.style.left = `${circlePosition}px`;
        
        // Update timer text color based on time remaining
        if (timeLeft <= 5) {
            timerTextElement.style.color = '#ff3b30'; // Red for critical time
            timerFillElement.style.background = 'linear-gradient(90deg, #ff3b30, #ff634d)';
            timerFillElement.style.animation = 'pulse 0.5s infinite';
        } else if (timeLeft <= 10) {
            timerTextElement.style.color = '#ff9500'; // Orange for warning time
            timerFillElement.style.background = 'linear-gradient(90deg, #ff9500, #ffbd59)';
            timerFillElement.style.animation = 'none';
        } else {
            timerTextElement.style.color = 'black'; // Default black for normal time
            timerFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            timerFillElement.style.animation = 'none';
        }
    });
}

// Show a temporary message
function showMessage(message, color) {
    try {
        // Ensure toast container exists
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Determine toast type based on color
        let toastType = 'default';
        let iconSymbol = '📝';
        
        if (color === '#4CAF50') {
            toast.classList.add('success');
            toastType = 'success';
            iconSymbol = '✅';
        } else if (color === '#ff3b30') {
            toast.classList.add('error');
            toastType = 'error';
            iconSymbol = '❌';
        } else if (color === '#ff9500') {
            toast.classList.add('warning');
            toastType = 'warning';
            iconSymbol = '⚠️';
        }
        
        // Create toast icon
        const icon = document.createElement('div');
        icon.className = 'toast-icon';
        icon.textContent = iconSymbol;
        
        // Create toast message
        const messageElement = document.createElement('div');
        messageElement.className = 'toast-message';
        messageElement.textContent = message;
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        
        // Assemble toast
        toast.appendChild(icon);
        toast.appendChild(messageElement);
        toast.appendChild(progressBar);
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Play removal animation and remove after delay
        setTimeout(() => {
            toast.style.animation = 'toast-slide-out 0.3s forwards';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
                
                // Remove container if empty
                if (toastContainer.children.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }, 300);
        }, 2500); // Show for 2.5 seconds
        
    } catch (error) {
        console.error("Error showing toast message:", error);
    }
}

// End the game
function endGame() {
    if (gameTimer) clearInterval(gameTimer);
    isGameOver = true;
    
    playSound('gameOver');
    
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

// Load settings from localStorage
function loadGameSettings() {
    try {
        const savedSettings = localStorage.getItem('emojiSpotterSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Update game settings with saved values
            gameSettings = { ...gameSettings, ...parsedSettings };
            
            // Apply loaded settings
            if (gameSettings.emojiSize) {
                updateEmojiSize(gameSettings.emojiSize);
            }
            
            // Apply loaded audio settings
            applyAudioSettings(gameSettings.soundVolume, gameSettings.isMuted);
        }
    } catch (e) {
        console.error('Failed to load settings from localStorage', e);
        // Ensure default settings are applied if loading fails
        applyAudioSettings(gameSettings.soundVolume, gameSettings.isMuted);
    }
}

// Initialize game on load with error handling
window.addEventListener('load', () => {
    try {
        // Load user settings
        loadGameSettings();
        
        // Show preloader while resources are loading
        if (preloader) {
            preloader.style.display = 'flex';
        }

        // Add click handler to settings icon
        const settingsIcon = document.getElementById('settings-icon');
        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            settingsContainer.addEventListener('click', () => {
                togglePause();
            });
        }
        
        // Add click handler to sound toggle icon
        const soundIcon = document.getElementById('sound-icon');
        const soundToggleContainer = document.querySelector('.sound-toggle-container');
        if (soundToggleContainer) {
            soundToggleContainer.addEventListener('click', () => {
                toggleSound();
            });
            
            // Set initial icon state based on game settings
            updateSoundIcon();
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

            // Preload audio to reduce latency
            preloadAudio();
            
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

        // Add 1 second to timer with '+' key
        if (event.key === '+' || event.key === '=') {
            if (!isGameOver) {
                timeLeft++;
                updateTimer();
                showMessage('+1 second', '#4CAF50');
            }
        }

        // Subtract 1 second from timer with '-' key
        if (event.key === '-' || event.key === '_') {
            if (!isGameOver) {
                timeLeft = Math.max(1, timeLeft - 1);
                updateTimer();
                showMessage('-1 second', '#ff9500');
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
    
    // If we've detected movement, cancel click events
    if (moveDetected) {
        if (e && e.type !== 'touchend') {
            e.preventDefault();
        }
        
        // Disable all emoji click events temporarily to prevent accidental selection after drag
        const emojis = emojiGridElement.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            // Remove click start data and temporarily disable pointer events
            delete emoji.dataset.clickStart;
            emoji.style.pointerEvents = 'none';
        });
        
        // Re-enable after a short delay
        setTimeout(() => {
            emojis.forEach(emoji => {
                emoji.style.pointerEvents = 'auto';
            });
        }, 300); // Longer delay to ensure no accidental taps
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

    if (speedMultiplier >= 1.5) {
        playSound('bonus');
    }
    
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
        playSound('pause');

        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        
        // Show settings modal instead of pause overlay
        showSettingsModal();
    } else {
        // Resume the game
        startTimer();
        
        // Hide settings modal
        hideSettingsModal();
    }
}

// Show settings modal
function showSettingsModal() {
    // Create settings modal container
    const settingsModal = document.createElement('div');
    settingsModal.id = 'settings-modal';
    settingsModal.style.position = 'fixed';
    settingsModal.style.top = '0';
    settingsModal.style.left = '0';
    settingsModal.style.width = '100%';
    settingsModal.style.height = '100%';
    settingsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    settingsModal.style.display = 'flex';
    settingsModal.style.alignItems = 'center';
    settingsModal.style.justifyContent = 'center';
    settingsModal.style.zIndex = '500';
    settingsModal.style.backdropFilter = 'blur(5px)';
    
    // Create settings content
    const settingsContent = document.createElement('div');
    settingsContent.className = 'settings-content';
    settingsContent.style.backgroundColor = 'white';
    settingsContent.style.padding = '30px';
    settingsContent.style.borderRadius = '20px';
    settingsContent.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    settingsContent.style.width = '90%';
    settingsContent.style.maxWidth = '450px';
    settingsContent.style.position = 'relative';
    
    // Settings title
    const title = document.createElement('h2');
    title.textContent = 'Settings';
    title.style.marginTop = '0';
    title.style.marginBottom = '20px';
    title.style.fontSize = '28px';
    title.style.textAlign = 'center';
    title.style.color = 'var(--primary-color)';
    
    // Close button - styled like our modal buttons but as a circle
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#999';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.onclick = togglePause;
    
    // Settings sections
    const settingsList = document.createElement('div');
    settingsList.style.marginTop = '30px';
    
    // Sound volume setting
    const soundVolumeContainer = document.createElement('div');
    soundVolumeContainer.className = 'settings-group';
    soundVolumeContainer.style.marginBottom = '25px';
    
    const soundLabel = document.createElement('div');
    soundLabel.textContent = 'Sound Volume';
    soundLabel.style.marginBottom = '10px';
    soundLabel.style.fontWeight = 'bold';
    
    const soundControlsWrapper = document.createElement('div');
    soundControlsWrapper.style.display = 'flex';
    soundControlsWrapper.style.alignItems = 'center';
    
    // Volume slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = gameSettings.soundVolume; // Use current gameSettings value
    volumeSlider.disabled = gameSettings.isMuted;
    volumeSlider.style.flex = '1';
    volumeSlider.style.marginRight = '10px';
    volumeSlider.style.accentColor = 'var(--primary-color)';
    
    // Mute toggle
    const muteToggleWrapper = document.createElement('div');
    muteToggleWrapper.style.display = 'flex';
    muteToggleWrapper.style.alignItems = 'center';
    
    const muteLabel = document.createElement('label');
    muteLabel.textContent = 'Mute';
    muteLabel.style.marginRight = '5px';
    muteLabel.style.cursor = 'pointer';
    
    const muteToggle = document.createElement('input');
    muteToggle.type = 'checkbox';
    muteToggle.checked = gameSettings.isMuted; // Use current gameSettings value
    muteToggle.style.cursor = 'pointer';
    muteToggle.style.width = '16px';
    muteToggle.style.height = '16px';
    
    muteToggleWrapper.appendChild(muteLabel);
    muteToggleWrapper.appendChild(muteToggle);
    
    soundControlsWrapper.appendChild(volumeSlider);
    soundControlsWrapper.appendChild(muteToggleWrapper);
    
    soundVolumeContainer.appendChild(soundLabel);
    soundVolumeContainer.appendChild(soundControlsWrapper);
    
    // Emoji size setting
    const emojiSizeContainer = document.createElement('div');
    emojiSizeContainer.className = 'settings-group';
    emojiSizeContainer.style.marginBottom = '25px';
    
    const emojiSizeLabel = document.createElement('div');
    emojiSizeLabel.textContent = 'Emoji Size';
    emojiSizeLabel.style.marginBottom = '10px';
    emojiSizeLabel.style.fontWeight = 'bold';
    
    const sizeButtonsContainer = document.createElement('div');
    sizeButtonsContainer.style.display = 'flex';
    sizeButtonsContainer.style.justifyContent = 'space-between';
    sizeButtonsContainer.style.gap = '10px';
    
    // Size options
    const sizes = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
    ];
    
    sizes.forEach(size => {
        const sizeButton = document.createElement('button');
        sizeButton.textContent = size.label;
        sizeButton.className = 'modal-button';
        sizeButton.style.flex = '1';
        sizeButton.style.padding = '10px 15px';
        
        // Add active styling for currently selected size
        if (gameSettings.emojiSize === size.value) {
            sizeButton.style.background = 'linear-gradient(90deg, var(--primary-color), #7691ff)';
            sizeButton.style.color = 'white';
        } else {
            sizeButton.style.background = 'white';
            sizeButton.style.color = '#333';
            sizeButton.style.border = '2px solid #ddd';
        }
        
        sizeButton.onclick = function() {
            gameSettings.emojiSize = size.value;
            updateEmojiSize(size.value);
            
            // Update all size buttons
            const allSizeButtons = sizeButtonsContainer.querySelectorAll('button');
            allSizeButtons.forEach(btn => {
                btn.style.background = 'white';
                btn.style.color = '#333';
                btn.style.border = '2px solid #ddd';
            });
            
            // Highlight selected button
            this.style.background = 'linear-gradient(90deg, var(--primary-color), #7691ff)';
            this.style.color = 'white';
            this.style.border = 'none';
        };
        
        sizeButtonsContainer.appendChild(sizeButton);
    });
    
    emojiSizeContainer.appendChild(emojiSizeLabel);
    emojiSizeContainer.appendChild(sizeButtonsContainer);
    
    // Credits section
    const creditsContainer = document.createElement('div');
    creditsContainer.style.marginTop = '40px';
    creditsContainer.style.textAlign = 'center';
    creditsContainer.style.fontSize = '12px';
    creditsContainer.style.color = '#999';
    creditsContainer.textContent = 'Emoji Spotter v1.0 • Created with ❤️ • 2025';
    
    // Assemble settings modal
    settingsList.appendChild(soundVolumeContainer);
    settingsList.appendChild(emojiSizeContainer);
    
    settingsContent.appendChild(title);
    settingsContent.appendChild(closeButton);
    settingsContent.appendChild(settingsList);
    settingsContent.appendChild(creditsContainer);
    
    settingsModal.appendChild(settingsContent);
    document.body.appendChild(settingsModal);
    
    // Fix volume slider functionality to immediately apply changes
    volumeSlider.oninput = function() {
        gameSettings.soundVolume = parseInt(this.value);
        // Apply volume changes to game sounds immediately
        applyAudioSettings(gameSettings.soundVolume, gameSettings.isMuted);
        // Save settings
        saveGameSettings();
    };
    
    // Fix mute toggle to immediately apply changes
    muteToggle.onchange = function() {
        gameSettings.isMuted = this.checked;
        volumeSlider.disabled = this.checked;
        // Apply mute settings to game sounds immediately
        applyAudioSettings(gameSettings.soundVolume, gameSettings.isMuted);
        // Save settings
        saveGameSettings();
    };
    
    // Add animation
    settingsContent.style.transform = 'scale(0.9)';
    settingsContent.style.opacity = '0';
    settingsContent.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    setTimeout(() => {
        settingsContent.style.transform = 'scale(1)';
        settingsContent.style.opacity = '1';
    }, 10);
}

// Helper function to save game settings
function saveGameSettings() {
    try {
        localStorage.setItem('emojiSpotterSettings', JSON.stringify(gameSettings));
    } catch (e) {
        console.error('Failed to save settings to localStorage', e);
    }
}

// Hide settings modal
function hideSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        const settingsContent = settingsModal.querySelector('.settings-content');
        
        // Fade out animation
        if (settingsContent) {
            settingsContent.style.transform = 'scale(0.9)';
            settingsContent.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(settingsModal);
            }, 300);
        } else {
            document.body.removeChild(settingsModal);
        }
    }
}

// Update emoji size based on settings
function updateEmojiSize(size) {
    // Get emoji size scale factors
    let fontSizeFactor = 1;
    let itemSizeFactor = 1;
    let gridColumns = 6; // Default columns
    
    switch (size) {
        case 'small':
            fontSizeFactor = 1; // This is now our baseline size
            itemSizeFactor = 1;
            gridColumns = 6; // Small size: 6 columns
            break;
        case 'medium':
            fontSizeFactor = 1.5;
            itemSizeFactor = 1.3;
            gridColumns = 5; // Medium size: 5 columns
            break;
        case 'large':
            fontSizeFactor = 2;
            itemSizeFactor = 1.8;
            gridColumns = 4; // Large size: 4 columns
            break;
    }
    
    // Apply to grid emojis
    const gridEmojis = document.querySelectorAll('.emoji');
    gridEmojis.forEach(emoji => {
        // Update font size
        const baseFontSize = 24; // Base font size in pixels
        emoji.style.fontSize = `${baseFontSize * fontSizeFactor}px`;
        
        // Apply consistent height with proportional padding
        emoji.style.height = `${40 * itemSizeFactor}px`;
        emoji.style.padding = `${5 * itemSizeFactor}px`;
        emoji.style.borderRadius = `${8 * itemSizeFactor}px`;
        
        // Remove width if it exists as an inline style, letting CSS control width
        emoji.style.removeProperty('width');
    });
    
    // Update container grid layout
    const emojiContainers = document.querySelectorAll('.emoji-category-container');
    emojiContainers.forEach(container => {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
        container.style.gap = `${8 * itemSizeFactor}px`;
    });
    
    // Save setting to storage for persistence
    saveGameSettings();
}

// Load settings from localStorage
loadGameSettings();

// Toggle sound on/off
function toggleSound() {
    gameSettings.isMuted = !gameSettings.isMuted;
    
    // Apply audio settings
    applyAudioSettings(gameSettings.soundVolume, gameSettings.isMuted);
    
    // Update icon
    updateSoundIcon();
    
    // Save settings
    saveGameSettings();
    
    // Only show message in debug mode
    if (debugMode) {
        showMessage(gameSettings.isMuted ? 'Sound muted' : 'Sound enabled', '#4CAF50');
    }
}

// Update sound icon based on mute state
function updateSoundIcon() {
    const soundIcon = document.getElementById('sound-icon');
    if (!soundIcon) return;
    
    // First clear any existing content
    soundIcon.innerHTML = '';
    
    // Set the correct icon type based on mute state
    const iconName = gameSettings.isMuted ? 'volume-x' : 'volume-2';
    soundIcon.setAttribute('data-lucide', iconName);
    
    // Set color (red for muted)
    if (gameSettings.isMuted) {
        soundIcon.style.color = '#ff3b30'; // Red for muted
    } else {
        soundIcon.style.color = ''; // Default color when not muted
    }
    
    // Force lucide to create a new icon
    if (window.lucide) {
        lucide.createIcons({
            elements: [soundIcon]
        });
    }
}