/** @format */

import { Box } from "@mui/material";

interface MapBackgroundProps {
  lat: number;
  lon: number;
}

export function MapBackground({ lat, lon }: MapBackgroundProps) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Removed pin, keeping just the map view
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${lon},${lat},7,0/1280x720@2x?access_token=${mapboxToken}`;
  // const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+64ffda(${lon},${lat})/${lon},${lat},5,0/1280x720@2x?access_token=${mapboxToken}`;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(10, 25, 47, 0.65)",
        },
        "& img": {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      }}
    >
      <img src={mapUrl} alt="Location map" />
    </Box>
  );
}
