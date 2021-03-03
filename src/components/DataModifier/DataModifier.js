import React from 'react';
import './DataModifier.css';

import MagInput from '../MagInput/MagInput.js';
import DatePicker from 'react-date-picker';

function DataModifier(props) {
  return (
    <div className={props.menuToggle ? "DataModifier-mobile" : "DataModifier"}>
      <form>
        <ul>
          <li>
            <MagInput 
              label="Minimum Magnitude"
              mag={props.minMag}
              changeMag={props.changeMinMag}
            />
          </li>
          <li>
            <MagInput
              label="Maximum Magnitude"
              mag={props.maxMag}
              changeMag={props.changeMaxMag}
            />
          </li>
          <li>
            <div className="date-select">
              <DatePicker
                className="date-input"
                clearIcon={null}
                value={props.startDate}
                onChange={props.onStartChange}
              />
            </div>
              Start Date
          </li>
          <li>
            <div className="date-select">
              <DatePicker
                className="date-input"
                clearIcon={null}
                value={props.endDate}
                onChange={props.onEndChange}
              />
              End Date
            </div>
          </li>
        </ul>
      </form>
    </div>
  )
}
export default DataModifier;
