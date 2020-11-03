import React, { useState } from 'react';
import './BarChart.css';

function BarChart(props) {

  return (
    <div>
      <div className="BarChart">
        {
          Object.entries(props.apiData).slice(props.page*20-20, props.page*20-1)
            .map(([key, value]) => (
              <div 
                className="BarChart-bar"
                id={value.id}
                key={key} 
                style={{height: value.properties.mag*10+"%"}}
                onClick={()=>{console.log("the coordinates are", value.geometry.coordinates[0]+","+value.geometry.coordinates[1])}}
                /*onClick={()=>{alert(value.properties.mag+" | "+ value.properties.place +" | "+ new Date(value.properties.time).toUTCString())}}*/
              >
                {value.properties.mag.toFixed(1)}
                <div className="tooltiptext">
                  <p>{value.properties.mag.toFixed(1)}</p>
                  <p>{value.properties.place}</p>
                  <p>{new Date(value.properties.time).toUTCString()}</p>
                </div>
              </div>
          ))
        }
      </div>
      <div className="DateInfo">Total records: {Object.entries(props.apiData).length}  |  Now viewing records from {props.lastRecordDate} through {props.firstRecordDate} </div>
      <div className="PageNav">
        <button className="PageNav-control" onClick={props.goToPreviousPage}>⬅ Previous Page </button>
        <div className="PageNav-position"> Page {props.page} of {Math.ceil(props.apiData.length/20)} </div>
        <button className="PageNav-control" onClick={props.goToNextPage}>Next Page ➡</button>
      </div>
    </div>
  );
}

export default BarChart;
