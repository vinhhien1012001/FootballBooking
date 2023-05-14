import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout, setMode } from "../state";
import {
  AppBar,
  // Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import profileImage from "../assets/img/profile.jpeg";
import logoImage from "../assets/img/logo.png";

const NavBar = () => {
  const user = useSelector((state) => state.global.user);
  const token = useSelector((state) => state.global.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    toast.success("Log out success!", {
      position: toast.POSITION.TOP_CENTER,
      theme: "colored",
      autoClose: 2000,
      hideProgressBar: false,
    });
    setAnchorEl(null);
    dispatch(setLogout());
  };

  const handleTicketDetail = () => {
    // toast.success("Log out success!", {
    //   position: toast.POSITION.TOP_CENTER,
    //   theme: "colored",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    // });
    setAnchorEl(null);
    navigate("/ticket");
    // dispatch(setLogout());
  };

  if (!user) {
    return (
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-lg"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 99,
        }}
      >
        <Container fluid className="container">
          <Navbar.Brand href="/">
            <img src={logoImage} alt="Bootstrap" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#">
                <button type="button" class="btn btn-light">
                  Contact Us
                </button>
              </Nav.Link>
              <Nav.Link href="#">
                <button type="button" class="btn btn-light">
                  Pitches
                </button>
              </Nav.Link>
            </Nav>
            <Nav
              className="my-2 my-lg-0 justify-content-end gap-3"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Button variant="outline-success" href="/login" className="">
                Log In
              </Button>
              <Button variant="success" href="/booking">
                Book now
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-lg"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container fluid className="container">
          <ToastContainer />
          <Navbar.Brand href="/">
            <img src={logoImage} alt="Bootstrap" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#">
                <button type="button" class="btn btn-light">
                  Contact Us
                </button>
              </Nav.Link>
              <Nav.Link href="#">
                <button type="button" class="btn btn-light">
                  Pitches
                </button>
              </Nav.Link>
            </Nav>
            <Nav
              className="my-2 my-lg-0 justify-content-end gap-3"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Button
                variant="outline-success"
                onClick={handleClick}
                className="d-flex align-items-center"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textTransform: "none",
                  gap: "1rem",
                }}
              >
                {/* <Box
                  component="img"
                  alt="profile"
                  src={profileImage}
                  height="32px"
                  width="32px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                /> */}
                <Box textAlign="left">
                  <Typography fontWeight="bold" fontSize="0.85rem">
                    Welcome {user.user_name}!
                  </Typography>
                </Box>
                <ArrowDropDownOutlined
                  sx={{ color: "black", fontSize: "25px" }}
                />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                <MenuItem onClick={handleTicketDetail}>Ticket</MenuItem>
              </Menu>
              <Button variant="success" href="/booking">
                Book now
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
};

export default NavBar;
