import './GameOptions.scss'

import {InputNumber, Button, FloatButton} from 'antd';

export default function GameOptions({
                                      rows,
                                      columns,
                                      colors,

                                      onStart,
                                      onReset,
                                      onAIBot,

                                      onChangeRowsCount,
                                      onChangeColumnsCount,
                                      onChangeColorsCount
                                    }) {
  return (<form action="#" className="game-options">
    <InputNumber
      addonBefore="Rows: "


      id="rows"
      value={rows}
      max="50"
      min="3"
      required

      onChange={onChangeRowsCount}
    />

    <InputNumber
      addonBefore="Columns: "

      value={columns}
      max="50"
      min="3"
      required

      onChange={onChangeColumnsCount}
    />

    <InputNumber
      addonBefore="Colors: "

      value={colors}
      max="15"
      min="3"
      required

      onChange={onChangeColorsCount}
    />

    <div className="actions">
      <Button onClick={onStart}>Start</Button>
      <FloatButton onClick={onAIBot} icon="AI"/>

      <Button onClick={onReset}>Restart</Button>
    </div>
  </form>)
}

