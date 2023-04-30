'use strict';

const Player = (mark) => {
    const token = mark;
    const getToken = () => token;
    return {getToken};
}

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

const displayControl = (() => {
    // Cache DOM
    const $cells = document.querySelectorAll(".board > div");
    const $button = document.querySelector("#restart");
    const $infoElement = document.querySelector("#info");

    // Functions
    const render = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            $cells[i].textContent = gameBoard.getBoard()[i];
        }
    }

    const setWinnerMessage = (activePlayer) => {
        $infoElement.textContent = `Player ${activePlayer.getToken()} Wins!`;
    }

    const setDrawMessage = () => {
        $infoElement.textContent = `It's a draw!`;
    }

    const setTurnMessage = (activePlayer) => {
        $infoElement.textContent = `Player ${activePlayer.getToken()}'s turn`;
    }

    const addCellEvent = () => {
        $cells.forEach(elem => {
            elem.addEventListener("click", (e) => {
                if (gameBoard.getBoard()[e.target.dataset.index] === "") {
                    gameControl.playRound(e);
                    render();
                }
            });
        });
    }

    const removeCellEvent = () => {
        $cells.forEach(elem => {
            elem.removeEventListener("click", () => {});
        });
    }

    $button.addEventListener("click", () => {
        gameControl.resetGame();
        render();
    });

    return {setTurnMessage, addCellEvent, removeCellEvent, setDrawMessage, setWinnerMessage};

})();

const gameControl = (() => {

    let _round = 0;
    const _players = [];
    _players.push(Player("X"));
    _players.push(Player("O"));

    let _activePlayer = _players[0];

    const getActivePlayer = () => _activePlayer;

    const updateActivePlayer = () => {
        _activePlayer === _players[0] ? _activePlayer = _players[1] : _activePlayer = _players[0];
    }

    const resetGame = () => {
        gameBoard.restart();
        _round = 1;
        _activePlayer = _players[0];
        displayControl.setTurnMessage(_activePlayer);
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
        
        for (let i = 0; i <= 7; i++) {
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
        // Run on ititial call
        if (_round === 0) {
            displayControl.addCellEvent();
            displayControl.setTurnMessage(_activePlayer);
            _round ++;
            return;
        }
        // Run if rounds end
        if (_round === 9) {
            gameBoard.setToken(e);
            displayControl.removeCellEvent();
            displayControl.setDrawMessage();
            return;
        }
        // Run if plays available
        if (checkForWinner() === true) {
            displayControl.setWinnerMessage(_activePlayer);
            displayControl.removeCellEvent();
        }
        console.log("!");
        gameBoard.setToken(e);
        updateActivePlayer();
        displayControl.setTurnMessage(_activePlayer);
        _round ++;
    }

    playRound();

    return {getActivePlayer, updateActivePlayer, resetGame, playRound};
})();