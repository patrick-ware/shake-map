import React from 'react';
import './DataModifier.css';
import MagInput from '../MagInput/MagInput.js';
import DatePicker from 'react-date-picker';
// Icon Imports
import { FaTimes } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';
import { FaPencilAlt } from 'react-icons/fa';

function DataModifier(props) {
  return (
    <div>
      <div className="form-title"> 
        <span>Modify map inputs <FaPencilAlt /></span> 
          <button 
            className="dropdown"
            onClick ={()=> props.setMenuToggle(!props.menuToggle)}
          >
            {props.menuToggle ? <FaTimes /> : <FaAngleDown />}
          </button>
        </div>
      <div className={props.menuToggle ? "data-modifier-mobile" : "data-modifier"}>
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
            <hr className="solid"></hr>
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
    </div>
  )
}
export default DataModifier;
