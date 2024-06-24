import './GameBoard.scss';

export default function GameBoard({ turns = [], colorsGrid, onSelectCell }) {
  console.log('colorsGrid', colorsGrid)
  const grid = colorsGrid.map((row, rowIndex) =>  row.map((cellColor, colIndex) =>
      <button
        className="game-board-cell"
        key={rowIndex + '_' + colIndex}
        onClick={() => onSelectCell({
          row: rowIndex,
          col: colIndex,
          color: cellColor.color,
        })}
        style={{ 'backgroundColor': turns[0]?.blockedCells.has(rowIndex + '_' + colIndex) ? turns[0].color : cellColor.color }}
        disabled={ turns[0]?.blockedCells.has(rowIndex + '_' + colIndex) }
      >
        { rowIndex } - { colIndex }
      </button>
    )
  );

  return (<div className="game-board" style={{ '--cols': colorsGrid?.[0]?.length }}>
    { grid }
  </div>);
}
