class Game {
    constructor(options) {
        this.areaWrapper = options.gameArea;
        this.controlsWrapper = options.controls;
        this.colorsArray = this.createColorsArray(options.colorsCount);
        this.stepHistory = options.stepHistory;
        this.fieldSize = {
            rows: options.rowsCount,
            columns: options.columnsCount
        };
        this._stepCount = 0;
        this.sessionSave = {};
        this.autoGame = {
            status: false,
            timer: null
        };
        this._autoGameInterval = 300;
    }


    /* ------------------------------ History logger methods ------------------------------ */

    get stepCount() {
        return this._stepCount;
    }
    set stepCount(value) {
        if (value >= 0) {
            this.stepHistory.firstElementChild.firstElementChild.textContent = value;
            this._stepCount = value;
        }
    }

    historyLogger(color) {
        const step = document.createElement('li');
        step.classList.add('stepHistoryItem');
        step.textContent = this.stepCount;
        step.style.backgroundColor = color;
        this.stepHistory.lastElementChild.appendChild(step);
    }

    /* ------------------------------ Support methods ------------------------------ */

    stateClone(oldState) {
        const newState = new Array(oldState.length);
        for (let i = 0; i < oldState.length; i++) {
            newState[i] = new Array(oldState[i].length);
            for (let j = 0; j < oldState[i].length; j++) {
                newState[i][j] = Object.assign({}, oldState[i][j]);
            }
        }
        return newState;
    }

    clearArea() {
        this.areaWrapper.innerHTML = '';
        this.controlsWrapper.innerHTML = '';
        this.stepCount = 0;
        this.stepHistory.lastElementChild.innerHTML = '';
    }

    setOptions(options) {
        this.areaWrapper = options.gameArea;
        this.controlsWrapper = options.controls;
        this.colorsArray = this.createColorsArray(options.colorsCount);
        this.fieldSize = {
            rows: options.rowsCount,
            columns: options.columnsCount
        };
    }

    /* ------------------------------ Start game methods ------------------------------ */

    start(newGame = true) {
        this.clearArea();

        if (newGame) {
            this.stateMap = this.createMap(this.fieldSize, this.colorsArray);
            this.sessionSave.state = this.stateClone(this.stateMap);
            this.table = this.createTable(this.fieldSize);
        }

        this.updateDomTable(this.table, this.stateMap);

        this.createControls(this.colorsArray);
        this.areaWrapper.appendChild(this.table);

        this.stepHistory.classList.add('show');

        return this;
    }

    restart() {
        this.stateMap = this.stateClone(this.sessionSave.state);
        clearInterval(this.autoGame.timer);
        this.start(false);
    }


    /* ------------------------------ Generate game methods ------------------------------ */

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

    /* Generates a panel with colors for the user */
    createControls(colors) {
        const list = document.createElement('ul'),
            elem = document.createElement('li');
        list.classList.add('gameControlsList');
        elem.classList.add('gameControlsElement');
        for (let color of colors) {
            elem.dataset.color = color;
            elem.style.backgroundColor = color;
            list.appendChild(elem.cloneNode(true)).addEventListener('click', this.controlClick.bind(this));
        }
        list.classList.add('show');
        this.controlsWrapper.appendChild(list);
    }

    /*
        Creates a field map. Initially, all actions are performed on this card.
        It will be used to search for conjugate elements, starting from the labels inside it.
        will repaint the field.
        DOM tree is updated only after the map is processed.
    */
    createMap(size, colors) {
        const tableMap = new Array(size.rows);
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

    /* Rendering empty game area without colors */
    createTable(size) {
        const $table = document.createElement('table'),
            row = document.createElement('tr'),
            cell = document.createElement('td');

        $table.classList.add('table');
        row.classList.add('row');
        cell.classList.add('cell');
        cell.dataset.block = false;

        for (let i = 0; i < size.rows; i++) {
            $table.appendChild(row.cloneNode());
            for (let j = 0; j < size.columns; j++) {
                $table.rows[i].appendChild(cell.cloneNode());
            }
        }
        return $table;
    }

    /*
        Field fill function.
        The only role is to update the tree based on the game map.
        IMPORTANT: Pure update of colors, no side effects or conditions!
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

    /* ------------------------------ Main algorythm methods ------------------------------ */

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

    /* ------------------------------ Gameplay methods ------------------------------ */

    get autoGameInterval() {
        return this._autoGameInterval;
    }
    set autoGameInterval(value) {
        if (value >= 0) {
            this._autoGameInterval = value;
        }
    }

    controlClick(event) {
        const color = event.target.dataset.color;

        this.stepCount++;
        this.historyLogger(color);

        this.matcher(0, 0, this.stateMap[0][0].color);

        this.stateMap[0][0].color = color;
        this.matcher(0, 0, color);

        this.mapCellsUpdate(color);
        this.updateDomTable(this.table, this.stateMap);

        if (this.checkWin()) {
            showBaner('success', 'WIN', 'You are winner!');
        }
    }

    botAI() {
        clearInterval(this.autoGame.timer);
        this.autoGame.timer = setInterval(game.bind(this), this.autoGameInterval);

        function game() {
            console.log('Game Stoped');
            if (this.autoGame.status) {
                if (this.checkWin()) {
                    showBaner('success', 'WIN', 'You are winner!');
                    clearInterval(this.autoGame.timer);

                    startButton.disabled = false;
                    restartButton.disabled = false;
                    botButton.disabled = false;
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

                    this.stepCount++;
                    this.historyLogger(color);

                    this.mapCellsUpdate(color);
                    this.updateDomTable(this.table, this.stateMap);
                }
            } else {
                clearInterval(this.autoGame.timer);
            }
        };
    }
}

const startButton = document.getElementById('gameStart'),
    botButton = document.getElementById('botStart'),
    gameOptions = document.getElementById('gameOptions'),
    gameControls = document.getElementById('gameControls'),
    restartButton = document.getElementById('restartButton'),
    validator = new Validator(),
    game = gameInit();

startButton.addEventListener('click', startNewGame);
botButton.addEventListener('click', autoGame);
restartButton.addEventListener('click', restartGame);
gameOptions['colors'].addEventListener('focusout', validator.colorsCountValidate);
gameOptions['rows'].addEventListener('focusout', validator.fieldSizeValidate);
gameOptions['columns'].addEventListener('focusout', validator.fieldSizeValidate);

function Validator() {

    function colorsCountValidate({ target: element }) {
        const errors = [],
            maxValue = +gameOptions['rows'].value * +gameOptions['columns'].value;

        if (element.value > maxValue) {
            errors.push('Max colors count: ' + maxValue);
        }

        if (element.value < 3) {
            errors.push('Minimum colors count: 3');
        }

        errorChecker(element, errors);
    }
    function fieldSizeValidate({ target: element }) {
        const errors = [];

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

function createOptionsObject() {
    if (validator.checkGlobalValid(gameOptions)) {
        const options = {
            gameArea: document.getElementById('gameArea'),
            controls: gameControls,
            rowsCount: +gameOptions['rows'].value,
            columnsCount: +gameOptions['columns'].value,
            colorsCount: +gameOptions['colors'].value,
            stepHistory: document.getElementById('stepHistory')
        };

        return options;

    } else {
        showBaner('error', 'Erorr in options', 'You should input correctly value for start game');
    }
}

function gameInit() {
    const options = createOptionsObject();

    options.gameArea.innerHTML = '';
    options.controls.innerHTML = '';

    return new Game(options);
}

function startNewGame() {
    game.setOptions(createOptionsObject());

    game.autoGame.status = false;
    botButton.disabled = game.autoGame.status;
    game.start();
    botButton.classList.remove('active');
}

function restartGame() {
    game.restart();
    gameControls.firstElementChild.classList.add('show');
}

function autoGame() {
    game.autoGame.status = !game.autoGame.status;

    botButton.classList.toggle('active', game.autoGame.status);

    startButton.disabled = game.autoGame.status;
    restartButton.disabled = game.autoGame.status;

    game.botAI();
}

function showBaner(type, title, message) {
    const wrapper = document.querySelector('.banerWrapper'),
        baner = document.querySelector('.baner'),
        button = document.querySelector('.banerClose'),
        banerTitle = document.querySelector('.banerTitle'),
        banerText = document.querySelector('.banerText');

    baner.classList.add('baner', type);
    banerTitle.textContent = title;
    banerText.textContent = message;

    wrapper.style.display = 'flex';

    gameControls.firstElementChild.classList.remove('show');
    botButton.classList.remove('active');

    button.addEventListener('click', function () {
        wrapper.style.display = 'none';
    });
}
