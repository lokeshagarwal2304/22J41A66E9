"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Container, Typography, Paper, Box, Button, CircularProgress } from "@mui/material"
import Link from "next/link"
import { Error, Home } from "@mui/icons-material"
import { Log } from "../utils/logger"
import { getUrlByShortcode, incrementClickCount } from "../utils/storage"

export default function Redirect() {
  const { shortcode } = useParams<{ shortcode: string }>()
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
    }, 1000)
  }, [shortcode])

  if (loading && !error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we redirect you to your destination.
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Error sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error === "Link expired"
            ? "This short URL has expired and is no longer valid."
            : "The short URL you're looking for doesn't exist or has been removed."}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" passHref>
            <Button variant="contained" startIcon={<Home />}>
              Go Home
            </Button>
          </Link>
          <Link href="/analytics" passHref>
            <Button variant="outlined">View Analytics</Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}
