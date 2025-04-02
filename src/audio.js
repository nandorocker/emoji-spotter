// Audio file imports
import bonusSound from '/audio/bonus.mp3';
import correctSound from '/audio/correct.mp3';
import gameOverSound from '/audio/game_over.mp3';
import incorrectSound from '/audio/incorrect.mp3';
import levelCompleteSound from '/audio/level_complete.mp3';
import pauseSound from '/audio/pause.mp3';

// Create and export audio elements
export const audioElements = {
  bonus: new Audio(bonusSound),
  correct: new Audio(correctSound),
  gameOver: new Audio(gameOverSound),
  incorrect: new Audio(incorrectSound),
  levelComplete: new Audio(levelCompleteSound),
  pause: new Audio(pauseSound)
};

// Initialize audio with default settings
export function initializeAudio(volume = 70, isMuted = false) {
  Object.values(audioElements).forEach(audio => {
    audio.volume = volume / 100;
    audio.muted = isMuted;
    audio.preload = 'auto';
    audio.load();
  });
}

/**
 * Play a sound by its name
 */
export function playSound(soundName) {
  try {
    if (!audioElements[soundName]) {
      console.error(`Sound "${soundName}" not found`);
      return;
    }
    return audioElements[soundName].play().catch(error => {
      console.error(`Error playing ${soundName} sound:`, error);
    });
  } catch (error) {
    console.error(`Error playing ${soundName} sound:`, error);
  }
}

/**
 * Apply audio settings to all audio elements
 */
export function applyAudioSettings(volume, isMuted) {
  Object.values(audioElements).forEach(audio => {
    audio.volume = volume / 100;
    audio.muted = isMuted;
  });
}

/**
 * Preload all audio elements to reduce latency
 */
export function preloadAudio() {
  Object.values(audioElements).forEach(audio => {
    audio.preload = 'auto';
    audio.load();
  });
}

/**
 * Create a test tone for audio debugging
 */
export function playTestSound() {
  try {
    // Create a temporary audio context for testing
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = 0.1; // Low volume
    oscillator.start();
    
    // Stop after 0.5 seconds
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Error playing test sound:', error);
    return false;
  }
}

// Initialize with default settings on module load
initializeAudio();
