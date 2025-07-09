"use client"

import type React from "react"
import { useState } from "react"
import { Container, Typography, TextField, Button, Box, Paper, Alert, Grid, Chip, Divider } from "@mui/material"
import Link from "next/link"
import { ContentCopy, Analytics, Link as LinkIcon } from "@mui/icons-material"
import { Log } from "../utils/logger"
import { createShortUrl, isValidUrl } from "../utils/urlShortener"

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("")
  const [customShortcode, setCustomShortcode] = useState("")
  const [expiryMinutes, setExpiryMinutes] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setShortUrl("")

    Log("frontend", "info", "component", "URL shortening form submitted")

    // Validation
    if (!longUrl.trim()) {
      setError("Please enter a URL")
      Log("frontend", "warn", "component", "Form submitted without URL")
      return
    }

    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL")
      Log("frontend", "warn", "component", "Invalid URL format provided")
      return
    }

    if (customShortcode && !/^[a-zA-Z0-9]+$/.test(customShortcode)) {
      setError("Custom shortcode must be alphanumeric")
      Log("frontend", "warn", "component", "Invalid shortcode format provided")
      return
    }

    const expiry = expiryMinutes ? Number.parseInt(expiryMinutes) : 30
    if (expiry <= 0) {
      setError("Expiry time must be greater than 0")
      Log("frontend", "warn", "component", "Invalid expiry time provided")
      return
    }

    try {
      const result = createShortUrl(longUrl, customShortcode, expiry)
      if (result.success) {
        setShortUrl(result.shortUrl!)
        setSuccess("Short URL created successfully!")
        setLongUrl("")
        setCustomShortcode("")
        setExpiryMinutes("")
        Log("frontend", "info", "component", `Short URL created: ${result.shortcode}`)
      } else {
        setError(result.error!)
        Log("frontend", "error", "component", `Failed to create short URL: ${result.error}`)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      Log("frontend", "error", "component", "Unexpected error during URL creation")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    setSuccess("Short URL copied to clipboard!")
    Log("frontend", "info", "component", "Short URL copied to clipboard")
  }

  return (
    <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #dc004e)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SmartURLX
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Shorten. Share. Smartly.
        </Typography>
        <Link href="/analytics" passHref>
          <Chip icon={<Analytics />} label="View Analytics" clickable sx={{ mt: 2 }} />
        </Link>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter your long URL"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                variant="outlined"
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Custom shortcode (optional)"
                value={customShortcode}
                onChange={(e) => setCustomShortcode(e.target.value)}
                placeholder="mylink"
                variant="outlined"
                helperText="Alphanumeric characters only"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry time (minutes)"
                type="number"
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(e.target.value)}
                placeholder="30"
                variant="outlined"
                helperText="Default: 30 minutes"
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5 }}>
                Shorten URL
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {shortUrl && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your shortened URL:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                value={shortUrl}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={copyToClipboard}
                sx={{ minWidth: "fit-content" }}
              >
                Copy
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Box component="footer" textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ by Lokesh Agarwal
        </Typography>
      </Box>
    </Container>
  )
}
