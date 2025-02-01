/** @format */

import { useLocation } from "./hooks/useLocation";
import { useCurrentTime } from "./hooks/useCurrentTime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Typography, Box } from "@mui/material";
import { theme } from "./theme";
import { MapBackground } from "./components/MapBackground";

interface Location {
  city: string | null;
  region: string | null;
  country: string | null;
  ll: [number, number];
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
  const { location, weather, isLoadingWeather, weatherError } = useLocation();
  const { date, time } = useCurrentTime();

  const getLocationString = (location: Location) =>
    location.city && location.region
      ? `${location.city}, ${location.region}`
      : "your current location";

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
          Hello! Looks like you're in {location && getLocationString(location)}.
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          It is currently {date}, and the time is {time}
        </Typography>

        {isLoadingWeather ? (
          <Typography>Loading weather...</Typography>
        ) : weatherError ? (
          <Typography color="error">
            Sorry, I was unable to load weather forecast
          </Typography>
        ) : weather ? (
          <WeatherContent weather={weather} />
        ) : null}
      </Box>
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
