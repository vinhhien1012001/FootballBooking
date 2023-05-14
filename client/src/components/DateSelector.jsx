import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateSelector.css";
import { Button } from "@mui/material";

const DateSelector = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());

  const handleSelect = (date) => {
    setStartDate(date);
    onDateChange(date);
  };

  const currentDate = new Date();
  const oneWeekLater = new Date(
    currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="d-flex flex-column align-items-center">
      {/* <h1>Select a date</h1> */}
      <div className="w-100">
        <DatePicker
          selected={startDate}
          onChange={(date) => handleSelect(date)}
          inline
          minDate={currentDate}
          maxDate={oneWeekLater}
        />
      </div>
      {/* <div className="confirm-btn" style={{ marginTop: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDateChange(startDate)}
        >
          Confirm
        </Button>
      </div> */}
    </div>
  );
};

export default DateSelector;
