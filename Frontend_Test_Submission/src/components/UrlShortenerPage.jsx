import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import validator from "validator";

const API_BASE_URL = "http://localhost:5000/api/v1/urls/";

function UrlShortenerPage() {
  const [urls, setUrls] = useState([
    {
      id: 1,
      originalUrl: "",
      validity: "",
      shortcode: "",
      result: null,
      error: null,
      loading: false,
    },
  ]);

  const handleUrlChange = (id, e) => {
    const { name, value } = e.target;
    setUrls(
      urls.map((url) =>
        url.id === id
          ? { ...url, [name]: value, result: null, error: null }
          : url
      )
    );
  };

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([
        ...urls,
        {
          id: urls.length + 1,
          originalUrl: "",
          validity: "",
          shortcode: "",
          result: null,
          error: null,
          loading: false,
        },
      ]);
    }
  };

  const handleSubmit = async (id) => {
    const urlToShorten = urls.find((url) => url.id === id);
    if (!urlToShorten.originalUrl) {
      return alert("URL cannot be empty.");
    }

    if (
      !validator.isURL(urlToShorten.originalUrl, { require_protocol: true })
    ) {
      return setUrls(
        urls.map((url) =>
          url.id === id
            ? {
                ...url,
                error: "Invalid URL. Please include http:// or https://",
              }
            : url
        )
      );
    }

    setUrls(
      urls.map((url) =>
        url.id === id ? { ...url, loading: true, error: null } : url
      )
    );

    try {
      const payload = {
        originalUrl: urlToShorten.originalUrl,
        validity: urlToShorten.validity
          ? parseInt(urlToShorten.validity)
          : undefined,
        shortcode: urlToShorten.shortcode || undefined,
      };

      const res = await axios.post(`${API_BASE_URL}`, payload);
      setUrls(
        urls.map((url) =>
          url.id === id ? { ...url, result: res.data, loading: false } : url
        )
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      setUrls(
        urls.map((url) =>
          url.id === id ? { ...url, error: errorMessage, loading: false } : url
        )
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Shorten URLs
      </Typography>
      {urls.map((url) => (
        <Box
          key={url.id}
          sx={{ mb: 4, p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original URL"
                name="originalUrl"
                value={url.originalUrl}
                onChange={(e) => handleUrlChange(url.id, e)}
                error={Boolean(url.error)}
                helperText={url.error}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Validity (min)"
                name="validity"
                type="number"
                value={url.validity}
                onChange={(e) => handleUrlChange(url.id, e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                name="shortcode"
                value={url.shortcode}
                onChange={(e) => handleUrlChange(url.id, e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleSubmit(url.id)}
                disabled={url.loading}
              >
                {url.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Shorten"
                )}
              </Button>
            </Grid>
          </Grid>
          {url.result && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Shortened URL:{" "}
                <a
                  href={url.result.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.result.shortLink}
                </a>
                <br />
                Expires on: {new Date(url.result.expiry).toLocaleString()}
              </Alert>
            </Box>
          )}
        </Box>
      ))}
      {urls.length < 5 && (
        <Button variant="outlined" onClick={handleAddUrl} sx={{ mb: 4 }}>
          Add Another URL
        </Button>
      )}
    </Box>
  );
}

export default UrlShortenerPage;
