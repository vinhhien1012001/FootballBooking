import React from "react";
import { PropagateLoader } from "react-spinners";

const Loading = ({ onDateChange }) => {
  return (
    <div className="loading-container">
      <div className="loading-overlay">
        <PropagateLoader color={"#198754"} />
      </div>
    </div>
  );
};

export default Loading;
