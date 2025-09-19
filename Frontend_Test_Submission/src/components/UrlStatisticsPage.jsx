import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1/urls";

function UrlStatisticsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUrls = async () => {
      try {
        const knownShortcodes = [
          "My Portfolio",
          "My Linkedin",
          "Ankit's Portfolio",
          "Portfolio",
        ];

        const allStats = await Promise.all(
          knownShortcodes.map(async (shortcode) => {
            const res = await axios.get(`${API_BASE_URL}/${shortcode}`);
            return { shortcode, ...res.data };
          })
        );
        setUrls(allStats);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to fetch URL statistics. Please ensure the backend is running and you have created URLs."
        );
        setLoading(false);
      }
    };

    fetchAllUrls();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (urls.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No URL statistics to display. Shorten a URL first!
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Grid container spacing={3}>
        {urls.map((url) => (
          <Grid item xs={12} key={url.shortcode}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Shortcode: {url.shortcode}
                </Typography>
                <Typography color="text.secondary">
                  Original URL:{" "}
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.originalUrl}
                  </a>
                </Typography>
                <Typography color="text.secondary">
                  Total Clicks: **{url.totalClicks}**
                </Typography>
                <Typography color="text.secondary">
                  Created: {new Date(url.creationDate).toLocaleString()}
                </Typography>
                <Typography color="text.secondary">
                  Expires: {new Date(url.expiryDate).toLocaleString()}
                </Typography>

                {url.detailedClicks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Detailed Click Data:
                    </Typography>
                    <List dense>
                      {url.detailedClicks.map((click, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`Timestamp: ${new Date(
                              click.timestamp
                            ).toLocaleString()}`}
                            secondary={`Source: ${click.source}, Location: ${click.geoLocation}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UrlStatisticsPage;
