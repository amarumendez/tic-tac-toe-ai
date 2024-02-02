document.addEventListener('DOMContentLoaded', () => {
  // HTML Variables
  const board = document.getElementById('board');
  const stateTurn = document.getElementById('stateTurn');
  const stateResult = document.getElementById('stateResult');
  const gameModeSelect = document.getElementById('gameMode');
  const resetButton = document.getElementById('resetButton');

  let currentPlayer = 'X';
  let gameBoard = Array(9).fill('');
  let gameActive = true;
  let gameMode = 'easy'; // Default to easy mode

  // Create the game board with 9 cells making a 3x3 grid
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => makeMove(i));
    board.appendChild(cell);
  }

  // Function to make move on the gameBoard
  function makeMove(index) {
    if (gameActive && gameBoard[index] === '') {
      gameBoard[index] = currentPlayer;
      clickSFX.play();
      updateBoard();
      const winner = checkWinner(gameBoard); // Check for winner after each move

      if (winner !== null) {
        endGame(winner);
      } else {
        if (currentPlayer === 'X') {
          currentPlayer = 'O';
        } else {
          currentPlayer = 'X';
        }

        stateTurn.textContent = `Player ${currentPlayer}'s turn`;

        // Trigger AI move after human move
        if (gameMode === 'easy' && currentPlayer === 'O') {
          setTimeout(() => makeAIMove(), 1000);
        } else if (gameMode === 'medium' && currentPlayer === 'O') {
          setTimeout(() => makeAIMove(), 1000);
        } else if (gameMode === 'hard' && currentPlayer === 'O') {
          setTimeout(() => makeAIMove(), 1000);
        }
      }
    }
  }

  // Function to update the game board using AI move
  const clickSFX = new Audio('sfx/click.wav');

  function makeAIMove() {
    let bestMove;
    if (gameMode === 'easy') {
      bestMove = bestEasyAIMove();
      clickSFX.play();
    } else if (gameMode === 'medium') {
      bestMove = bestMediumAIMove();
      clickSFX.play();
    } else if (gameMode === 'hard') {
      bestMove = bestHardAIMove();
      clickSFX.play();
    }

    if (bestMove !== null) {
      makeMove(bestMove);
      clickSFX.play();
    }
  }

  // Function for best move for Easy AI using Randomization
  function bestEasyAIMove() {
    const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIndex];
    }
    return null;
  }

  function bestMediumAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = currentPlayer; // Make a move
        let score = evaluateMediumAI(gameBoard); // Evaluate the move
        gameBoard[i] = ''; // Undo the move

        if (score > bestScore) {
          bestScore = score; // Update the best score
          bestMove = i; // Update the best move
        }
      }
    }
    return bestMove;
  }

  function evaluateMediumAI(board) {
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

  // Function for best move for hard AI using minimax algorithm
  function bestHardAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = currentPlayer;
        let score = minimax(gameBoard, 3, false);
        gameBoard[i] = '';

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  // Minimax algorithm with alpha-beta pruning
  function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    const winner = checkWinner(board);

    // Terminal state evaluation
    if (winner !== null || depth === 0) {
      return evaluateHardAI(board, currentPlayer);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          const newBoard = [...board];
          newBoard[i] = currentPlayer;
          const eval = minimax(newBoard, depth - 1, false, alpha, beta);
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) break; // Beta cutoff
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          const newBoard = [...board];
          newBoard[i] = currentPlayer === 'X' ? 'O' : 'X';
          const eval = minimax(newBoard, depth - 1, true, alpha, beta);
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) break; // Alpha cutoff
        }
      }
      return minEval;
    }
  }

  // Function for evaluating the board for hard AI
  function evaluateHardAI(board, player) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] === player) {
          // AI wins
          return 100;
        } else {
          // Opponent wins
          return -100;
        }
      }
    }

    if (!board.includes('')) {
      // Draw
      return 0;
    }

    let score = 0;

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const line = [board[a], board[b], board[c]];

      const countPlayer = line.filter(cell => cell === player).length;
      const countOpponent = line.filter(cell => cell !== player && cell !== '').length;

      // Score based on player's positions
      score += countPlayer * countPlayer;
      score -= countOpponent * countOpponent;
    }

    return score;
  }

  // Function to update the board with the current game state
  function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      cell.textContent = gameBoard[index];
    });
  }

  // Function to check for win patterns & ties
  function checkWinner(board) {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winner
      }
    }

    if (!board.includes('')) {
      return 'draw'; // Return draw if no winner and board is full
    }

    return null; // Return null if no winner and board is not full
  }

  // Function to end the game
  function endGame(winner) {
    gameActive = false;
    if (winner === 'draw') {
      stateResult.textContent = 'It\'s a draw!';
      stateTurn.style.display = 'none';
    } else {
      stateResult.textContent = `${winner} wins!`;
      stateTurn.style.display = 'none';
    }
  }

  // Resets the gameBoard & Score
  function resetGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    stateTurn.style.display = 'block';
    stateTurn.textContent = `Player ${currentPlayer}'s turn`;
    stateResult.textContent = '';
    updateBoard();
  }

  resetButton.addEventListener('click', resetGame);

  gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    resetGame();
    if (gameMode === 'easy' || gameMode === 'medium' || gameMode === 'hard') {
      stateTurn.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === 'twoPlayers') {
      stateTurn.textContent = `Player ${currentPlayer}'s turn`;
    } else {
      stateTurn.textContent = '';
    }
  });
  stateTurn.textContent = `Player ${currentPlayer}'s turn`;

});
