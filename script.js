const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");
const drawScoreElement = document.getElementById("drawScore");

const PLAYER = "X";
const COMPUTER = "O";

let board = ["", "", "", "", "", "", "", "",];
let gameOver = false;

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);

        if (board[index] !== "" || gameOver) {
            return;
        }

        // Player move
        makeMove(index, PLAYER);

        let result = checkGame();

        if (result) {
            finishGame(result);
            return;
        }

        statusElement.textContent = "Computer is thinking...";

        // Computer move
        setTimeout(() => {
            if (gameOver) return;

            const bestMove = getBestMove();

            makeMove(bestMove, COMPUTER);

            result = checkGame();

            if (result) {
                finishGame(result);
            } else {
                statusElement.textContent = "Your turn! Choose a square.";
            }
        }, 400);
    });
});

function makeMove(index, player) {
    board[index] = player;

    cells[index].textContent = player;
    cells[index].classList.add(player === PLAYER ? "x" : "o");
    cells[index].disabled = true;
}

function checkGame() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return {
                winner: board[a],
                combination: combination
            };
        }
    }

    if (!board.includes("")) {
        return {
            winner: "draw"
        };
    }

    return null;
}

function finishGame(result) {

    gameOver = true;

    if (result.winner === PLAYER) {

        statusElement.textContent = "🎉 You Win!";

        playerScore++;
        playerScoreElement.textContent = playerScore;

        highlightWinner(result.combination);

    } else if (result.winner === COMPUTER) {

        statusElement.textContent = "🤖 Computer Wins!";

        computerScore++;
        computerScoreElement.textContent = computerScore;

        highlightWinner(result.combination);

    } else {

        statusElement.textContent = "🤝 It's a Draw!";

        drawScore++;
        drawScoreElement.textContent = drawScore;
    }
}

function highlightWinner(combination) {

    combination.forEach(index => {
        cells[index].classList.add("winner");
    });
}


// ================================
// MINIMAX AI
// ================================

function getBestMove() {

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = COMPUTER;

            let score = minimax(board, 0, false);

            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {

    const result = getWinner(board);

    if (result !== null) {

        if (result === COMPUTER) {
            return 10 - depth;
        }

        if (result === PLAYER) {
            return depth - 10;
        }

        if (result === "draw") {
            return 0;
        }
    }

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {

            if (board[i] === "") {

                board[i] = COMPUTER;

                const score = minimax(board, depth + 1, false);

                board[i] = "";

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {

            if (board[i] === "") {

                board[i] = PLAYER;

                const score = minimax(board, depth + 1, true);

                board[i] = "";

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}

function getWinner(currentBoard) {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            currentBoard[a] !== "" &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[a] === currentBoard[c]
        ) {
            return currentBoard[a];
        }
    }

    if (!currentBoard.includes("")) {
        return "draw";
    }

    return null;
}


// ================================
// RESTART GAME
// ================================

restartBtn.addEventListener("click", restartGame);

function restartGame() {

    board = ["", "", "", "", "", "", "", "",];
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("x", "o", "winner");
    });

    statusElement.textContent = "Your turn! Choose a square.";
}