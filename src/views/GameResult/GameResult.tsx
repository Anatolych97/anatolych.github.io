import './GameResult.scss';

export default function GameResult({ turns, rows, cols }) {
  const isWin = turns?.[0]?.blockedCells.size === rows * cols;
  const title = isWin ? 'WIN!' : 'Oops!';

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <h3 className="modal-title">{ title }</h3>
        <p className="modal-text"></p>
        <span className="modal-close">x</span>
      </div>
    </div>
  )
}
