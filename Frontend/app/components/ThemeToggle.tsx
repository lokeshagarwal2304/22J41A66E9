"use client"
import { IconButton, Box } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"

interface ThemeToggleProps {
  darkMode: boolean
  toggleTheme: () => void
}

export default function ThemeToggle({ darkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  )
}
