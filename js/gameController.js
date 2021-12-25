const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
const WHITE = 'figure figure-white';
const BLACK = 'figure figure-black';
const EMPTY = -1;
const QUEEN = 2;

const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;

let canvas;
let amazonCtx;

let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let board;

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

let gameType;
let state = 'EMPTY';

function startGame() {
    isMove = false;
    currentTeam = TEAMWHITE;
    currentTeamText = document.getElementById("currentTeamText");
    currentTeamText.textContent = "White's turn";
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
    let gameTable = document.getElementById("gameTable");
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
                var currentI = i;
                let currJ = j;
                return function() { 
                    onCellClicked(i, j);
                }
            })();
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
}

function replaceFigure(i, j) { 
    let tableCellTo = document.getElementById('tb' + i + '_' + j);
    let tableCellFrom = document.getElementById('tb' + currX + '_' + currY);
    if(isMove){
        tableCellTo.innerHTML = tableCellFrom.innerHTML;
        tableCellFrom.innerHTML = "";
        isMove = false;
        changeCurrentTeam();
    }
}

function onCellClicked(i, j) {
    console.log('curr ' + i + ' ' + j + ' '+ isMove);
    let tableCell = document.getElementById('tb' + i + '_' + j);
    let className = tableCell.innerHTML.substring(12, 31);//ask Dima

    if(tableCell.innerHTML != "" && currentTeam == getCurrentTeam(className)){
        isMove = true;
        currX = i;
        currY = j;
    }
    if(tableCell.innerHTML == "" && isMove == true){
        replaceFigure(i, j);
    }
}

function changeCurrentTeam() {
    if (currentTeam === TEAMWHITE) {
        currentTeamText.textContent = "Black's turn";
        currentTeam = TEAMBLACK;
    } else {
        currentTeamText.textContent = "White's turn";
        currentTeam = TEAMWHITE;
    }
}

function getCurrentTeam(figure){
    if(figure == WHITE){
        return TEAMWHITE;
    }else{
        return TEAMBLACK;
    }
}