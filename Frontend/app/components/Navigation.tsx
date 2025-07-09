"use client"
import { AppBar, Toolbar, Typography, Box, Container, Chip } from "@mui/material"
import { Link as LinkIcon, Analytics } from "@mui/icons-material"

interface NavigationProps {
  currentPage: "shortener" | "statistics"
  onNavigate: (page: "shortener" | "statistics") => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #ffffff, #e3f2fd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SmartURLX
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              icon={<LinkIcon />}
              label="Shortener"
              clickable
              onClick={() => onNavigate("shortener")}
              color={currentPage === "shortener" ? "secondary" : "default"}
              variant={currentPage === "shortener" ? "filled" : "outlined"}
              sx={{ color: "white", borderColor: "white" }}
            />
            <Chip
              icon={<Analytics />}
              label="Statistics"
              clickable
              onClick={() => onNavigate("statistics")}
              color={currentPage === "statistics" ? "secondary" : "default"}
              variant={currentPage === "statistics" ? "filled" : "outlined"}
              sx={{ color: "white", borderColor: "white" }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
