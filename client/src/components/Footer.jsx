import React from "react";
import { Typography, Container, Link } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        TEAM 2 - 20KTPM3
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Footer() {
  return (
    <Container className="pb-1">
      <Copyright sx={{ mt: 2, mb: 4 }} />
    </Container>
  );
}

export default Footer;
