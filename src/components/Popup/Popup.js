import React from 'react';
import './Popup.css';

function Popup(props) {
  return (
    <div className="popup">
      <p>{props.mag}</p>
      <p>{props.place}</p>
      <p>{props.time}</p>
    </div>
  )
}
export default Popup;
