# To-Do's

## To-Do: Implement Level System

### Phase 1: Core Level Loop

- [x] Create a level config structure with:
  - required matches
  - time limit
  - active categories (count)
  - new category introduced
- [x] Set up game loop to:
  - Load level parameters
  - Track matches
  - Advance to next level after success
  - Trigger game over if time runs out
- [x] Use default time = 45s unless overridden

### Phase 2: Transitions & Feedback

- [ ] Reuse existing countdown animation between levels
- [ ] During countdown, display:
  - Next level match goal
  - New category (if any)
- [ ] Hide category info if no new category is being introduced

### Phase 3: Config-Driven Category Management

- [ ] Categories should unlock in fixed order:
  1. Smileys
  2. People
  3. Animals & Nature
  4. Food & Drink
  5. Activity
  6. Travel & Places
  7. Objects
  8. Symbols
  9. Flags
- [ ] Logic should pull active category list from config based on level number
- [ ] Future: allow categories per level to be set manually (for custom levels)

### Phase 4: Polish & Tuning

- [ ] Optional: add preview of new emoji category (icon or name)
- [ ] Allow tweaks to time/match count via config for tuning
- [ ] Log or debug current level, active categories, and match stats

---

## Score System

### Core Score Logic
- [ ] Base score: +20 points for each correctly matched emoji.

### Speed Bonus
- [ ] Track time between prompt shown and correct match.
- [ ] Apply bonus:
  - <1s → +10 pts
  - 1–3s → +5 pts
  - 3–5s → +2 pts
  - >5s → no bonus

### Accuracy Bonus
- [ ] Count number of incorrect taps before match.
- [ ] If correct match was first tap → +5 bonus.

### Category Bonus
- [ ] Add per-category bonus values (configurable).
- [ ] Apply if current target belongs to a bonus-eligible category:
  - Symbols → +5 pts
  - Flags → +10 pts

### Confusable Emoji Bonus
- [ ] Load list of confusable emoji sets (hardcoded or from config).
- [ ] If matched correctly on first try AND emoji is part of a confusable group → +10 bonus.

### Penalties (Time)
- [ ] Subtract 5 seconds from remaining time for each incorrect tap.

### Config / Balancing
- [ ] Make all bonus/penalty values configurable.
- [ ] Consider making speed bonus thresholds configurable too.

### Optional (Future)
- [ ] Add debug UI showing breakdown of points earned per emoji.
- [ ] Add logging or analytics hooks to track how users earn their points.

---

## Debug
- [ ] Press "l" to restart the same level
- [ ] Press "n" to skip to the next level

## Controls
- [ ] Make it so I can click and drag the emoji list up and down

## Gameplay tweaks
- [ ] After 3 mistakes, move on to the next emoji
- [ ] If I get an emoji within 3 seconds, give me a time bonus of +5 seconds
  - [ ] If I do that 3 times in a row, it's a combo and I get +10 seconds on top

## Score
- set this up better

## Hints only after a while
- [ ] Make the target emoji's tab appear only after a few seconds (2s)
- [ ] After 5s, make the emoji background pulsate and glow a little and flash VERY mildly

## Overlay system
- [ ] If there's already a message, and another one appears, those are overlapping
- [ ] Make it so they stack, and the new message "bumps" the previous ones up (so the origin point is always the same)

## Sound Effects
- [ ] Add SFX and music

## Reverse Mode
- [ ] Game describes an emoji (or just uses the name) and you have to find it

## Accessibility
- [ ] Setting: emoji size (small/medium/large)

## Difficulty
- [ ] Select difficulty at the beginning
- [ ] Easy mode (default):
  - [ ] Hints are on ALL the time
  - [ ] When you get an icon right you get 5 seconds
  - [ ] Level clocks are longer
  - [ ] No Flags **ever**
- [ ] Medium mode:
  - [ ] Tab hints after 3s; emoji hint after 6s
  - [ ] Flags only at a high level
  - [ ] Level clocks are medium
- [ ] Hard mode:
  - [ ] No tab hints ever
  - [ ] All emojis revealed from the start
  - [ ] Level clocks are shortest

---

# Notes

## Onboarding
- Level progression: maybe it should be more focused on each category first... then you start adding them up. Example:
  - Level 1-2: smileys
  - Level 3-4: people
  - Level 5-8: smileys + people
  etc.
- Needs some work to manage cognitive load