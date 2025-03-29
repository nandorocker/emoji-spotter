# To-Do's

## Task: Implement Level-Based Emoji Matching System

### Goal
Introduce a level system where players must spot a set number of emojis under time pressure, with increasing complexity across levels via three variables:
- Number of emojis to match
- Time allowed
- Active emoji categories (gradually revealed)

Progression should be flexible and driven by a config file (or equivalent structure), not hardcoded logic.

---

### Phase 1: Core Level Loop (Basic Functionality)

**Requirements**
- Each level has:
  - A target number of emojis to spot
  - A timer (default to 45s)
  - A list of active emoji categories
- Player must complete the required number of matches within the given time.
- If time runs out before meeting the goal → Game Over.
- After completing a level, advance to the next automatically.

**Implementation Notes**
- Reuse existing timer and emoji matching logic.
- Level data should be defined via a config file/structure.
- No UI polish needed in this phase, just basic level flow.
- Timer duration and required matches should be read from config.

---

### Phase 2: Transitions + Category Reveal

**Requirements**
- Between levels, show a transition using the existing countdown animation.
- During countdown, display:
  - How many matches are required in the next level
  - Which new category (if any) is being introduced

**Implementation Notes**
- Categories are unlocked in this specific order:
  1. Smileys  
  2. People  
  3. Animals & Nature  
  4. Food & Drink  
  5. Activity  
  6. Travel & Places  
  7. Objects  
  8. Symbols  
  9. Flags (last)

- Reuse or minimally extend the existing transition UI.
- If no new category is being added, skip that line in the UI.

---

### Phase 3: Polish & Tuning (Future Work)

**Scope**
- Add visual polish to transitions (animations, previews, sound).
- Tweak match counts and timers based on playtesting feedback.
- Consider dynamic modifiers later (decoys, special emojis, etc.)

---

### Level Progression (Levels 1–20)

This table should be implemented as a config file used to drive logic.

| Level | Matches | Time  | Active Categories Count | New Category Introduced | Notes                      |
|-------|---------|-------|--------------------------|--------------------------|----------------------------|
| 1     | 3       | 45s   | 1                        | Smileys                 | Intro                      |
| 2     | 4       | 45s   | 1                        | –                       | Slight bump                |
| 3     | 5       | 45s   | 1                        | –                       | Base mastery               |
| 4     | 3       | 40s   | 2                        | People                  | New visual layer           |
| 5     | 4       | 40s   | 2                        | –                       | Build confidence           |
| 6     | 5       | 35s   | 2                        | –                       | First tension              |
| 7     | 5       | 45s   | 3                        | Animals & Nature        | Complexity expands         |
| 8     | 6       | 45s   | 3                        | –                       |                            |
| 9     | 5       | 35s   | 3                        | –                       | Fast reaction round        |
| 10    | 7       | 40s   | 3                        | –                       | First skill gate           |
| 11    | 4       | 30s   | 4                        | Food & Drink            | Low count, speed challenge |
| 12    | 6       | 45s   | 4                        | –                       | Recovery level             |
| 13    | 7       | 35s   | 5                        | Activity                | High load starts           |
| 14    | 6       | 40s   | 6                        | Travel & Places         | Increasing distractions    |
| 15    | 8       | 45s   | 7                        | Objects                 | Busy screen                |
| 16    | 6       | 30s   | 7                        | –                       | Pressure test              |
| 17    | 9       | 45s   | 7                        | –                       | Mastery checkpoint         |
| 18    | 7       | 40s   | 8                        | Symbols                 | One before final           |
| 19    | 10      | 35s   | 8                        | –                       | Final stretch              |
| 20    | 8       | 45s   | 9                        | Flags                   | Final level, full chaos    |

---

Let us know if more levels are needed or if the config system should support procedural generation in future iterations.


---

## Controls
- [ ] Make it so I can click and drag the emoji list up and down

## Gameplay tweaks
- [ ] After 3 mistakes, move on to the next emoji
- [ ] If I get an emoji within 3 seconds, give me a time bonus of +5 seconds
  - [ ] If I do that 3 times in a row, it's a combo and I get +10 seconds on top

## Combos
- [ ] Rethink this feature

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