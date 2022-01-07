const UIStage = Object.freeze({ STAGE_PLAYERS: 'mainSelector', STAGE_PROPERTIES: 'gamePropertiesSelector', STAGE_GAME: 'gameBlock' });

let currentStage = UIStage.STAGE_PLAYERS;

function setStage(stage) {
    aimateUIElements(currentStage, stage);
    currentStage = stage;
}

function aimateUIElements(stageFrom, stageTo) {
    let disappearElement = document.getElementById(stageFrom);
    let appearElement = document.getElementById(stageTo);
    disappearElement.classList.remove('item-appear');
    disappearElement.classList.add('item-disappear');
    appearElement.classList.remove('item-disappear');
    appearElement.classList.remove('non-shown');
    appearElement.classList.add('item-appear');
}