import './GameBoard.scss';

export default function GameBoard({ turns = [], rows, cols, onSelectCell }) {
  const grid = [ ...new Array(rows) ].map((_, rowIndex) =>  [
      ...new Array(cols)
    ].map((_, colIndex) =>
      <button
        className="game-board-cell"
        key={rowIndex + '_' + colIndex}
        onClick={onSelectCell}
        style={{ 'backgroundColor': turns[rowIndex]?.[colIndex].color }}
        disabled={turns[rowIndex]?.[colIndex].disabled}
      >
        { rowIndex } - { colIndex }
      </button>
    )
  );

  return (<div className="game-board" style={{ '--cols': cols }}>
    { grid }
  </div>);
}
