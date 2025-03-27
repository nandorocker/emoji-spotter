# Emoji Spotter

A fun web game that tests your ability to quickly find specific emojis. Challenge your emoji recognition skills while racing against the clock!

![Emoji Spotter Game Screenshot](https://placehold.co/600x400?text=Emoji+Spotter+Game)

## 🎮 How to Play

1. You'll be shown a target emoji at the top of the screen
2. Browse through different emoji categories and scroll through the emoji grid
3. Find and click on the matching emoji before the timer runs out
4. Build combos by finding multiple emojis in quick succession
5. Level up and earn extra time as your score increases

## ✨ Features

- **Emoji Challenge**: Test your emoji recognition skills with random emojis from various categories
- **Time Pressure**: Race against the clock to find as many emojis as you can
- **Combo System**: Build combo streaks for bonus points
- **Level Progression**: Level up as you score more points
- **Visual Effects**: Enjoy satisfying animations and feedback when finding emojis
- **Score Sharing**: Share your high scores with friends
- **Responsive Design**: Play on any device with a modern web browser

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/emoji-spotter.git
   cd emoji-spotter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- Node.js and Express for the server
- Particles.js for background effects
- Animate.css for animations

## 📐 Project Structure

- `index.html` - Main game HTML structure
- `styles.css` - CSS styling for the game
- `game.js` - Game logic and functionality
- `appleEmojis.js` - Emoji data organized by categories
- `server.js` - Simple Express server for hosting the game

## 🧪 Game Mechanics

- **Scoring**: Base points increase with level
- **Combo Bonus**: +50% points for combos of 3 or more
- **Quick Combo**: Double points for finding 3+ emojis within 10 seconds
- **Time Penalties**: -2 seconds for wrong selections
- **Time Bonuses**: +5 seconds when leveling up, +1 second for combos over 3

## 🐞 Debug Mode

- Press `d` to toggle debug on/off
- Press `t` to toggle stop timer
- Press `r` to reset the game

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/emoji-spotter/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgements

- Emoji data provided by Apple's emoji set
- Background effects powered by [Particles.js](https://vincentgarreau.com/particles.js/)
- Animations enhanced with [Animate.css](https://animate.style/)

---

Made with ❤️ by nandorocker