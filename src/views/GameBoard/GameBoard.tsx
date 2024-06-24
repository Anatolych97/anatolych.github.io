import './GameBoard.scss';

export default function GameBoard({ turns = [], colorsGrid, onSelectCell }) {
  const usedCells = turns.flatMap((turn) => [ ...turn.blockedCells.values() ]);

  const gridTemplate = colorsGrid.map((row, rowIndex) =>  row.map((cell, colIndex) =>
      <button
        className="game-board-cell"
        key={rowIndex + '_' + colIndex}
        onClick={() => onSelectCell({
          row: rowIndex,
          col: colIndex,
          color: cell.color,
        })}
        title={cell.color}
        style={{
          'backgroundColor': usedCells.includes(rowIndex + '_' + colIndex) ? turns[0].color : cell.color
        }}
        disabled={ usedCells.includes(rowIndex + '_' + colIndex) }
      >
        { rowIndex } - { colIndex }
      </button>
    )
  );

  return (<div className="game-board" style={{ '--cols': colorsGrid?.[0]?.length }}>
    { gridTemplate }
  </div>);
}
