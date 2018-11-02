class Game {
    constructor(options) {
        this.areaWrapper = options.gameArea;
        this.controlsWrapper = options.controls;
        this.colorsArray = this.createColorsArray(options.colorsCount);
        this.fieldSize = {
            rows: options.rowsCount,
            columns: options.columnsCount
        };
    }

    start() {
        this.stateMap = this.createMap(this.fieldSize, this.colorsArray);
        this.table = this.createTable(this.fieldSize);

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
        tableMap = new Array(size.rows);
        for (let rowIndex = 0; rowIndex < tableMap.length; rowIndex++) {
            tableMap[rowIndex] = new Array(size.columns);
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

        row.style.height = 100 / size.rows + '%';

        for (let i = 0; i < size.rows; i++) {
            $table.appendChild(row.cloneNode());
            for (let j = 0; j < size.columns; j++) {
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

        this.matcher(0, 0, this.stateMap[0][0].color);

        this.stateMap[0][0].color = color;
        this.matcher(0, 0, color);

        this.mapCellsUpdate(color);
        this.updateDomTable(this.table, this.stateMap);
    }

    matcher(row, cell, color, matches = {}) {
        if (cell >= this.fieldSize.columns || cell < 0) return;
        if (row >= this.fieldSize.rows || row < 0) return;
        if (this.stateMap[row][cell].used) return;

        if (this.stateMap[row][cell].color === color) {
            this.stateMap[row][cell].block = true;
            this.stateMap[row][cell].used = true;

            this.table.rows[row].cells[cell].dataset.used = true;
            this.table.rows[row].cells[cell].dataset.block = true;

            this.matcher(row, cell + 1, color, matches);
            this.matcher(row + 1, cell, color, matches);

            if (cell > 0) {
                this.matcher(row, cell - 1, color, matches);
            }
            if (row > 0) {
                this.matcher(row - 1, cell, color, matches);
            }
        }
        if (this.stateMap[row][cell].color !== color) {
            matches[this.stateMap[row][cell].color] ?
                matches[this.stateMap[row][cell].color]++ :
                matches[this.stateMap[row][cell].color] = 1;
            return;
        }
    }

    mapCellsUpdate(color) {
        for (let row = 0; row < this.stateMap.length; row++) {
            for (let cell = 0; cell < this.stateMap[row].length; cell++) {
                if (this.stateMap[row][cell].block) {
                    this.stateMap[row][cell].used = false;
                    this.stateMap[row][cell].color = color;
                }
            }
        }
    }

    checkWin() {
        const color = this.stateMap[0][0].color,
            win = this.stateMap.every(function (row) {
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
                showBaner('success', 'WIN', 'You are winner!');
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

                this.mapCellsUpdate(color);
                this.updateDomTable(this.table, this.stateMap);
            }
        };
    }
}

const startButton = document.getElementById('gameStart'),
    botButton = document.getElementById('botStart'),
    gameOptions = document.getElementById('gameOptions'),
    validator = new Validator();

startButton.addEventListener('click', gameStart);
botButton.addEventListener('click', gameStart);
gameOptions['colors'].addEventListener('focusout', validator.colorsCountValidate);
gameOptions['rows'].addEventListener('focusout', validator.fieldSizeValidate);
gameOptions['columns'].addEventListener('focusout', validator.fieldSizeValidate);

function Validator() {

    function colorsCountValidate({ target: element }) {
        let errors = [];

        if (element.value > 20) {
            errors.push('Max colors count: 20');
        }

        if (element.value < 3) {
            errors.push('Minimum colors count: 3');
        }

        errorChecker(element, errors);
    }
    function fieldSizeValidate({ target: element }) {
        let errors = [];

        if (element.value > 50) {
            errors.push('Maximum value: 50');
        }

        if (element.value < 3) {
            errors.push('Minimum value: 3');
        }

        errorChecker(element, errors);
    }

    function errorChecker(element, errors) {
        if (errors.length > 0) {
            showError(element, errors);
            element.validity.valid = false;
        } else {
            errors.length = 0;
            element.validity.valid = true;
            clearErrors(element);
        }
    }
    function showError(elem, errorsArray) {
        clearErrors(elem);

        const ul = document.createElement('ul'),
            li = document.createElement('li');

        ul.classList.add('errorsList');
        li.classList.add('errorsListItem');

        for (let error = 0; error < errorsArray.length; error++) {
            li.textContent = errorsArray[error];
            ul.appendChild(li.cloneNode(true));
        }

        elem.parentElement.insertAdjacentElement('afterEnd', ul);
    }
    function clearErrors(elem) {
        if (elem.parentElement.nextElementSibling && elem.parentElement.nextElementSibling.classList.contains('errorsList')) {
            elem.parentElement.nextElementSibling.remove();
        }
    }

    function checkGlobalValid(gameOptions) {
        let valid = true;
        for (let elem of gameOptions) {
            valid &= elem.validity.valid;
        }

        return valid;
    }

    return {
        checkGlobalValid,
        colorsCountValidate,
        fieldSizeValidate
    }
}

function buttonControls(flag) {
    startButton.disabled = flag;
    botButton.disabled = flag;
}

function gameInit() {

    if (validator.checkGlobalValid(gameOptions)) {
        const options = {
            gameArea: document.getElementById('gameArea'),
            controls: document.getElementById('gameControls'),
            rowsCount: +gameOptions['rows'].value,
            columnsCount: +gameOptions['columns'].value,
            colorsCount: +gameOptions['colors'].value,
        };

        options.gameArea.innerHTML = '';
        options.controls.innerHTML = '';

        return new Game(options);
    } else {
        showBaner('error', 'Erorr in options', 'You should input correctly value for start game');
    }
}

function gameStart({ target }) {
    const game = gameInit();
    if (game) {
        if (target.dataset.autoGame) {
            game.start().botAI(300);
        } else {
            game.start();
        }
    }
}

function showBaner(type, title, message) {
    let wrapper = document.querySelector('.banerWrapper'),
        baner = document.querySelector('.baner'),
        button = document.querySelector('.banerClose'),
        banerTitle = document.querySelector('.banerTitle'),
        banerText = document.querySelector('.banerText');

    baner.classList.add('baner', type);
    banerTitle.textContent = title;
    banerText.textContent = message;

    wrapper.style.display = 'flex';

    button.addEventListener('click', function () {
        wrapper.style.display = 'none';
    });
}
