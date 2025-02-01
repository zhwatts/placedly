/** @format */

import { Weather } from "../hooks/useLocation";
import { Card, CardContent, Box, Typography, useTheme } from "@mui/material";

interface WeatherCardProps {
  weather: Weather;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const theme = useTheme();
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            <Typography variant="h4" component="div">
              {weather.temperature}°F
              <Typography
                component="span"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                Feels like {weather.feelsLike}°F
              </Typography>
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {weather.description.charAt(0).toUpperCase() +
                weather.description.slice(1)}
            </Typography>
            <Typography color="text.secondary">
              Humidity: {weather.humidity}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
