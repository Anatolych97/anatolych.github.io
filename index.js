let options = {
    gameArea: document.getElementById('gameArea'),
    controls: document.getElementById('gameControls'),
    colorsCount: +document.getElementById('colors').value,
    fieldSize: +document.getElementById('fieldSize').value,
}

class Game {
    constructor(options) {
        this.areaWrapper = options.gameArea;
        this.controlsWrapper = options.controls;
        this.colorsArray = this.createColorsArray(options.colorsCount);
        this.fieldSize = options.fieldSize;
    }

    start() {

        this.createControls(this.colorsArray);


        this.areaWrapper.appendChild(this.table);
    }

    createColorsArray(colorsCount) {
        const colors = [];
        const randHEX = function () {
            return (this.randomValue(0, 255)).toString(16);
        }.bind(this);

        for (let i = 0; i < colorsCount; i++) {
            colors.push('#' + randHEX() + randHEX() + randHEX());
        }
        return colors;
    }

    /* Генерирует панельку с цветами-кнопками для пользователя */
    createControls(colors) {
        let list = document.createElement('ul'),
            elem = document.createElement('li');
        list.classList.add('gameControlsList');
        elem.classList.add('gameControlsElement');

        for (let color of colors) {
            elem.dataset.color = color;
            elem.style.backgroundColor = color;
            list.appendChild(elem.cloneNode(true));
        }
        this.controlsWrapper.appendChild(list);
    }
}

const game = new Game(options);
game.start();
