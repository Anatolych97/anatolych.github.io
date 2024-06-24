export default function GameHistory() {
  return (
    <div id="stepHistory" className="stepHistoryWrapper">
      <span>Number of steps: <span className="stepCount"></span></span>
      <ul className="stepHistory"></ul>
    </div>
  );
}
