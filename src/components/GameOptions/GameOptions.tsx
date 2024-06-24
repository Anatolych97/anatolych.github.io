export default function GameOptions() {
  return (<form action="#"
        id="gameOptions"
        className="gameOptions">
    <p className="gameOptionsElement">
      <label className="gameOptionsLabel"
             htmlFor="rows">Row count</label>
      <input className="gameOptionsInput"
             type="number"
             id="rows"
             name="rows"
             value="10"
             max="50"
             min="3"
             required/>
    </p>
    <p className="gameOptionsElement">
      <label className="gameOptionsLabel"
             htmlFor="columns">Column count</label>
      <input className="gameOptionsInput"
             type="number"
             id="columns"
             name="columns"
             value="10"
             max="50"
             min="3"
             required/>
    </p>
    <p className="gameOptionsElement">
      <label className="gameOptionsLabel"
             htmlFor="colors">Color count</label>
      <input className="gameOptionsInput"
             type="number"
             id="colors"
             name="colors"
             value="10"
             min="3"
             required/>
    </p>

    <p className="gameButtonComplex">
      <button type="button"
              className="gameButton gameOptionsStart"
              id="gameStart"
              data-auto-game="">Start
      </button>
      <button type="button"
              className="gameButton gameOptionsAI"
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

