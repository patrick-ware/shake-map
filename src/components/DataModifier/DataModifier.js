import React from 'react';
import './DataModifier.css';

import MagInput from '../MagInput/MagInput.js';
import DatePicker from 'react-date-picker';

function DataModifier(props) {
  return (
    <div className={props.menuToggle ? "DataModifier.active" : "DataModifier"}>
      <form style={{color:"white"}}>
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
    </div>
  )
}
export default DataModifier;
