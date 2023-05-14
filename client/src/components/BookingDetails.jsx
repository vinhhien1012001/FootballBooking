import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "../state/axios-instance";
import { useSelector } from "react-redux";

import SendIcon from "@mui/icons-material/Send";
import { useLocation, useNavigate } from "react-router-dom";

const BookingDetail = () => {
  const date = new Date().toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [checkedTerm, setCheckedTerm] = useState(false);
  // const [url, setUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.global.user);

  const data = location.state?.data;
  console.log("data", data);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = data.date.toLocaleDateString("vi-VN", options);

  const handleChooseMethodPayment = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleClickTerm = (event) => {
    setCheckedTerm(event.target.checked);
  };

  const handleCheckout = () => {
    // Convert date and time format
    console.log("user:", user);

    const combinedDateTime = `${data.date.getFullYear()}-${(
      data.date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${data.date.getDate().toString().padStart(2, "0")}`;

    const transformedData = {
      information_ticket: data.informationTicket.map((ticket) => ({
        pitch_id: ticket.pitchId,
        time: `${combinedDateTime}T${ticket.time.split("-")[0]}:00.000+00:00`,
        price: ticket.price, // Adjusted price value according to the example (replace with actual logic if needed)
      })),
      total: data.totalPrice,
      user_id: user._id,
      payment: paymentMethod,
    };

    console.log("COMBINED", transformedData);

    axios
      .post("/api/booking", transformedData)
      .then((res) => {
        console.log(res);
        window.location.href = res.data.url;
      })
      .catch((err) => console.log(err));

    // const dataSend = {};
  };

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
        <Container className="d-flex flex-column justify-content-center">
          {/* test */}
          <div class="row d-flex justify-content-between">
            <div class="col-12 col-lg-8 order-confirm">
              {/* Booking detail */}
              <div>
                <h2>Booking details</h2>
                <h5 className="pt-2">{data.stadiumName}</h5>
                <Typography variant="body1">{formattedDate}</Typography>

                {/* list of chosen time and pitch */}
                <div>
                  {data.informationTicket.map((book) => (
                    <div className="d-flex">
                      <Typography variant="body1" className="pe-3 fw-semibold">
                        {book.pitchName}
                      </Typography>
                      <Typography className="pe-3" variant="body1">
                        {book.time}
                      </Typography>
                      <Typography variant="body1">
                        {book.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-5">
                <h2>Payment Method</h2>

                {/* list of chosen time and pitch */}
                <div className="d-flex flex-column">
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={handleChooseMethodPayment}
                    >
                      <FormControlLabel
                        value="stripe"
                        control={<Radio />}
                        label="Pay with stripe"
                      />
                      {/* <FormControlLabel
                        value="momo"
                        control={<Radio />}
                        label="Pay with Momo"
                      /> */}
                    </RadioGroup>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedTerm}
                        onChange={handleClickTerm}
                        name="acceptTerms"
                        color="primary"
                      />
                    }
                    label="I accept the terms and conditions"
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-3">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{" "}
                  <span class="order-summary-values">
                    {data.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
                <p>
                  Tax: <span class="order-summary-values">0</span>
                </p>

                <hr />

                <p>
                  Total:{" "}
                  <span class="order-summary-values">
                    {data.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>

                <hr />
                <button
                  id="checkout_btn"
                  onClick={handleCheckout}
                  class="btn btn-warning btn-block"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BookingDetail;
