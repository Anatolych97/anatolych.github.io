let options = {
    gameArea: document.getElementById('gameArea'),
    controls: document.getElementById('gameControls'),
    colorsCount: +document.getElementById('colors').value,
    fieldSize: +document.getElementById('fieldSize').value,
}

const filler = (function () {


    /* Инициализатор начала игры. Точка входа в модуль */
    function start(options) {

    }



    return {
        start
    }
}());


filler.start(options);
