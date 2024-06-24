import './GameHistory.scss';

export default function GameHistory({ turns = [] }) {
  return (
    <div className="game-history-wrapper">
      <h3 className="game-history-title">History</h3>

      <span> Number of steps: <span className="stepCount">{ turns.length }</span></span>
      <ul className="game-history">
        { turns.map((turn) => <li
          key={turn.row + '-' + turn.col}
          className="game-history__item"
          style={{ backgroundColor: turn.color }}
        >{ turn.row } - {turn.col }</li> ) }
      </ul>
    </div>
  );
}
