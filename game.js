'use strict';

let cells = document.querySelectorAll('td');
let newGame_button = document.querySelector('.newGame').addEventListener('click', newGame);
let resources_button = document.querySelector('.toggleResources');
let resources = document.querySelector('#resources');
resources_button.addEventListener('click', toggleResources);

let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

let myMove = false;

function toggleResources(){
  resources.classList.toggle('hidden')
}

function getWinner(board) {

    let vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];

        var diagonalComplete1 = true;
        var diagonalComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonalComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagonalComplete2 = false;
            }
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonalComplete1 || diagonalComplete2) {
            return value ? 1 : 0;
        }
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}

function updateMove() {
    updateCells();
    var winner = getWinner(board);
    document.querySelector('h1').textContent = (winner == 1 ? "AI Won!" : winner == 0 ? "You Won!" : winner == -1 ? "Tie!" : "");
    document.querySelector('h2').textContent = (myMove ? "AI's Move" : "Your move");
}

function updateCells() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          let cell = document.querySelector('#c' + i + "" + j);
          cell.textContent = (board[i][j] == false ? "x" : board[i][j] == true ? "o" : "");
        }
    }
}

let numNodes = 0;

function recurseMinimax(board, player) {
    numNodes++;
    var winner = getWinner(board);
    if (winner != null) {
        switch(winner) {
            case 1:
                return [1, board]
            case 0:
                return [-1, board]
            case -1:
                return [0, board];
        }
    } else {
        var nextVal = null;
        var nextBoard = null;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    board[i][j] = player;
                    var value = recurseMinimax(board, !player)[0];
                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}

function makeMove() {
    board = minimaxMove(board);
    myMove = false;
    updateMove();
}

function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}

if (myMove) {
    makeMove();
}

function getCells(){
  return document.querySelectorAll('td');
}

function addEventToCells(){
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', playerClick);
  }
}

function playerClick(event){
  event.preventDefault();
  if (document.querySelector('h1').textContent) {
    return;
  }
  let cell = event.target.id;
  let row = parseInt(cell[1]);
  let col = parseInt(cell[2]);
  if (!myMove) {
    board[row][col] = false;
    myMove = true;
    updateMove();
    makeMove();
  }
  localStorageHandler.saveGameState(board);
}

function newGame(){
  localStorage.clear();
  board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
  ];
  myMove = false;
  updateMove();
  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
  }
}

function loadGame(){
  try {
    myMove = false;
    board = localStorageHandler.loadGameState();
    updateCells();
  } catch (e){
    newGame();
  }
}

function init(){
  addEventToCells();
  loadGame();
  updateMove();
}

init();
