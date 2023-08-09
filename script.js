'use strict';

// Player factory function
const Player = (mark) => {
    const token = mark;
    const getToken = () => token;
    return {getToken};
}

// Gameboard module
const gameBoard = (() => {
    const _board = ["", "", "", "", "", "", "", "", "",];

    const getBoard = () => _board;

    const setToken = (e) => {
        const index = e.target.dataset.index;
        _board[index] = gameControl.getActivePlayer().getToken();
    }

    const restart = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = "";
        }
    }

    return {getBoard, setToken, restart};
})();

// Info display and update
const displayControl = (() => {
    // Cache
    const $cells = document.querySelectorAll(".board > div");
    const $button = document.querySelector("#restart");
    const $infoElement = document.querySelector("#info");

    const render = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            $cells[i].textContent = gameBoard.getBoard()[i];
        }
    }

    // Set end-game message
    const setWinnerMessage = (activePlayer) => {
        $infoElement.textContent = `Player ${activePlayer.getToken()} Wins!`;
    }

    const setDrawMessage = () => {
        $infoElement.textContent = `It's a draw!`;
    }

    const setTurnMessage = (activePlayer) => {
        $infoElement.textContent = `Player ${activePlayer.getToken()}'s turn`;
    }

    // Event listeners
    $cells.forEach(elem => {
        elem.addEventListener("click", (e) => {
            gameControl.playRound(e);
        });
    });

    $button.addEventListener("click", () => {
        gameControl.resetGame();
        render();
    });

    return {setTurnMessage, setDrawMessage, setWinnerMessage, render};

})();

// Game logic
const gameControl = (() => {

    let _round = 1;
    let gameOver = false;
    const _players = [];
    _players.push(Player("X"));
    _players.push(Player("O"));

    let _activePlayer = _players[0];
    displayControl.setTurnMessage(_activePlayer);

    // Functions
    const getActivePlayer = () => _activePlayer;

    const updateActivePlayer = () => {
        _activePlayer === _players[0] ? _activePlayer = _players[1] : _activePlayer = _players[0];
    }

    const resetGame = () => {
        gameBoard.restart();
        _round = 1;
        _activePlayer = _players[0];
        displayControl.setTurnMessage(_activePlayer);
        gameOver = false;
    }

    const checkForWinner = () => {
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        for (let i = 0; i <= winningConditions.length - 1; i++) {
            const winCondition = winningConditions[i];
            let a = gameBoard.getBoard()[winCondition[0]];
            let b = gameBoard.getBoard()[winCondition[1]];
            let c = gameBoard.getBoard()[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                return true;
            }
        }
        return false;
    }

    const playRound = (e) => {
        // Set token if game !over and cell is not marked
        if (gameBoard.getBoard()[e.target.dataset.index] === "" && !gameOver) {
            gameBoard.setToken(e);
            displayControl.render();
            // End of game condition
            if (_round === 9) {
                gameBoard.setToken(e);
                displayControl.setDrawMessage();
                gameOver = true;
                return;
            }
            if (checkForWinner() === true) {
                displayControl.setWinnerMessage(_activePlayer);
                gameOver = true;
            } else {
                updateActivePlayer();
                displayControl.setTurnMessage(_activePlayer);
                _round ++;
            }
        }
    }

    return {getActivePlayer, resetGame, playRound};
})();