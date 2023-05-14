// Import required libraries and components
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DateSelector from "../../components/DateSelector";

// {
//   num_pitch: 2,
//     [
//       { time: "8am-9am", price: "300.000 VND", booked: false },
//       { time: "9am-10am", price: "300.000 VND", booked: false },
//       { time: "10am-11am", price: "300.000 VND", booked: false },
//       { time: "11am-12pm", price: "300.000 VND", booked: false },
//       { time: "12pm-1pm", price: "300.000 VND", booked: false },
//       { time: "1pm-2pm", price: "300.000 VND", booked: false },
//       { time: "2pm-3pm", price: "300.000 VND", booked: true },
//       { time: "3pm-4pm", price: "300.000 VND", booked: false },
//       { time: "4pm-5pm", price: "300.000 VND", booked: false },
//       { time: "5pm-6pm", price: "300.000 VND", booked: false },
//       { time: "6pm-7pm", price: "500.000 VND", booked: true },
//       { time: "7pm-8pm", price: "500.000 VND", booked: true },
//       { time: "8pm-9pm", price: "500.000 VND", booked: false },
//       { time: "9pm-10pm", price: "500.000 VND", booked: false },
//     ],
//     [
//       { time: "8am-9am", price: "300.000 VND", booked: false },
//       { time: "9am-10am", price: "300.000 VND", booked: false },
//       { time: "10am-11am", price: "300.000 VND", booked: false },
//       { time: "11am-12pm", price: "300.000 VND", booked: false },
//       { time: "12pm-1pm", price: "300.000 VND", booked: false },
//       { time: "1pm-2pm", price: "300.000 VND", booked: false },
//       { time: "2pm-3pm", price: "300.000 VND", booked: true },
//       { time: "3pm-4pm", price: "300.000 VND", booked: false },
//       { time: "4pm-5pm", price: "300.000 VND", booked: false },
//       { time: "5pm-6pm", price: "300.000 VND", booked: false },
//       { time: "6pm-7pm", price: "500.000 VND", booked: true },
//       { time: "7pm-8pm", price: "500.000 VND", booked: true },
//       { time: "8pm-9pm", price: "500.000 VND", booked: false },
//       { time: "9pm-10pm", price: "500.000 VND", booked: false },
//     ];
// }

// Api req postbooking
// {
//   [
//     {
//       pitch_id,
//       time,
//       price
//     },
//     {
//       pitch_id,
//       time ,
//       price
//     },
//     {
//       pitch_id,
//       time ,
//       price
//     },
//     {
//       pitch_id,
//       time ,
//       price
//     },
//   ],
//   total_price
// }
//

// {
//   stadium_id: '.asdjkha'
// }

// {
//   san5: false,
//   san7: true,
// }

// API REQ USER CHOOSE BOOKING TIME
// {
//   stadium_id,
//   date,
//   category: "san7",
// }

const rows = [
  { time: "8am-9am", price: "300.000 VND", pitch1: false, pitch2: false },
  { time: "9am-10am", price: "300.000 VND", booked: false },
  { time: "10am-11am", price: "300.000 VND", booked: false },
  { time: "11am-12pm", price: "300.000 VND", booked: false },
  { time: "12pm-1pm", price: "300.000 VND", booked: false },
  { time: "1pm-2pm", price: "300.000 VND", booked: false },
  { time: "2pm-3pm", price: "300.000 VND", booked: true },
  { time: "3pm-4pm", price: "300.000 VND", booked: false },
  { time: "4pm-5pm", price: "300.000 VND", booked: false },
  { time: "5pm-6pm", price: "300.000 VND", booked: false },
  { time: "6pm-7pm", price: "500.000 VND", booked: true },
  { time: "7pm-8pm", price: "500.000 VND", booked: true },
  { time: "8pm-9pm", price: "500.000 VND", booked: false },
  { time: "9pm-10pm", price: "500.000 VND", booked: false },
];

// Sample data
const sampleData = [
  { time: "10:00", price: 50, booked: false },
  { time: "11:00", price: 50, booked: true },
  { time: "12:00", price: 50, booked: false },
];

const PitchBooking = () => {
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  const numberOfButtons = 14; // Adjust this value as needed
  const [iconClicked, setIconClicked] = useState(
    Array(numberOfButtons).fill(false)
  );

  function handleClick(index) {
    console.log("index:", index);
    const updatedIconClicked = [...iconClicked];
    updatedIconClicked[index] = !updatedIconClicked[index];
    setIconClicked(updatedIconClicked);
  }

  const handleDateChange = (date) => {
    console.log("Selected date:", date);
    // Update state or fetch data based on the selected date
  };

  useEffect(() => {
    // Fetch data from API based on the selected date
    // For this example, we're using sample data
    setSchedule(rows);
  }, [date]);

  //   const handleDateChange = (e) => {
  //     setDate(new Date(e.target.value));
  //   };

  const handleBooking = (index) => {
    // Handle booking logic here, e.g., send a request to the backend
    console.log("Booking pitch at index:", index);
  };

  return (
    <Container className="d-flex flex-column justify-content-center">
      <h1>Pitch Booking</h1>
      <select
        class="form-select form-select mb-3 w-50 mx-auto"
        aria-label=".form-select example"
      >
        {/* <option selected>Open this select menu</option> */}
        <option value="1" selected>
          SÂN VẬN ĐỘNG PHÚ THỌ
        </option>
        <option value="2">NGUYỄN VĂN LINH</option>
        <option value="3">HOÀNG KIM</option>
        <option value="4">KHÁNH HỘI</option>
        <option value="5">THỐNG NHẤT</option>
      </select>

      <select
        class="form-select form-select mb-3 w-50 mx-auto"
        aria-label=".form-select example"
      >
        {/* <option selected>Open this select menu</option> */}
        {/* <option value="1" selected>
          SÂN VẬN ĐỘNG PHÚ THỌ
        </option> */}
        <option value="2" selected>
          San 5
        </option>
        <option value="3">San 7</option>
        {/* <option value="4">KHÁNH HỘI</option>
        <option value="5">THỐNG NHẤT</option> */}
      </select>
      {/* <TextField
        label="Select date"
        type="date"
        // class="mx-auto"
        value={date.toISOString().substr(0, 10)}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      /> */}
      <DateSelector onDateChange={handleDateChange} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Booking</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.map((slot, clicked, index) => (
            <TableRow>
              <TableCell>{slot.time}</TableCell>
              <TableCell>{slot.price}</TableCell>
              <TableCell>
                {slot.booked ? (
                  <IconButton aria-label="delete" disabled>
                    <CancelIcon disabled />
                  </IconButton>
                ) : (
                  <IconButton
                    key={index}
                    aria-label="delete"
                    onClick={() => handleClick(index)}
                    style={{ color: clicked ? "black" : "gray" }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                )}
                {/* <Button
                  variant="contained"
                  color="success"
                  disabled={slot.booked}
                  onClick={() => handleBooking(index)}
                >
                  {slot.booked ? "Booked" : "Book"}
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default PitchBooking;
