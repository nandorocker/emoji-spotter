# To-Do's

## Task: Implement Wave-Based Emoji Matching System

### Goal  
Introduce a progressively harder wave-based structure where the player must match an increasing number of emojis within a fixed time.

### Phase 1: Core Wave Loop (Basic Functionality)

**Requirements**
- Each wave gives the player 30 seconds to match a target number of emojis.
- Wave targets:
  - Wave 1: 3 emojis
  - Wave 2: 5 emojis
  - Wave 3: 8 emojis
  - Wave 4+: increase by +2 or +3 per wave (configurable).
- If the player fails to match the required number in time, the game ends.
- Use only the first emoji category in Wave 1.
- Matching can be from any emoji in active categories.
- Automatically trigger the next wave after timer ends (or after target is met).
- Timer duration should be configurable (default to 30s).

**Implementation Notes**
- Reuse existing timer logic.
- Reuse existing matching system.
- No UI polish yet; focus on functionality only.

### Phase 2: Category Reveal + Transition Info

**Requirements**
- Add a new emoji category at the start of each new wave, based on existing game-defined order.
- Reuse the existing countdown between waves.
- During countdown, show:
  - How many emojis need to be matched in the upcoming wave.
  - Which new category (if any) is being added.

**Implementation Notes**
- Minimal UI required (can be placeholder text or basic label).
- Example display:  
  `Next Wave: Match 5 emojis in 30 seconds`  
  `New Category: Animals`

### Phase 3: Polish & Tuning

**Scope**
- Visual/UI polish for wave transitions and feedback.
- Tune timing and difficulty based on playtesting.
- Optional: sound or animations for transitions and results.

---

## Combos
- Rethink this feature

## Hints only after a while
- Make the "hint" appear only after a while

## Overlay system
- If there's already a message, and another one appears, those are overlapping
- Make it so they stack, and the new message "bumps" the previous ones up (so the origin point is always the same)

## Sound Effects
- Add SFX and music

## Reverse Mode
- Game describes an emoji (or just uses the name) and you have to find it