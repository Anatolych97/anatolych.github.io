import './GameControls.scss';

export default function GameControls({ show = true, colors = [], onSelectColor }: { colors: string[] }) {
  const colorControls = colors.map((color) => (<li
    data-color={color}
    className="game-controls-element"
    key={color as string}
    style={{backgroundColor: color}}
    onClick={() => onSelectColor(color)}
  ></li>));

  return (show && <div className="game-controls">
    <ul className="game-controls-list">{colorControls}</ul>
  </div>)
}
