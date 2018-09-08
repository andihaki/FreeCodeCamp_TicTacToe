import React from "react";

let Square = props => {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
};

export default Square;
