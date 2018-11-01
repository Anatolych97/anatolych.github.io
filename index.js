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
        this.stateMap = this.createMap(this.fieldSize, this.colorsArray);
        this.table = this.createTable(this.stateMap.length);

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

    /*
      Создает карту поля. Изначально все действия совершаются над этой картой.
      По ней будет совершаться поиск сопряженных элементов, отталкиваясь от меток внутри неё
      будет перекрашиваться поле.
      DOM - дерево обновляется только после того, как будет обработана карта.
  */
    createMap(size, colors) {
        let tableMap;
        tableMap = new Array(size);
        for (let rowIndex = 0; rowIndex < tableMap.length; rowIndex++) {
            tableMap[rowIndex] = new Array(size);
            for (let cellIndex = 0; cellIndex < tableMap[rowIndex].length; cellIndex++) {
                let hash = this.randomValue(0, colors.length);
                tableMap[rowIndex][cellIndex] = {
                    color: colors[hash],
                    block: false
                }
            }
        }
        return tableMap;
    }

    /* Рендерит пустое игровое поле без цветов */
    createTable(size) {
        let $table = document.createElement('table'),
            row = document.createElement('tr'),
            cell = document.createElement('td');

        $table.classList.add('table');
        row.classList.add('row');
        cell.classList.add('cell');
        cell.dataset.block = false;

        row.style.height = 100 / size + '%';

        for (let i = 0; i < size; i++) {
            $table.appendChild(row.cloneNode());
            for (let j = 0; j < size; j++) {
                $table.rows[i].appendChild(cell.cloneNode());
            }
        }
        return $table;
    }

}

const game = new Game(options);
game.start();
