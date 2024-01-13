document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const stateTurn = document.getElementById('stateTurn');
    const stateResult = document.getElementById('stateResult');
    const settingsContainer = document.getElementById('settings');
    const playerModeSelect = document.getElementById('playerMode');
    const resetButton = document.getElementById('resetButton');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'human'; // Default game mode is Human vs. AI

    // Create the game board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        board.appendChild(cell);
    }

    // Function to handle player moves
    function makeMove(index) {
        if (gameActive && gameBoard[index] === '') {
            gameBoard[index] = currentPlayer;
            updateBoard();
            checkWinner(); 
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            // Update the turn state
            stateTurn.textContent = gameActive ? `Player ${currentPlayer}'s turn` : '';

            if (gameMode === 'human' && currentPlayer === 'O') {
                // AI's turn
                setTimeout(() => makeAIMove(), 500);
            }
        }
    }

    // Function to handle AI moves
    function makeAIMove() {
        const availableMoves = gameBoard.reduce((acc, val, index) => {
            if (val === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        makeMove(availableMoves[randomIndex]);
    }

    // Function to update the visual representation of the board
    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard[index];
        });
    }

    // Function to check for a winner
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                stateResult.textContent = `${gameBoard[a]} wins!`;
                gameActive = false;
                break;
            }
        }
        
        if (!gameBoard.includes('') && gameActive) {
            stateResult.textContent = 'It\'s a draw!';
            gameActive = false;
        }
    }

    
    // Reset game function
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        stateTurn.textContent = `Player ${currentPlayer}'s turn`;
        stateResult.textContent = '';
        updateBoard();
    }

    // Event listener for the reset button
    resetButton.addEventListener('click', resetGame);

    // Event listener for player mode select
    playerModeSelect.addEventListener('change', () => {
        gameMode = playerModeSelect.value;
        resetGame();
        stateTurn.textContent = gameMode === 'human' ? `Player ${currentPlayer}'s turn` : '';
    });

    // Initial turn state
    stateTurn.textContent = `Player ${currentPlayer}'s turn`;
});
