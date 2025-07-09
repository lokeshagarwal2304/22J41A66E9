"use client"

import { useEffect, useState } from "react"
import { Container, Typography, Paper, Box, Button, CircularProgress } from "@mui/material"
import { Error, Home, Analytics } from "@mui/icons-material"
import { Log } from "../utils/logger"
import { getUrlByShortcode, incrementClickCount } from "../utils/storage"

interface RedirectHandlerProps {
  shortcode: string
}

export default function RedirectHandler({ shortcode }: RedirectHandlerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!shortcode) {
      setError("Invalid shortcode")
      setLoading(false)
      Log("frontend", "error", "page", "Redirect attempted with no shortcode")
      return
    }

    Log("frontend", "info", "page", `Redirect attempted for shortcode: ${shortcode}`)

    const urlData = getUrlByShortcode(shortcode)

    if (!urlData) {
      setError("Short URL not found")
      setLoading(false)
      Log("frontend", "warn", "page", `Shortcode not found: ${shortcode}`)
      return
    }

    if (urlData.expiryTime <= Date.now()) {
      setError("Link expired")
      setLoading(false)
      Log("frontend", "warn", "page", `Expired link accessed: ${shortcode}`)
      return
    }

    // Increment click count
    incrementClickCount(shortcode)
    Log("frontend", "info", "page", `Redirecting to: ${urlData.originalUrl}`)

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = urlData.originalUrl
    }, 1500)
  }, [shortcode])

  const navigateHome = () => {
    window.history.pushState({}, "", "/")
    window.location.reload()
  }

  const navigateStats = () => {
    window.history.pushState({}, "", "/statistics")
    window.location.reload()
  }

  if (loading && !error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 6 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we redirect you to your destination.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Shortcode: <code>{shortcode}</code>
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 6 }}>
        <Error sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error === "Link expired"
            ? "This short URL has expired and is no longer valid."
            : error === "Short URL not found"
              ? "The short URL you're looking for doesn't exist."
              : "An error occurred while processing your request."}
        </Typography>

        {shortcode && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Shortcode: <code>{shortcode}</code>
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" startIcon={<Home />} onClick={navigateHome}>
            Go Home
          </Button>
          <Button variant="outlined" startIcon={<Analytics />} onClick={navigateStats}>
            View Statistics
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
