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

        this.updateDomTable(this.table, this.stateMap);
        this.createControls(this.colorsArray);

        this.areaWrapper.appendChild(this.table);

        return this;
    }

    createColorsArray(colorsCount) {
        const colors = [];
        const randColor = function () {
            return (this.randomValue(0, 255));
        }.bind(this);

        for (let i = 0; i < colorsCount; i++) {
            colors.push(`rgb(${randColor()},${randColor()},${randColor()})`);
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
            list.appendChild(elem.cloneNode(true)).addEventListener('click', this.controlClick.bind(this));
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

    /*
        Функция заливки поля.
        Единственная роль это обновить дерево на основании карты игры.
        ВАЖНО: Чистое обновление цветов, никаких побочных действий или условий!
    */
    updateDomTable(table, map) {
        for (let row of table.rows) {
            for (let cell of row.cells) {
                cell.dataset.color = map[row.rowIndex][cell.cellIndex]['color'];
                cell.dataset.block = map[row.rowIndex][cell.cellIndex]['block'];
                cell.style.backgroundColor = map[row.rowIndex][cell.cellIndex]['color'];
            }
        }
    }

    randomValue(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    controlClick(event) {
        let color = event.target.dataset.color;
        this.tileMatcher(color);
        this.updateDomTable(this.table, this.stateMap);
    }

    matcher(row, cell, color, matches = {}) {
        if (cell >= this.stateMap.length) return;
        if (row >= this.stateMap.length) return;

        if (this.stateMap[row][cell].color === color) {
            this.stateMap[row][cell].block = true;
            this.matcher(row, cell + 1, color, matches);
            this.matcher(row + 1, cell, color, matches);
        } else {
            matches[this.stateMap[row][cell].color] ?
                matches[this.stateMap[row][cell].color]++ :
                matches[this.stateMap[row][cell].color] = 1;

            return;
        }
    }

    tileMatcher(color) {
        this.matcher(0, 0, this.stateMap[0][0].color);

        this.stateMap[0][0].color = color;
        this.matcher(0, 0, this.stateMap[0][0].color);

        for (let row = 0; row < this.stateMap.length; row++) {
            for (let cell = 0; cell < this.stateMap.length; cell++) {
                if (this.stateMap[row][cell].block) {
                    this.stateMap[row][cell].color = color;
                }
            }
        }
    }

    checkWin() {
        const color = this.stateMap[0][0].color;
        const win = this.stateMap.every(function (row) {
            return row.every(function (cell) {
                return cell.color === color;
            });
        });
        return win;
    }

    botAI(stepTime) {
        const autoGame = setInterval(game.bind(this), stepTime);

        function game() {
            if (this.checkWin()) {
                console.log('WIN');
                clearInterval(autoGame);
            } else {
                const matches = {};
                this.matcher(0, 0, this.stateMap[0][0].color, matches);

                const color = function () {
                    let max = 0,
                        target = '';
                    for (let color in matches) {
                        if (matches[color] > max) {
                            max = matches[color];
                            target = color;
                        }
                    }

                    return target;
                }();

                this.tileMatcher(color);
                this.updateDomTable(this.table, this.stateMap);
            }
        };
    }
}

const startButton = document.getElementById('gameStart'),
    botButton = document.getElementById('botStart');

startButton.addEventListener('click', gameStart);
botButton.addEventListener('click', botGame);

function gameInit() {
    const options = {
        gameArea: document.getElementById('gameArea'),
        controls: document.getElementById('gameControls'),
        colorsCount: +document.getElementById('colors').value,
        fieldSize: +document.getElementById('fieldSize').value,
    },
        game = new Game(options);

    options.gameArea.innerHTML = '';
    options.controls.innerHTML = '';

    return game;
}

function gameStart() {
    gameInit().start();
}

function botGame() {
    gameInit().start().botAI(200);
}
