/** @format */

import { useLocation } from "./hooks/useLocation";
import { useCurrentTime } from "./hooks/useCurrentTime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Typography,
  Box,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { theme } from "./theme";
import { MapBackground } from "./components/MapBackground";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";

interface Location {
  city: string | null;
  region: string | null;
  country: string | null;
  ll: [number, number];
  isApproximate: boolean;
}

const queryClient = new QueryClient();

function WeatherContent({ weather }: { weather: any }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        mt: 3,
      }}
    >
      <Box>
        <img
          src={iconUrl}
          alt={weather.description}
          style={{ width: 100, height: 100 }}
          onError={(e) => {
            console.error("Failed to load weather icon:", weather.icon);
            e.currentTarget.style.display = "none";
          }}
        />
      </Box>
      <Box>
        <Typography variant="h4" component="div" sx={{ color: "primary.main" }}>
          {weather.temperature}°F
          <Typography component="span" sx={{ ml: 1, color: "text.secondary" }}>
            Feels like {weather.feelsLike}°F
          </Typography>
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: "text.primary" }}>
          {weather.description.charAt(0).toUpperCase() +
            weather.description.slice(1)}
        </Typography>
        <Typography color="text.secondary">
          Humidity: {weather.humidity}%
        </Typography>
      </Box>
    </Box>
  );
}

function LocationInfo() {
  const {
    location,
    weather,
    isLoadingLocation,
    isLoadingWeather,
    weatherError,
    showLocationWarning,
  } = useLocation();
  const { date, time } = useCurrentTime();
  const [showSnackbar, setShowSnackbar] = useState(true);
  const [showPermissionError, setShowPermissionError] = useState(false);

  const handleRequestGeolocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "denied") {
          // Show instructions for enabling in browser settings
          setShowPermissionError(true);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            window.location.reload();
          },
          (error) => {
            console.log("Geolocation error:", error);
            setShowPermissionError(true);
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      } catch (error) {
        console.error("Permission error:", error);
        setShowPermissionError(true);
      }
    }
  };

  const getLocationString = (location: Location) => {
    if (!location.city || !location.region) {
      return "your current location";
    }
    const prefix = location.isApproximate
      ? "We think you're around "
      : "Looking good in ";
    return `${prefix}${location.city}, ${location.region}`;
  };

  if (isLoadingLocation || isLoadingWeather) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          Hang tight, we're looking you up...
        </Typography>
        <BottomNav />
      </Box>
    );
  }

  return (
    <>
      {location?.ll && (
        <MapBackground lat={location.ll[0]} lon={location.ll[1]} />
      )}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Hello! {location && getLocationString(location)}
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          It's {date}, and the time is {time}
        </Typography>

        {weatherError ? (
          <Typography color="error">
            Sorry, I was unable to load weather forecast
          </Typography>
        ) : weather ? (
          <WeatherContent weather={weather} />
        ) : null}
      </Box>

      <BottomNav />

      <Snackbar
        open={showLocationWarning && showSnackbar}
        autoHideDuration={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          sx={{ width: "100%" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRequestGeolocation}
            >
              Enable Location
            </Button>
          }
          onClose={() => setShowSnackbar(false)}
        >
          Using approximate location. Enable location services for better
          accuracy.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showPermissionError}
        autoHideDuration={6000}
        onClose={() => setShowPermissionError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          sx={{ width: "100%" }}
          onClose={() => setShowPermissionError(false)}
        >
          Please enable location access in your browser settings and refresh the
          page.
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LocationInfo />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
