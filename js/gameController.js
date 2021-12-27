const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
const WHITE = 'figure figure-white';
const BLACK = 'figure figure-black';
const WHITE_LOG = '&#x2656;';
const BLACK_LOG = '&#x265C;';
//const ARROW = "X";
//const EMPTY = -1;
//const QUEEN = 2;

const CellState = Object.freeze({ EMPTY: -1, ARROW: 1, QUEEN: 2 });

const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;

//let canvas;
//let amazonCtx;

let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

//let board;

let whiteCasualities;
let blackCasualities;

let whiteVictories;
let blackVictories;

let isMove;
let isShoot;
let currX;
let currY;
let currentTeam;
const TEAMWHITE = 0;
const TEAMBLACK = 1;
let currentTeamText;
let gameTable;
let gameLog;
let highlightedCell;

let gameType;
let state = 'EMPTY';

function startGame() {
    isMove = false;
    isShoot = false;
    currentTeam = TEAMWHITE;
    currentTeamText = document.getElementById("currentTeamText");
    currentTeamText.textContent = "White's turn";
    gameTable = document.getElementById("gameTable");
    gameTable.classList.add('tabble-white-turn');
    gameLog = document.getElementById('gameLog');
    gameType = document.gameChoiceForm.gameMode.value;
    if (gameType == 2) {
        createField(6, 6);
        placeFigure(0,3, BLACK);
        placeFigure(5,2, BLACK);
        placeFigure(2,0, WHITE);
        placeFigure(3,5, WHITE);
    }
    else if (gameType == 3) {
        createField(8, 8);
        placeFigure(2,0, WHITE);
        placeFigure(0,3, WHITE);
        placeFigure(2,7, WHITE);
        placeFigure(5,0, BLACK);
        placeFigure(7,4, BLACK);
        placeFigure(5,7, BLACK);
    }
    else if (gameType == 4) {
        createField(10, 10);
        placeFigure(9,3, BLACK);
        placeFigure(6,0, BLACK);
        placeFigure(9,6, BLACK);
        placeFigure(6,9, BLACK);
        placeFigure(3,0, WHITE);
        placeFigure(0,3, WHITE);
        placeFigure(0,6, WHITE);
        placeFigure(3,9, WHITE);
    }
}

function createField(width, height) {
    gameTable.innerHTML = "";

    for (let i = 0; i < height; i++) {
        let tableRow = document.createElement("div");
        tableRow.className = 'table-row';
        tableRow.id = 'row' + i;
        for (let j = 0; j < width; j++) {
            let tableBlock = document.createElement("div");
            tableBlock.className = 'table-block';
            tableBlock.id = 'tb' + i + '_' + j;
            tableBlock.onclick = (function() {
                return function() { 
                    onCellClicked(i, j);
                }
            })();
            tableBlock.dataset.state = CellState.EMPTY;
            tableRow.append(tableBlock);
        }
        gameTable.append(tableRow);
    }
}

function placeFigure(i, j, className) {
    let tableCell = document.getElementById('tb' + i + '_' + j);
    tableCell.innerHTML = "";
    let figure = document.createElement('div');
    figure.className = className;
    tableCell.append(figure);
    tableCell.dataset.state = CellState.QUEEN;
}

function replaceFigure(i, j) { 
    let tableCellTo = document.getElementById('tb' + i + '_' + j);
    let tableCellFrom = document.getElementById('tb' + currX + '_' + currY);
    if(isMove){
        tableCellTo.innerHTML = tableCellFrom.innerHTML;
        tableCellTo.dataset.state = CellState.QUEEN;
        tableCellFrom.innerHTML = "";
        tableCellFrom.dataset.state = CellState.EMPTY;
        isMove = false;
        isShoot = true;
        logMove(currX, currY, i, j);
        currX = i;
        currY = j;
        highlightCurrentFigure();
    }
}

function makeShoot(i, j){
    console.log('arrow'+i + ' ' + j + ' ');
    let tableCell = document.getElementById('tb' + i + '_' + j);
    let arrowFigure = document.createElement('div');
    arrowFigure.className = 'figure figure-arrow';
    tableCell.append(arrowFigure);
    tableCell.dataset.state = CellState.ARROW;
    isShoot = false;
    deHighlightFigure();
    changeCurrentTeam();
}

function onCellClicked(i, j) {
    console.log(i + ' ' + j + ' '+ isMove);
    let tableCell = document.getElementById('tb' + i + '_' + j);
    let className = "";
    if(tableCell.innerHTML != "") className = tableCell.childNodes[0].className;

    if(tableCell.innerHTML != "" && currentTeam == getCurrentTeam(className) && tableCell.dataset.state != CellState.ARROW && isShoot == false){
        isMove = true;
        currX = i;
        currY = j;
        highlightCurrentFigure();
    }
    if(tableCell.innerHTML == "" && isMove == true && isShoot == false && checkValidMovement(i, j)){
        replaceFigure(i, j);
    }
    if(tableCell.innerHTML == "" && isShoot == true  && checkValidMovement(i, j)){
        makeShoot(i, j);
    }
}

// TODO: Нужно сделать проверку на препятствие передвижению стрелой
function checkValidMovement(i, j){ 
    if(isShoot == true || isMove == true) {
        if(currX == i || currY == j) return true;
        else if(currX > i) {
            const x = currX - i;
            if(currY + x == j || currY - x == j) return true;
        } else if(currX < i) {
            const x = i - currX;
            if(currY + x == j || currY - x == j) return true;
        }
    }
    return false;
}

function highlightCurrentFigure() {
    if (highlightedCell != undefined) deHighlightFigure();
    let tableCell = document.getElementById('tb' + currX + '_' + currY);
    tableCell.classList.add('block-highlight');
    highlightedCell = tableCell;
}

function deHighlightFigure() {
    highlightedCell.classList.remove('block-highlight');
    highlightedCell = undefined;
}

function showPossibleFigureMoves() {

}

function changeCurrentTeam() {
    if (currentTeam === TEAMWHITE) {
        currentTeamText.textContent = "Black's turn";
        gameTable.classList.remove('tabble-white-turn');
        gameTable.classList.add('table-black-turn');
        currentTeam = TEAMBLACK;
    } else {
        currentTeamText.textContent = "White's turn";
        gameTable.classList.remove('table-black-turn');
        gameTable.classList.add('tabble-white-turn');
        currentTeam = TEAMWHITE;
    }
}

function getCurrentTeam(figure) {
    if(figure == WHITE) {
        return TEAMWHITE;
    } else if(figure == BLACK) {
        return TEAMBLACK;
    }
    return null;
}

function logMove(fromI, fromJ, toI, toJ) {
    let symbol;
    if (currentTeam == TEAMWHITE) symbol = WHITE_LOG;
    else if (currentTeam == TEAMBLACK) symbol = BLACK_LOG;

    // другого способа нету
    let tmp = document.createElement('span');
    tmp.innerHTML = symbol;

    gameLog.value += tmp.innerHTML + ': ' + '(' + fromI + ',' + fromJ + ')->(' + toI + ',' + toJ + ')\n'; 
}

function logShot() {

}