# To-Do's

## Debug
- [x] Press "l" to restart the same level
- [x] Press "n" to skip to the next level

---

## Mobile

- [ ] Make game responsive
- [ ] Optimize on mobile screens

---

## Controls
- [ ] Make it so I can click and drag the emoji list up and down

## Gameplay
### Level System

## To-Do: Implement Level System

### Phase 1: Core Logic
- [ ] Load level config (matches, time, categories).
- [ ] Start timer and match tracking per level.
- [ ] On success, trigger next level.
- [ ] On timeout, trigger Game Over.

### Phase 2: Transition Display
- [ ] Reuse existing countdown UI between levels.
- [ ] Add:
  - Next level match goal
  - New category (if any)

### Phase 3: Category Unlock Logic
- [ ] Unlock categories per config order (Smileys → Flags).
- [ ] Pull active categories dynamically from config.

### Phase 4: Config + Debug
- [ ] Make all level parameters editable via config.
- [ ] Add basic logging/debug info for current level state.

### Optional Polish
- [ ] Show new category icon/name in transition UI.
- [ ] Add hooks for tuning or analytics later.

---

## To-Do: Implement Scoring System

### Base
- [ ] +20 points per correct emoji match.

### Bonuses
- [ ] Speed bonus based on time-to-match.
- [ ] Accuracy bonus if correct on first tap.
- [ ] Category bonus (e.g. Flags, Symbols).
- [ ] Confusable emoji bonus (first-try only).

### Penalties
- [ ] -5 seconds per incorrect tap.

### Config
- [ ] All bonus thresholds and values configurable.
- [ ] Define bonus values per category.
- [ ] Maintain list of confusable emoji sets.

### Optional
- [ ] Add score breakdown for debugging or UI display.
- [ ] Add hooks for analytics/events if needed later.

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

## UI Improvements

### Hints System
- [ ] Make the target emoji's tab appear only after a few seconds (2s)
- [ ] After 5s, make the emoji background pulsate and glow a little and flash VERY mildly

### Overlay system
- [ ] If there's already a message, and another one appears, those are overlapping
- [ ] Make it so they stack, and the new message "bumps" the previous ones up (so the origin point is always the same)

### Settings
- [ ] Accessibility: emoji size (small/medium/large)

---

## Sound Effects
- [ ] Add SFX and music

---

# Notes

## Onboarding
- Level progression: maybe it should be more focused on each category first... then you start adding them up. Example:
  - Level 1-2: smileys
  - Level 3-4: people
  - Level 5-8: smileys + people
  etc.
- To avoid confusion, always enable only sequencial ones (1, then 2, then 3, then 1+2+3, etc; never 2+5+8 for example)