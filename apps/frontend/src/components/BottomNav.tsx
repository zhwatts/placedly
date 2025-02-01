/** @format */

import { Box } from "@mui/material";

export function BottomNav() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 40,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: 2,
        zIndex: 10,
      }}
    >
      <img
        src="/placedly_logo.png"
        alt="Logo"
        style={{
          height: "40px",
          width: "auto",
          opacity: 0.35,
        }}
      />
    </Box>
  );
}
