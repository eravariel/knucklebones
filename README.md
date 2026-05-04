# 🎲 Knucklebones - D&D Edition

A beautiful, D&D-themed web implementation of the Knucklebones dice game from Cult of the Lamb.

## About the Game

Knucklebones is a strategic dice game where two players compete to fill their 3x3 boards with dice, earning points through combos and strategic placements. Destroy your opponent's high-scoring combinations while building your own!

## Features

- 🎮 **Two-player gameplay** - Perfect for D&D campaigns
- 🎲 **Real-time dice rolling** - One die per turn
- 💰 **Dynamic scoring system** - Combos multiply your points
- ⚔️ **Destruction mechanic** - Remove opponent's dice to sabotage their score
- 🎨 **D&D-themed aesthetics** - Medieval fantasy styling
- 📱 **Responsive design** - Works on desktop and mobile

## How to Play

1. Open `index.html` in your web browser
2. Players take turns rolling a single die
3. Place the die in any non-full column on your board
4. When you place a die, all dice with the same value in the opponent's corresponding column are destroyed
5. The game ends when either player fills their entire 3x3 board
6. **Highest score wins!**

## Scoring Rules

When you have multiple dice of the same value in a column, they multiply!

**Formula:** `die_value × (count²)`

**Example:** A column with `4-1-4` scores:
- The two 4s: `4 × 2² = 16` points
- The one 1: `1 × 1² = 1` point
- **Total: 17 points**

See `rules.txt` for the complete scoring table.

## Files

- `index.html` - Game board interface
- `style.css` - D&D-themed styling
- `game.js` - Game logic and mechanics
- `rules.txt` - Complete game rules

## How to Share

To play with a friend in Discord:

1. **Host the files** on a web server (GitHub Pages, Vercel, or any hosting service)
2. **Share the link** in Discord
3. **Screen share** while playing, or open the link on separate devices

## Future Enhancements

- 🤖 Discord bot integration for easy game creation
- 💾 Save/load game states
- 🎯 AI opponent for single-player
- 🏆 Leaderboard tracking
- ✨ Additional visual effects and animations

## Rules Reference

Full rules are available in `rules.txt`. Key mechanics:

- **3 columns** per player, **3 dice maximum** per column
- **One die** rolled per turn (6-sided)
- **Matching dice multiply** in value within a column
- **Destruction:** Placing a die removes all matching-value dice from opponent's column
- **Win condition:** First to fill their board with the highest score wins

---

Built with ❤️ for D&D campaigns and tabletop adventures.
