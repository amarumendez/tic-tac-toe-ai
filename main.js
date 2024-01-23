document.addEventListener('DOMContentLoaded', () => {
  // HTML Variables
  const board = document.getElementById('board');
  const stateTurn = document.getElementById('stateTurn');
  const stateResult = document.getElementById('stateResult');
  const playerModeSelect = document.getElementById('playerMode');
  const resetButton = document.getElementById('resetButton');

  let currentPlayer = 'X'; // Sets currenplayer to X
  let gameBoard = ['', '', '', '', '', '', '', '', '']; // Gameboard wth 9 empty cells for 3x3 grid
  let gameActive = true; // Sets game activity to true, starting the game
  let gameMode = 'easy'; // Default game mode is Human vs. Easy AI

  // Create the game board with 9 cells making 3x3 grid
  for (let i = 0; i < 9; i++) {
    // create variable for each of the cells
    const cell = document.createElement('div');
    // sets cell class to 'cell'
    cell.classList.add('cell');
    cell.dataset.index = i; // Sets the data-index attribute to the cell index
    cell.addEventListener('click', () => makeMove(i)); // Makes move to the cell by its index
    board.appendChild(cell); // adds a new cell to the board
  }

  // Function to handle player moves
  function makeMove(index) {
    if (gameActive && gameBoard[index] === '') {
      gameBoard[index] = currentPlayer;
      updateBoard(); // Updates the board with the current player's move
      checkWinner(); // Call checkWinner after each move
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switches the current player
      // Update the turn state
      stateTurn.textContent = gameActive ? `Player ${currentPlayer}'s turn` : ''; // Sets the turn state to the current player's turn
      if (gameMode === 'easy' && currentPlayer === 'O') {
        // AI's turn
        setTimeout(() => makeAIMove(), 500); // Delays the ai move by 500 milliseconds
      } else if (gameMode === 'medium' && currentPlayer === 'O') {
        // AI's Turn in Medium Mode
        setTimeout(() => makeAIMove(), 500); // delays the ai move by 500 milliseconds
      }
    }
  }
  // Function to handle AI moves
  function makeAIMove() {
    if (gameMode === 'easy') {
      // Easy AI Move (Randomization)
      const availableMoves = gameBoard.reduce((acc, val, index) => {
        if (val === '') {
          acc.push(index);
        }
        return acc;
      },[]);
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      makeMove(availableMoves[randomIndex]);
      
    } else if (gameMode === 'medium') {
      // Medium AI Move (Heuristics)
      const bestMove = bestMediumAIMove(); // Finds the best move for the Heuristics Medium AI
      makeMove(bestMove.index); 
      
    } else if (gameMode === 'hard') {
      // Hard AI Move (Minimax Algorithm)
      const bestMove = bestHardAIMove();  // Finds the best move for the Minimax Hard AI
      makeMove(bestMove.index);
    }
  }

  // Heuristic function to evaluate the board
  function evaluateMediumAI(board) {
    // Heuristcs Logic 
    // You can assign scores based on the current state of the board
    // Return a higher score for a more favorable board position for the AI
    // Return a lower score for a more favorable board position for the human player
    // Return 0 for neutral positions

    // Example heuristic: Count the number of X's minus the number of O's on the board
    let score = 0;
    for (let cell of board) {
      if (cell === 'X') {
        score++;
      } else if (cell === 'O') {
        score--;
      }
    }
    return score;
  }

  // Function to get the best move using heuristic evaluation
  function bestMediumAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = currentPlayer; // Make a move
        let score = evaluateMediumAI(gameBoard);
        gameBoard[i] = ''; // Undo the move

        if (score > bestScore) {
          bestScore = score; // Update the best score
          bestMove = { index: i }; // Update the best move
        }
      }
    }

    return bestMove;
  }

  // Minimax algorithm for the hard AI
  function minimax(board, depth, isMaximizing) {
    // Implement the minimax algorithm logic here
    // You can use the evaluateMediumAI function to evaluate the board state
    
  }

  // Function to get the best move using the minimax algorithm
  function bestHardAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = currentPlayer;
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = ''; // Undo the move

        if (score > bestScore) {
          bestScore = score;
          bestMove = { index: i };
        }
      }
    }

    return bestMove;
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
    stateTurn.textContent = gameMode === 'easy' ? `Player ${currentPlayer}'s turn` : '';
  });

  // Initial turn state
  stateTurn.textContent = `Player ${currentPlayer}'s turn`;
  
});
