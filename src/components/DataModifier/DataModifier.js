import React from 'react';
import './DataModifier.css';

import MagInput from '../MagInput/MagInput.js';
import DatePicker from 'react-date-picker';

function DataModifier(props) {
  return (
    <div className="DataModifier">
      <div className="form-title"> 
        <span>Modify map inputs </span> 
        <button className="dropdown">➤</button>
      </div>
      <form>
          <MagInput 
            label="Minimum Magnitude"
            mag={props.minMag}
            changeMag={props.changeMinMag}
          />
        <MagInput 
          label="Maximum Magnitude"
          mag={props.maxMag}
          changeMag={props.changeMaxMag}
        />
          <div className="DateInput">
            Start Date:
            <DatePicker
              clearIcon={null}
              value={props.startDate}
              onChange={props.onStartChange}
            />
          </div>
          <div className="DateInput">
            End Date:
            <DatePicker
              clearIcon={null}
              value={props.endDate}
              onChange={props.onEndChange}
            />
        </div>
      </form>
      <div className="data-source"> Data provided by United States Geological Survey </div>
    </div>
  )
}
export default DataModifier;
