import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker, { CalendarContainer } from "react-datepicker";
import Footer from "../../components/Footer";
import PitchBooking from "../test";
import DataTable from "../../components/ScheduleBooking";
import axios from "../../state/axios-instance";
import Loading from "../../components/Loading";

// TEST
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Button,
  TableRow,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom";

const BookingPage = () => {
  const token = useSelector((state) => state.global.token);
  const user = useSelector((state) => state.global.user);
  const location = useLocation();
  const navigate = useNavigate();

  /*  ADD PART */
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([true, true]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [informationTicket, setInformationTicket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [bookingTime, setBookingTime] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const currentDate = new Date();
  const oneWeekLater = new Date(
    currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  // Adjust this value as needed
  const [iconClicked2, setIconClicked2] = useState({});

  //load stadium
  useEffect(() => {
    axios
      .get("/api/stadium")
      .then((res) => setStadiums(res.data))
      .catch((err) => console.log(err));
  }, []);

  // get stadium choice
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stadium = searchParams.get("stadium");
    if (stadium) {
      setSelectedStadium(decodeURIComponent(stadium));
    }
  }, [location.search]);

  // Fetch Category of Stadium
  useEffect(() => {
    if (selectedStadium !== "") {
      axios
        .get(`/api/stadium/${selectedStadium}/category`)
        .then((res) => setCategories(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedStadium]);

  useEffect(() => {
    console.log("total price:", totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    console.log("information Ticket:", informationTicket);
  }, [informationTicket]);

  useEffect(() => {
    if (bookingTime.length > 0) {
      console.log("booking time:", bookingTime);
      const newIconClicked = {};
      bookingTime.forEach((booking) => {
        booking.time.forEach((time, index) => {
          const key = `${index}_${booking.pitch._id}`;
          newIconClicked[key] = false;
        });
      });
      setIconClicked2(newIconClicked);
    }
  }, [bookingTime]);

  const handleSelectDate = (date) => {
    setStartDate(date);
  };

  const handleGetBookingTime = async () => {
    setIsLoading(true);
    try {
      let date = new Date(startDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const combinedDateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // console.log("Day: ", `${combinedDateTime}T00:00:00.000+00:00`);
      await axios
        .get(`/api/stadium/${selectedStadium}/category/${selectedCategory}`, {
          params: {
            date: `${combinedDateTime}T00:00:00.000+00:00`,
          },
        })
        .then((res) => setBookingTime(res.data))
        .catch((err) => console.log(err));
      // setBookingTime(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  function handleScheduleClick(slot, price, pitchId, index) {
    const updatedIconClicked2 = iconClicked2;
    console.log("slot", slot);
    console.log("pitchId", pitchId);
    console.log("index", index);

    updatedIconClicked2[index + "_" + pitchId] =
      !updatedIconClicked2[index + "_" + pitchId];
    setIconClicked2(updatedIconClicked2);

    let total_price = totalPrice;
    if (updatedIconClicked2[index + "_" + pitchId] === true) {
      total_price += Number(price);
      console.log("BOOKING TIME SS", bookingTime);
      const pitchName = bookingTime.filter(
        (book) => book.pitch._id === pitchId
      )[0].pitch.name;

      console.log("PITCH NAME SS:", pitchName);

      const newinfo = {
        pitchId,
        pitchName,
        time: slot.start + "-" + slot.end,
        price: price,
      };
      setInformationTicket([...informationTicket, newinfo]);
    } else {
      total_price -= Number(price);

      const filteredInformationTicket = informationTicket.filter((info) => {
        return !(
          info.pitchId === pitchId &&
          info.time === slot.start + "-" + slot.end &&
          info.price === price
        );
      });
      setInformationTicket(filteredInformationTicket);
      setInformationTicket(filteredInformationTicket);
    }
    setTotalPrice(total_price);
  }

  const handleNavigate = () => {
    const stadiumName = stadiums.filter(
      (stadium) => stadium._id === selectedStadium
    )[0].name;
    const data = {
      totalPrice,
      informationTicket,
      stadiumName,
      stadiumId: selectedStadium,
      date: startDate,
    };
    navigate("/bookingDetail", { state: { data } });
  };

  /* ****************************************  */

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <div className="booking_banner-container">
        <div className="booking_banner-content">
          <div className="hero-text p-3 px-3 bg-light rounded-4 bg-opacity-50 color-green">
            <h1>Book now</h1>
            <p className="fs-5 pt-1 pb-1">
              Find and book your perfect futsal pitch online, hassle-free.
            </p>
          </div>
        </div>
      </div>

      <div className="container d-flex flex-column justify-content-center mx-auto mt-5">
        {/* ******************************** */}

        <Container className="d-flex flex-column justify-content-center">
          <h1 className="mb-3">Pitch Booking</h1>
          <select
            class="form-select form-select mb-3 w-50 mx-auto"
            aria-label=".form-select example"
            id="stadium-select"
            value={selectedStadium}
            onChange={(e) => {
              setSelectedStadium(e.target.value);
              setSelectedCategory("");
              setIsClicked(false);
              setInformationTicket([]);
              setTotalPrice(0);
            }}
          >
            {stadiums.map((stadium) => (
              <option value={stadium._id} key={stadium._id}>
                {stadium.name}
              </option>
            ))}
          </select>

          <select
            class="form-select form-select mb-3 w-50 mx-auto"
            aria-label=".form-select example"
            id="category-select"
            value={selectedCategory}
            onChange={(e) => {
              setIsClicked(false);
              setSelectedCategory(e.target.value);
              setInformationTicket([]);
              setTotalPrice(0);
            }}
          >
            <option value="" disabled selected>
              Select category
            </option>
            {categories.San5 && <option value="San5">San 5</option>}
            {categories.San7 && <option value="San7">San 7</option>}
          </select>

          {/* DATE SELECTOR */}

          <div className="d-flex flex-column align-items-center">
            {/* <h1>Select a date</h1> */}
            <div className="w-100">
              <DatePicker
                selected={startDate}
                onChange={(date) => handleSelectDate(date)}
                inline
                minDate={currentDate}
                maxDate={oneWeekLater}
              />
            </div>
            {
              <div className="confirm-btn" style={{ marginTop: "16px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsClicked(true);
                    handleGetBookingTime();
                    setInformationTicket([]);
                    setTotalPrice(0);
                  }}
                >
                  Confirm
                </Button>
              </div>
            }
          </div>

          {isLoading && selectedCategory && selectedStadium && startDate && (
            <Loading />
          )}

          {/* TABLE BOOKING */}
          {startDate &&
            selectedCategory &&
            selectedStadium &&
            !isLoading &&
            isClicked && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Price</TableCell>
                    {bookingTime.map((time) => (
                      <TableCell key={time.pitch.name} colSpan={time.colSpan}>
                        {time.pitch.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingTime[0].time.map((timeSlot, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${timeSlot.start} - ${timeSlot.end}`}</TableCell>
                      <TableCell>
                        {index < 11
                          ? bookingTime[0].priceDaytime
                          : bookingTime[0].priceNighttime}{" "}
                        VND
                      </TableCell>
                      {bookingTime.map((booking) => (
                        <TableCell key={booking.pitch._id}>
                          {booking.time[index].check ? (
                            <IconButton
                              aria-label="delete"
                              style={{
                                color: "red",
                              }}
                              disabled
                            >
                              <CancelIcon disabled />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="check"
                              onClick={() =>
                                handleScheduleClick(
                                  booking.time[index],
                                  index < 11
                                    ? booking.priceDaytime
                                    : booking.priceNighttime,
                                  booking.pitch._id,
                                  index
                                )
                              }
                              style={{
                                color: iconClicked2[
                                  index + "_" + booking.pitch._id
                                ]
                                  ? "green"
                                  : "gray",
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </Container>
      </div>

      <Footer />

      {totalPrice !== 0 && (
        <div
          className="w-100 d-flex justify-content-between shadow-lg p-3 bg-success"
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 1,
            color: "white",
          }}
        >
          <div>
            <div>TOTAL PRICE</div>
            {totalPrice.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </div>
          <Button
            onClick={handleNavigate}
            // href="/bookingDetail"
            variant="outline-success"
            style={{ zIndex: 1 }}
          >
            Book now
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
