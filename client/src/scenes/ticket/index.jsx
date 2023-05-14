import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer";

import axios from "../../state/axios-instance";

const Ticket = () => {
  const token = useSelector((state) => state.global.token);
  const user = useSelector((state) => state.global.user);

  const [tickets, setTickets] = useState();

  const handleCancelTicket = (ticketId) => {
    // Logic to cancel the ticket
    console.log(`Cancel ticket with ID: ${ticketId}`);
    // axios;
  };

  const dataFake = {
    pitches: [
      {
        id: "1",
        stadium_name: "Phu tho",
        pitch_id: "6440f46775e31e79c32cbfb1",
        pitch_name: "San 1",
        time: "2023-05-14T07:00:00.000+00:00",
        price: 400000,
      },
      {
        id: "2",
        stadium_name: "Phu tho",
        pitch_id: "6440f46775e31e79c32cbfb1",
        pitch_name: "San 1",
        time: "2023-05-14T08:00:00.000+00:00",
        price: 400000,
      },
    ],
  };

  useEffect(() => {
    const data = {
      user_id: user._id,
    };
    axios
      .post("/api/booking/userticket", data)
      .then((res) => {
        const updatedTickets = res.data.data.map((ticket) => {
          const date = new Date(ticket.time);

          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          });

          const formattedTime = date.toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "numeric",
            minute: "numeric",
            timeZone: "GMT",
          });

          return {
            ...ticket,
            formattedDate,
            formattedTime,
          };
        });

        // console.log(updatedTickets);
        console.log("UPDATED TICKET", updatedTickets);
        setTickets(updatedTickets);
        // setTickets(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("ticket FAKE", tickets);
  }, [tickets]);

  return (
    <div className="w-full" style={{ marginTop: "100px" }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2">
          User Name: {user.user_name}
        </Typography>
        <Typography variant="h5" component="h3">
          Tickets:
        </Typography>
        {tickets &&
          tickets.map((ticket) => (
            <Card
              // key={ticket.ticket_id}
              variant="outlined"
              style={{ marginBottom: "10px" }}
            >
              <CardContent>
                <Typography variant="body1" component="p">
                  Stadium Name: {ticket.stadium}
                </Typography>
                <Typography variant="body1" component="p">
                  Time Booking: {ticket.formattedDate} {ticket.formattedTime}
                </Typography>
                <Typography variant="body1" component="p">
                  Price: {ticket.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancelTicket(ticket.id)}
                >
                  Cancel Ticket
                </Button>
              </CardActions>
            </Card>
          ))}
        <Footer />
      </Container>
      {/* Footer */}
    </div>
  );
};

export default Ticket;
