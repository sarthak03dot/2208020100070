import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

import UrlShortenerPage from "./components/UrlShortenerPage";
import UrlStatisticsPage from "./components/UrlStatisticsPage";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" fontWeight={600} sx={{ flexGrow: 1 }}>
            URL Shortener App
          </Typography>
          <Button
            color="#fff"
            component={Link}
            to="/"
            sx={{ border: "2px solid #ddd", mx: 2, p: 1 }}
          >
            Shorten URL
          </Button>
          <Button
            color="#fff"
            component={Link}
            to="/stats"
            sx={{ border: "2px solid #ddd", mx: 2, p: 1 }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/stats" element={<UrlStatisticsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
