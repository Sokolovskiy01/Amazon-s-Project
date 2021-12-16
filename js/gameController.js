const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;

const TILE_SIZE = 50;
const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
const WHITE = 0;
const BLACK = 1;
const EMPTY = -1;
const QUEEN = 2;

const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;

let сanvas;
let amazonCtx;
let currentTeamText;
let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let board;
let currentTeam;

let curX;
let curY;

let whiteCasualities;
let blackCasualities;

let whiteVictories;
let blackVictories;

const piecesCharacters = {
    0: '♕',
    1: 'x'
};

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    сanvas = document.getElementById("chessCanvas");
    amazonCtx = chessCanvas.getContext("2d");
    сanvas.addEventListener("click", onClick);

    currentTeamText = document.getElementById("currentTeamText");

    whiteCasualitiesText = document.getElementById("whiteCasualities");
    blackCasualitiesText = document.getElementById("blackCasualities");

    totalVictoriesText = document.getElementById("totalVictories");
    whiteVictories = 0;
    blackVictories = 0;
    
    startGame();
}

function startGame() {    
    board = new Board();
    curX = -1;
    curY = -1;

    currentTeam = WHITE;
    currentTeamText.textContent = "White's turn";

    whiteCasualities = [0];
    blackCasualities = [0];

    //new fun repaintBoard()
    //new fun updateWhiteCasualities()
    //new fun updateBlackCasualities()
}

function onClick(event) {
    let chessCanvasX = chessCanvas.getBoundingClientRect().left;
    let chessCanvasY = chessCanvas.getBoundingClientRect().top;

    let x = Math.floor((event.clientX-chessCanvasX)/TILE_SIZE);
    let y = Math.floor((event.clientY-chessCanvasY)/TILE_SIZE);

    if (checkValidMovement(x, y) === true) {
        if (checkValidCapture(x, y) === true) {
            /////////////////////////////////////////
            startGame();
        }
        changeCurrentTeam();
    } else {
        curX = x;
        curY = y;
    }
    //repaintBoard();
}

function checkValidMovement(x, y) {
    if (board.validMoves[y][x] === VALID || board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function checkValidCapture(x, y) {
    if (board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function changeCurrentTeam() {
    if (currentTeam === WHITE) {
        currentTeamText.textContent = "Black's turn";
        currentTeam = BLACK;
    } else {
        currentTeamText.textContent = "White's turn";
        currentTeam = WHITE;
    }
}

class Board {
    constructor() {
        this.tiles = [];

        this.tiles.push([
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, BLACK),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, BLACK),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY)
        ]);

        for (let i = 0; i < 2; i++) {
            this.tiles.push([
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY)
            ]);
        }

        this.tiles.push([
            new Tile(QUEEN, BLACK),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, BLACK)
        ]);

        for (let i = 0; i < 2; i++) {
            this.tiles.push([
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY)
            ]);
        }

        this.tiles.push([
            new Tile(QUEEN, WHITE),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, WHITE)
        ]);

        for (let i = 0; i < 2; i++) {
            this.tiles.push([
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY)
            ]);
        }

        this.tiles.push([
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, WHITE),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(QUEEN, WHITE),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY),
            new Tile(EMPTY, EMPTY)
        ]);

        this.validMoves = [];
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            this.validMoves.push([
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID
            ]);
        }
    }

    resetValidMoves() {
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                this.validMoves[i][j] = INVALID;
            }
        }
    }
}

class Tile {
    constructor(pieceType, team) {
        this.pieceType = pieceType;
        this.team = team;
    }
}