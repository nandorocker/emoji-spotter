# To-Do's

## Debug
- [x] Press "l" to restart the same level
- [x] Press "n" to skip to the next level

---

## Mobile

- [ ] Make game responsive
- [x] Optimize on mobile screens

---

## Controls
- [ ] Make it so I can click and drag the emoji list up and down

## Gameplay
### UI Improvements

#### Refine Hints System

- [ ] Make the target emoji's tab appear only after a few seconds (2s)
- [ ] After 5s, make the emoji background pulsate and glow (a little) so the player can see it

#### Overlay system

- [ ] If there's already a message, and another one appears, those are overlapping
- [ ] Make it so they stack, and the new message "bumps" the previous ones up (so the origin point is always the same)

#### Implement Sound Effects

- [x] Add SFX and music
- [ ] Add credits
- [x] Add missing SFX
  - [x] Countdown (mario kart inspired)
- [x] Add mute button directly on header
- [x] Lower default volume

---

### Start Screen

- [ ] Make a proper "start screen"

---

### Practice Mode

- [ ] Create a "Practice Mode"
  - [ ] No Timer
  - [ ] Dropdown to select which categories are enabled/disabled (leftmost category tab)
  - [ ] By default, show only the "Smileys" category
- [ ] Add "Practice Mode" button to start screen

---

### Technical

- [ ] Minify CSS and whatever else
- [ ] Move dependencies to local storage (unpkg sucks)
- [ ] When counting down, either have the tiles in already, or hide everything (including main window)

---  

---


## Done

### To-Do: Implement Level System

#### Phase 1: Core Logic
- [x] Load level config (matches, time, categories).
- [x] Start timer and match tracking per level.
- [x] On success, trigger next level.
- [x] On timeout, trigger Game Over.

#### Phase 2: Transition Display
- [x] Reuse existing countdown UI between levels.
- [x] Add:
  - Next level match goal
  - New category (if any)

#### Phase 3: Category Unlock Logic
- [x] Unlock categories per config order (Smileys → Flags).
- [x] Pull active categories dynamically from config.

#### Phase 4: Config + Debug
- [x] Make all level parameters editable via config.
- [x] Add basic logging/debug info for current level state.

#### Optional Polish
- [x] Show new category icon/name in transition UI.
- [x] Add hooks for tuning or analytics later.

---

## To-Do: Implement Scoring System

### Phase 1: Basic Scoring Framework
- [x] Create `useScoreStore` or integrate scoring into existing game state store.
- [x] Add function to award base points on correct emoji match.
- [x] Add persistent `score` state across levels.

### Phase 2: Speed Tracking
- [x] Start timer when target emoji is revealed.
- [x] Capture time delta on correct match.
- [x] Store delta in state for bonus calculation.

### Phase 3: Accuracy Tracking
- [x] Track number of incorrect taps per emoji prompt.
- [x] Reset error count at start of each prompt.

### Phase 4: Bonus Calculation
- [x] Implement bonus logic using speed delta and mistake count.
- [x] Add category-based bonus mapping (config-driven).
- [x] Add confusable emoji bonus logic (requires static emoji group config).

### Phase 5: Score Update Logic
- [x] Combine base + bonus into total for each correct emoji.
- [x] Update global score accordingly.
- [x] Log or store breakdown (for debugging/analytics).

### Phase 6: Time Penalty
- [x] On incorrect tap, subtract time from level timer.
- [x] Use existing timer mutation (no direct timer manipulation).

### Phase 7: Debug / UI Hook-up
- [x] Expose live score for HUD.
- [x] (Optional) Add a debug log or floating breakdown panel for testing.



### Settings
- [x] Replaces the "pause" screen and shortcut
- [x] Create simple popup window, same style as the initial instructions
  - Title: Settings
  - Close button: Top right
- [x] Add the settings, one at a time:
  - [x] Sound volume: *slider* / mute on/off *toggle*
  - [x] Accessibility: emoji size (small/medium/large) *choice chip*
    - Small: 6 columns
    - Medium: 5 columns
    - Large: 4 columns
    - Tiles always should be sized so they fill the horizontal space available (with proper margins); vertical size must keep the same (or proportional) padding on all sizes
  - [x] Very small credits at the bottom of window

---

# Notes

## Onboarding
- Level progression: maybe it should be more focused on each category first... then you start adding them up. Example:
  - Level 1-2: smileys
  - Level 3-4: people
  - Level 5-8: smileys + people
  etc.
- To avoid confusion, always enable only sequencial ones (1, then 2, then 3, then 1+2+3, etc; never 2+5+8 for example)

## Score updates
- Different bonuses for finishing the level faster
- Add some cool messages ("combo!" "nice one!" etc.) depending on what you do. could tie it to the bonuses.