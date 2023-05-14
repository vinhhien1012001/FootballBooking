import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { themeSettings } from "./theme";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./scenes/login";
import Register from "./scenes/register";
import HomePage from "./scenes/homepage";
import BookingPage from "./scenes/booking";
import BookingDetail from "./components/BookingDetails";
import Ticket from "./scenes/ticket";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.global.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route
              path="/students"
              element={isAuth ? <Students /> : <Navigate to="/login" />}
            /> */}
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route
              path="/bookingDetail"
              element={isAuth ? <BookingDetail /> : <Navigate to="/login" />}
            />
            <Route
              path="/ticket"
              element={isAuth ? <Ticket /> : <Navigate to="/login" />}
            />
          </Routes>
          {/* <Footer /> */}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
