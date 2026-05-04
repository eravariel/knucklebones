// ========== GAME STATE ==========
const gameState = {
    currentPlayer: 1, // 1 or 2
    gameOver: false,
    currentRoll: null,
    rollPlaced: false,
    boards: {
        1: [[], [], []], // 3 columns, each with array of dice values
        2: [[], [], []]
    },
    scores: {
        1: 0,
        2: 0
    }
};

// ========== INITIALIZATION ==========
function initGame() {
    // Create board columns for both players
    createBoardColumns('player1-board', 1);
    createBoardColumns('player2-board', 2);
    updateDisplay();
}

function createBoardColumns(boardId, player) {
    const board = document.getElementById(boardId);
    board.innerHTML = '';
    
    for (let col = 0; col < 3; col++) {
        const column = document.createElement('div');
        column.className = 'column';
        column.id = `player${player}-col${col}`;
        column.onclick = () => placeDice(player, col);
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'column-score';
        scoreDisplay.textContent = '0';
        scoreDisplay.id = `score-player${player}-col${col}`;
        
        column.appendChild(scoreDisplay);
        board.appendChild(column);
    }
}

// ========== DICE ROLLING ==========
function rollDice() {
    if (gameState.gameOver) return;
    if (gameState.rollPlaced) return;
    
    gameState.currentRoll = Math.floor(Math.random() * 6) + 1;
    gameState.rollPlaced = false;
    updateDisplay();
}

// ========== PLACE DICE ==========
function placeDice(player, columnIndex) {
    // Validate placement
    if (gameState.gameOver) return;
    if (gameState.currentRoll === null) return;
    if (gameState.currentPlayer !== player) return;
    if (gameState.rollPlaced) return;
    
    const column = gameState.boards[player][columnIndex];
    
    // Check if column is full (3 dice max)
    if (column.length >= 3) return;
    
    // Place the die
    column.push(gameState.currentRoll);
    gameState.rollPlaced = true;
    
    // Destroy opponent's dice with same value in same column
    const opponent = player === 1 ? 2 : 1;
    destroyOpponentDice(opponent, columnIndex, gameState.currentRoll);
    
    // Update display
    updateDisplay();
    
    // Check if board is full
    const isFull = checkBoardFull(player);
    
    if (isFull) {
        endGame();
    } else {
        // Switch turn
        gameState.currentPlayer = opponent;
        gameState.currentRoll = null;
    }
    
    updateDisplay();
}

// ========== DESTROY OPPONENT DICE ==========
function destroyOpponentDice(opponent, columnIndex, dieValue) {
    const opponentColumn = gameState.boards[opponent][columnIndex];
    
    // Remove all dice with same value
    gameState.boards[opponent][columnIndex] = opponentColumn.filter(die => die !== dieValue);
}

// ========== CHECK BOARD FULL ==========
function checkBoardFull(player) {
    const totalDice = gameState.boards[player].reduce((sum, col) => sum + col.length, 0);
    return totalDice === 9; // 3x3 board
}

// ========== CALCULATE SCORES ==========
function calculateScores() {
    gameState.scores[1] = calculatePlayerScore(1);
    gameState.scores[2] = calculatePlayerScore(2);
}

function calculatePlayerScore(player) {
    let totalScore = 0;
    const boards = gameState.boards[player];
    
    for (let col = 0; col < 3; col++) {
        totalScore += calculateColumnScore(boards[col]);
    }
    
    return totalScore;
}

function calculateColumnScore(column) {
    if (column.length === 0) return 0;
    
    let score = 0;
    
    // Count occurrences of each die value
    const diceCount = {};
    for (let die of column) {
        diceCount[die] = (diceCount[die] || 0) + 1;
    }
    
    // Calculate score with multipliers
    for (let die of column) {
        const count = diceCount[die];
        score += die * (count * count); // Multiplier is count squared
    }
    
    return score;
}

// ========== END GAME ==========
function endGame() {
    gameState.gameOver = true;
    calculateScores();
    
    const player1Score = gameState.scores[1];
    const player2Score = gameState.scores[2];
    
    let message = '';
    if (player1Score > player2Score) {
        message = `🏆 Player 1 Wins! (${player1Score} vs ${player2Score})`;
    } else if (player2Score > player1Score) {
        message = `🏆 Player 2 Wins! (${player2Score} vs ${player1Score})`;
    } else {
        message = `⚔️ Tie Game! (${player1Score} - ${player2Score})`;
    }
    
    document.getElementById('game-status').textContent = message;
}

// ========== RESET GAME ==========
function resetGame() {
    gameState.currentPlayer = 1;
    gameState.gameOver = false;
    gameState.currentRoll = null;
    gameState.rollPlaced = false;
    gameState.boards = {
        1: [[], [], []],
        2: [[], [], []]
    };
    gameState.scores = {
        1: 0,
        2: 0
    };
    
    document.getElementById('game-status').textContent = '';
    initGame();
}

// ========== UPDATE DISPLAY ==========
function updateDisplay() {
    // Update scores
    calculateScores();
    document.getElementById('player1-score').textContent = gameState.scores[1];
    document.getElementById('player2-score').textContent = gameState.scores[2];
    
    // Update current turn
    const turnText = gameState.currentPlayer === 1 ? "Player 1's Turn" : "Player 2's Turn";
    document.getElementById('current-turn').textContent = turnText;
    
    // Update rolled dice display
    const rollDisplay = gameState.currentRoll === null ? '-' : gameState.currentRoll;
    document.getElementById('rolled-dice').textContent = rollDisplay;
    
    // Update roll button state
    const rollButton = document.getElementById('roll-button');
    rollButton.disabled = gameState.rollPlaced || gameState.gameOver;
    
    // Render both boards
    renderBoard(1);
    renderBoard(2);
    
    // Update column scores
    updateColumnScores(1);
    updateColumnScores(2);
}

// ========== RENDER BOARD ==========
function renderBoard(player) {
    const boardId = `player${player}-board`;
    const board = document.getElementById(boardId);
    
    for (let col = 0; col < 3; col++) {
        const columnElement = document.getElementById(`player${player}-col${col}`);
        const column = gameState.boards[player][col];
        
        // Clear dice (but keep score display)
        const scoreDisplay = columnElement.querySelector('.column-score');
        columnElement.innerHTML = '';
        columnElement.appendChild(scoreDisplay);
        
        // Add dice
        for (let die of column) {
            const dieElement = document.createElement('div');
            dieElement.className = `die value-${die}`;
            dieElement.textContent = die;
            columnElement.appendChild(dieElement);
        }
        
        // Update column appearance
        if (column.length >= 3) {
            columnElement.classList.add('full');
        } else {
            columnElement.classList.remove('full');
        }
    }
}

// ========== UPDATE COLUMN SCORES ==========
function updateColumnScores(player) {
    for (let col = 0; col < 3; col++) {
        const column = gameState.boards[player][col];
        const score = calculateColumnScore(column);
        const scoreDisplay = document.getElementById(`score-player${player}-col${col}`);
        scoreDisplay.textContent = score;
    }
}

// ========== START THE GAME ==========
window.addEventListener('DOMContentLoaded', initGame);
