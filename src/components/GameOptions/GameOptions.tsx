import './GameOptions.scss'

export default function GameOptions() {
  return (<form action="#" className="game-options">
    <p className="game-options-element">
      <label className="game-options-label"
             htmlFor="rows">Row count</label>
      <input className="game-options-input"
             type="number"
             id="rows"
             name="rows"
             value="10"
             max="50"
             min="3"
             required/>
    </p>
    <p className="game-options-Element">
      <label className="game-options-label"
             htmlFor="columns">Column count</label>
      <input className="game-options-input"
             type="number"
             id="columns"
             name="columns"
             value="10"
             max="50"
             min="3"
             required/>
    </p>
    <p className="game-options-Element">
      <label className="game-options-label"
             htmlFor="colors">Color count</label>
      <input className="game-options-input"
             type="number"
             id="colors"
             name="colors"
             value="10"
             min="3"
             required/>
    </p>

    <p className="gameButtonComplex">
      <button type="button"
              className="gameButton game-options-start"
              id="gameStart"
              data-auto-game="">Start
      </button>
      <button type="button"
              className="gameButton game-options-AI"
              data-auto-game="true"
              id="botStart"
              disabled>AI
      </button>
    </p>
    <button type="button"
            className="gameButton gameRepeat"
            data-restart="true"
            id="restartButton"
            disabled>Restart
    </button>
  </form>)
}

