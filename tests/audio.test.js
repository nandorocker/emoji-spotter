import { playSound, applyAudioSettings, preloadAudio } from '../src/audio.js';

describe('Audio Functions', () => {
  let mockAudioElements;
  
  beforeEach(() => {
    // Mock audio elements
    mockAudioElements = {
      correct: { 
        play: jest.fn().mockResolvedValue(),
        volume: 0,
        muted: false
      },
      incorrect: {
        play: jest.fn().mockResolvedValue(),
        volume: 0,
        muted: false
      }
    };
  });

  test('playSound calls play on the correct audio element', () => {
    playSound('correct', mockAudioElements);
    expect(mockAudioElements.correct.play).toHaveBeenCalled();
  });

  test('playSound handles non-existent sound names', () => {
    console.error = jest.fn();
    playSound('nonexistent', mockAudioElements);
    expect(console.error).toHaveBeenCalled();
  });

  test('applyAudioSettings sets volume and muted correctly', () => {
    applyAudioSettings(50, true, mockAudioElements);
    
    Object.values(mockAudioElements).forEach(audio => {
      expect(audio.volume).toBe(0.5);
      expect(audio.muted).toBe(true);
    });
  });

  test('preloadAudio sets preload attribute and calls load', () => {
    // Add load method to mocks
    Object.values(mockAudioElements).forEach(audio => {
      audio.load = jest.fn();
    });
    
    preloadAudio(mockAudioElements);
    
    Object.values(mockAudioElements).forEach(audio => {
      expect(audio.preload).toBe('auto');
      expect(audio.load).toHaveBeenCalled();
    });
  });
});
