import React from 'react';
import './MagInput.css';

function MagInput(props) {
  return (
    <div style={{display: "inline-block"}}>
      <input 
        className="MagInput" 
        type="number" 
        id="minmag" 
        min="1.0" 
        max="10.0"
        step="0.1"
      value={props.mag} 
      onChange={props.changeMag} 
      />
      <label htmlFor="minmag"> {props.label}</label>
    </div>
  )
}
export default MagInput;
