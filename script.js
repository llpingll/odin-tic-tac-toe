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
        if (_board[index] !== "") {
            return;
        }
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

    // const updateInfo = () => {

    // }

    // Event listener
    $cells.forEach(elem => {
        elem.addEventListener("click", (e) => {
            gameBoard.setToken(e);
            gameControl.updateActivePlayer();
            render();
        });
    });

    $button.addEventListener("click", () => {
        gameBoard.restart();
        gameControl.resetActivePlayer();
        render();
    });

})();

const gameControl = (() => {
    const _players = [];
    _players.push(Player("X"));
    _players.push(Player("O"));

    let _activePlayer = _players[0];

    const getActivePlayer = () => _activePlayer;
    const updateActivePlayer = () => {
        _activePlayer === _players[0] ? _activePlayer = _players[1] : _activePlayer = _players[0];
    }
    const resetActivePlayer = () => {
        _activePlayer = _players[0];
    }

    return {getActivePlayer, updateActivePlayer, resetActivePlayer};
    // F Toggle active player
    // F 
})();