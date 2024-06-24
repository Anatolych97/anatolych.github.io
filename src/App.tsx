import GameHistory from "./views/GameHistory/GameHistory.tsx";
import GameOptions from "./views/GameOptions/GameOptions.tsx";
import GameBoard from "./views/GameBoard/GameBoard.tsx";
import GameResult from "./views/GameResult/GameResult.tsx";

import {useState} from "react";

function randomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createColorsArray(colorsCount) {
  const colors = [];
  const randColor = function () {
    return (randomValue(0, 255));
  }.bind(this);

  for (let i = 0; i < colorsCount; i++) {
    colors.push(`rgb(${randColor()},${randColor()},${randColor()})`);
  }
  return colors;
}


export default function App() {
  const [turns, setTurns] = useState([]);
  const [grid, setGrid] = useState([]);

  const [rowsCount, setRowsCount] = useState(5);
  const [columnsCount, setColumnsCount] = useState(5);
  const [colorsCount, setColorsCount] = useState(4);

  function startGame() {
    const colors = createColorsArray(colorsCount);

    const tableMap = new Array(rowsCount);
    for (let rowIndex = 0; rowIndex < tableMap.length; rowIndex++) {
      tableMap[rowIndex] = new Array(columnsCount);

      for (let cellIndex = 0; cellIndex < tableMap[rowIndex].length; cellIndex++) {
        const hash = randomValue(0, colors.length);

        tableMap[rowIndex][cellIndex] = {
          color: colors[hash],
          blocked: false
        }
      }
    }

    setGrid(tableMap);
  }

  function activateAI() {

  }

  function resetGame() {
    setTurns([]);
    setGrid((grid) => grid);
  }

  function matcher(row, cell, color, matches = [], visitedCells = new Set()) {
    if (cell >= columnsCount || cell < 0) return;
    if (row >= rowsCount || row < 0) return;

    const marker = row + '_' + cell;
    if (visitedCells.has(marker)) return;
    visitedCells.add(marker);

    if (grid[row][cell].color === color || matches.includes(marker)) {
      matches.push(marker);

      matcher(row + 1, cell, color, matches, visitedCells);
      matcher(row - 1, cell, color, matches, visitedCells);
      matcher(row, cell - 1, color, matches, visitedCells);
      matcher(row, cell + 1, color, matches, visitedCells);
    }

    return matches;
  }

  function findBlockedCells(selectedCell, usedCells) {
    return new Set([
      selectedCell.row + '_' + selectedCell.col,
      ...matcher(selectedCell.row, selectedCell.col, selectedCell.color, usedCells),
    ]);
  }

  function selectColor(selectedCell) {
    setTurns((turns) => {
      const usedCells = turns.flatMap((turn) => [ ...turn.blockedCells.values() ]);

      return [
        {
          ...selectedCell,
          blockedCells: findBlockedCells(selectedCell, usedCells),
        },
        ...turns
      ];
    });
  }

  return <>
    <GameOptions
      rows={rowsCount}
      columns={columnsCount}
      colors={colorsCount}

      onChangeRowsCount={setRowsCount}
      onChangeColumnsCount={setColumnsCount}
      onChangeColorsCount={setColorsCount}

      onStart={startGame}
      onReset={resetGame}
      onAIBot={activateAI}
    />

    <GameBoard
      colorsGrid={grid}
      turns={turns}
      onSelectCell={selectColor}
    />

    {!!turns.length && <GameHistory turns={turns}/>}
    <GameResult/>
  </>
}
