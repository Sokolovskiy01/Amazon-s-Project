const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
const WHITE = 'figure figure-white';
const BLACK = 'figure figure-black';
const WHITE_LOG = '&#x2656;';
const BLACK_LOG = '&#x265C;';

const CellState = Object.freeze({ EMPTY: -1, ARROW: 1, QUEEN: 2 , CAPTURE: 3});
const GameMode = Object.freeze({ PLAYER: 0, AI: 1});
let selectedGameMode;

const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;

let whiteCasualitiesText;
let blackCasualitiesText;
let totalVictoriesText;

let whiteCasualities;
let blackCasualities;

let whiteVictories;
let blackVictories;

let isMove;
let isShoot;
let isBotMove;
let currX;
let currY;
let currentTeam;
let currentPossibleWays;
let whiteCaptured;
let blackCaptured;
let MaxFigurePerTeam;
const TEAMWHITE = 0;
const TEAMBLACK = 1;
let currentTeamText;
let gameTable;
let gameLog;
let highlightedCell;

let gameType;
let state = 'EMPTY';
let startValidMove;
let stopValidMove;
let boardHeight;
let boardWidth;

function selectGameMode(mode) {
    selectedGameMode = mode;
    setStage(UIStage.STAGE_PROPERTIES);
}

function getBoardHeight() {
    return boardHeight;
}

function getBoardWidth() {
    return boardWidth;
}

function startGame() {
    isMove = false;
    isShoot = false;
    isBotMove = false;
    currentPossibleWays = 0;
    whiteCaptured = 0;
    blackCaptured = 0;
    currentTeam = TEAMWHITE;
    currentTeamText = document.getElementById("currentTeamText");
    currentTeamText.textContent = "White's turn";
    gameTable = document.getElementById("gameTable");
    gameTable.classList.add('tabble-white-turn');
    gameLog = document.getElementById('gameLog');
    gameLog.value = "";
    gameType = document.gameChoiceForm.gameMode.value;
    MaxFigurePerTeam = gameType;
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
    drawFieldMarks(boardHeight, boardWidth);
    setStage(UIStage.STAGE_GAME);
}

function createField(width, height) {
    boardHeight = height;
    boardWidth = width;
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

function replaceFigure(i, j, currX1, currY1) { 
    let tableCellTo = document.getElementById('tb' + i + '_' + j);
    let tableCellFrom = document.getElementById('tb' + currX1 + '_' + currY1);
    if(isMove || isBotMove){
        tableCellTo.innerHTML = tableCellFrom.innerHTML;
        tableCellTo.dataset.state = CellState.QUEEN;
        tableCellFrom.innerHTML = "";
        tableCellFrom.dataset.state = CellState.EMPTY;
        isMove = false;
        isShoot = true;
        logMove(currX1, currY1, i, j);
        currX = i;
        currY = j;
        highlightCurrentFigure();
        showPossibleFigureMoves();
    }
}

function makeShoot(i, j){
    let tableCell = document.getElementById('tb' + i + '_' + j);
    let arrowFigure = document.createElement('div');
    arrowFigure.className = 'figure figure-arrow';
    tableCell.append(arrowFigure);
    tableCell.dataset.state = CellState.ARROW;
    isShoot = false;
    deHighlightFigure();
    stopShowPossibleFigureMoves();
    logShot(i, j);
    changeCurrentTeam();
}

function onCellClicked(i, j) {
    let tableCell = document.getElementById('tb' + i + '_' + j);
    let className = "";
    if(tableCell.dataset.state != CellState.EMPTY) className = tableCell.childNodes[0].className;

    if(tableCell.dataset.state != CellState.EMPTY && currentTeam == getCurrentTeam(className) && tableCell.dataset.state != CellState.ARROW && isShoot == false && tableCell.dataset.state != CellState.CAPTURE){
        isMove = true;
        currX = i;
        currY = j;
        highlightCurrentFigure();
        showPossibleFigureMoves();
        if(isCapture()){
            tableCell.dataset.state = CellState.CAPTURE;
            if (getCurrentTeam(className) == TEAMWHITE) whiteCaptured++;
            else blackCaptured++;
        }
    }
    if(tableCell.dataset.state == CellState.EMPTY && isMove == true && isShoot == false && checkValidMovement(i, j, currX, currY)){
        replaceFigure(i, j, currX, currY);
    }
    if(tableCell.dataset.state == CellState.EMPTY && isShoot == true  && checkValidMovement(i, j, currX, currY)){
        makeShoot(i, j);
    }
    isEnd();
}

function checkValidMovement(i, j, currX1, currY1){ 
    if(isShoot == true || isMove == true || isBotMove == true) {
        //vertical/horizontal
        if(currX1 == i || currY1 == j) {
            if(currX1 == i){
                getStartStopMovement(currY1, j);
                return validHorVerMovement(i, null);
            }else if(currY1 == j){
                getStartStopMovement(currX1, i);
                return validHorVerMovement(null, j);
            }
        }//cross up right
        else if(currX1 > i && currY1 < j) {
            return validCrossMovement(i, j, true, false, true, currX1, currY1);
        //cross up left
        }else if(currX1 > i && currY1 > j){
            return validCrossMovement(i, j, true, false, false, currX1, currY1);
        //cross down right    
        }else if(currX1 < i && currY1 < j){
            return validCrossMovement(i, j, false, true, true, currX1, currY1);
        //cross down left
        }else if(currX1 < i && currY1 > j) {
            return validCrossMovement(i, j, false, true, false, currX1, currY1);
        }
    }
    return false;
}
function validCrossMovement(i, j, isBigger, opX, opY, currX1, currY1){
    var x;
    if(isBigger) x = currX1 - i; //diff
    else x = i - currX1;
    
    for(let b = 1; b < x; b++){
        let tableCell;
        if(!opX && opY) tableCell = document.getElementById('tb' + (currX1-b) + '_' + (currY1+b));
        else if(!opX && !opY) tableCell = document.getElementById('tb' + (currX1-b) + '_' + (currY1-b));
        else if(opX && opY) tableCell = document.getElementById('tb' + (currX1+b) + '_' + (currY1+b));
        else if(opX && !opY) tableCell = document.getElementById('tb' + (currX1+b) + '_' + (currY1-b));
        else return false;

        if(tableCell == null){
            return false;
        }

        if(tableCell.dataset.state == CellState.ARROW || tableCell.dataset.state == CellState.QUEEN){
            return false;
        }
    }
    if(currY1 + x == j || currY1 - x == j) return true;
}

function validHorVerMovement(i , j){
    for(let b = startValidMove; b < stopValidMove; b++){
        let tableCell;
        if(i != null){tableCell = document.getElementById('tb' + i + '_' + b); }
        else {tableCell = document.getElementById('tb' + b + '_' + j); }

        if(tableCell.dataset.state == CellState.ARROW || tableCell.dataset.state == CellState.QUEEN){
            return false;
        }
    }
    return true;
}

function getStartStopMovement(a, b){
    if(a > b){
        startValidMove = b + 1;
        stopValidMove = a;
    }else{
        startValidMove = a + 1;
        stopValidMove = b;
    }
}

function highlightCurrentFigure() {
    if (highlightedCell != undefined) {
        deHighlightFigure();
        stopShowPossibleFigureMoves();
    }
    let tableCell = document.getElementById('tb' + currX + '_' + currY);
    tableCell.classList.add('block-highlight');
    highlightedCell = tableCell;
}

function deHighlightFigure() {
    highlightedCell.classList.remove('block-highlight');
    highlightedCell = undefined;
}

function showPossibleFigureMoves() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let tableCell = document.getElementById('tb' + i + '_' + j);
            if(checkValidMovement(i, j, currX, currY) && tableCell.dataset.state != CellState.QUEEN && tableCell.dataset.state != CellState.ARROW){
                let possibleWay = document.createElement('div');
                possibleWay.className = 'possible-way'
                tableCell.append(possibleWay);
                currentPossibleWays++;
            }
        }
    }
}

function stopShowPossibleFigureMoves() {
    currentPossibleWays = 0;
    let possibleWays = document.getElementsByClassName('possible-way');
    while (possibleWays.length > 0) {
        possibleWays[0].parentNode.removeChild(possibleWays[0]);
    }
}

function changeCurrentTeam() {
    if (currentTeam === TEAMWHITE) {
        currentTeamText.textContent = "Black's turn";
        gameTable.classList.remove('tabble-white-turn');
        gameTable.classList.add('table-black-turn');
        currentTeam = TEAMBLACK;
        isBotMove = true;
        if(selectedGameMode == GameMode.AI){
            bot();
        }
        isBotMove = false;
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

function isCapture(){
    if(currentPossibleWays == 0) return true;
    return false;
}

function logMove(fromI, fromJ, toI, toJ) {
    let symbol;
    if (currentTeam == TEAMWHITE) symbol = WHITE_LOG;
    else if (currentTeam == TEAMBLACK) symbol = BLACK_LOG;

    // другого способа нету
    let tmp = document.createElement('span');
    tmp.innerHTML = symbol;

    gameLog.value += tmp.innerHTML + ': ' + '(' +  mapJToLetters(fromJ) + mapIToNumbers(fromI) + ')->(' + mapJToLetters(toJ) + mapIToNumbers(toI) + ')'; 
}

function logShot(i, j) {
    let tmp = document.createElement('span');
    tmp.innerHTML = "&#x1F525";
    gameLog.value += '->' + tmp.innerHTML + '(' + mapJToLetters(j) + mapIToNumbers(i) + ')\n';
}

function isEnd(){
    if(whiteCaptured == MaxFigurePerTeam){
        currentTeamText.textContent = "Black team WIN";
    }else if(blackCaptured == MaxFigurePerTeam){
        currentTeamText.textContent = "White team WIN";
    }
}