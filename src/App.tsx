import GameHistory from "./views/GameHistory/GameHistory.tsx";
import GameOptions from "./views/GameOptions/GameOptions.tsx";
import GameBoard from "./views/GameBoard/GameBoard.tsx";
import GameResult from "./views/GameResult/GameResult.tsx";
import GameControls from "./views/GameControls/GameControls.tsx";
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
  const [ colors, setColors ]  = useState([]);

  const [ rowsCount, setRowsCount ] = useState(10);
  const [ columnsCount, setColumnsCount ] = useState(10);
  const [ colorsCount, setColorsCount ] = useState(10);

  function startGame () {
    setColors(createColorsArray(10));
  }

  function activateAI () {

  }

  function resetGame () {

  }

  function selectColor () {

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

    <GameBoard colors={colors} rows={rowsCount} cols={columnsCount} />
    <GameControls colors={colors} onSelectColor={selectColor} />

    <GameHistory />
    <GameResult />
  </>
}
