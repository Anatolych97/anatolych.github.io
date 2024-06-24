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
    colors.push(`rgb(${ randColor() },${ randColor() },${ randColor() })`);
  }
  return colors;
}


export default function App () {
  const [ turns, setTurns ] = useState([]);
  const [ grid, setGrid ] = useState([]);

  const [ rowsCount, setRowsCount ] = useState(10);
  const [ columnsCount, setColumnsCount ] = useState(10);
  const [ colorsCount, setColorsCount ] = useState(10);

  function startGame () {
    const colors = createColorsArray(10);

    const tableMap = new Array(rowsCount);
    for (let rowIndex = 0; rowIndex < tableMap.length; rowIndex++) {
      tableMap[rowIndex] = new Array(columnsCount);

      for (let cellIndex = 0; cellIndex < tableMap[rowIndex].length; cellIndex++) {
        const hash = randomValue(0, colors.length);

        tableMap[rowIndex][cellIndex] = {
          color: colors[hash],
          block: false
        }
      }
    }

    setGrid(tableMap);
  }

  function activateAI () {

  }

  function resetGame () {
    setTurns([]);
  }

  function selectColor (selectedCell) {
    setTurns((turns) => [
      {
        ...selectedCell,
        blockedCells: new Set([
          selectedCell.row + '_' + selectedCell.col,
        ]),
      },
      ...turns
    ]);
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

    <GameHistory />
    <GameResult />
  </>
}
