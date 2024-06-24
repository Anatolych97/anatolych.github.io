import GameHistory from "./components/GameHistory/GameHistory.tsx";
import GameOptions from "./components/GameOptions/GameOptions.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import GameResult from "./components/GameResult/GameResult.tsx";
import GameControls from "./components/GameControls/GameControls.tsx";

export default function App () {
  return <>
    <GameOptions />

    <GameBoard />
    <GameControls />

    <GameHistory />

    <GameResult />
  </>
}
