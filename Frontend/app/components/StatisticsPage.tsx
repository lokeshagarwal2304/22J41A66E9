"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  Alert,
  Link,
  Grid,
} from "@mui/material"
import { Refresh, Launch } from "@mui/icons-material"
import { Log } from "../utils/logger"
import { getAllUrls, type UrlData } from "../utils/storage"

interface StatisticsPageProps {
  onNavigate: (page: "shortener" | "statistics") => void
}

export default function StatisticsPage({ onNavigate }: StatisticsPageProps) {
  const [urls, setUrls] = useState<UrlData[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  const loadData = () => {
    const data = getAllUrls()
    setUrls(data)
    setCurrentTime(Date.now())
    Log("frontend", "info", "page", "Statistics data loaded")
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (expiryTime: number) => {
    const remaining = expiryTime - currentTime
    if (remaining <= 0) return "Expired"

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    return `${minutes}m ${seconds}s`
  }

  const getStatus = (expiryTime: number) => {
    return expiryTime > currentTime ? "Active" : "Expired"
  }

  const getStatusColor = (expiryTime: number) => {
    return expiryTime > currentTime ? "success" : "error"
  }

  const handleShortUrlClick = (shortcode: string) => {
    const shortUrl = `${window.location.origin}/${shortcode}`
    window.open(shortUrl, "_blank")
    Log("frontend", "info", "component", `Short URL clicked: ${shortcode}`)
  }

  const activeUrls = urls.filter((url) => url.expiryTime > currentTime)
  const expiredUrls = urls.filter((url) => url.expiryTime <= currentTime)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            flex: 1,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #dc004e)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Analytics Dashboard
        </Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={loadData}>
          Refresh
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary.main">
                  {urls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total URLs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="success.main">
                  {activeUrls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active URLs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" color="error.main">
                  {expiredUrls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expired URLs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {urls.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={() => onNavigate("shortener")}>
              Create URLs
            </Button>
          }
        >
          No shortened URLs found. Create your first short URL!
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Original URL</strong>
                </TableCell>
                <TableCell>
                  <strong>Short URL</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Time Remaining</strong>
                </TableCell>
                <TableCell>
                  <strong>Clicks</strong>
                </TableCell>
                <TableCell>
                  <strong>Created</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.shortcode} hover>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Link href={url.originalUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                      {url.originalUrl}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      endIcon={<Launch />}
                      onClick={() => handleShortUrlClick(url.shortcode)}
                      sx={{
                        fontFamily: "monospace",
                        textTransform: "none",
                        justifyContent: "flex-start",
                      }}
                    >
                      /{url.shortcode}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatus(url.expiryTime)}
                      color={getStatusColor(url.expiryTime) as "success" | "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={url.expiryTime > currentTime ? "text.primary" : "error"}
                      sx={{ fontFamily: "monospace" }}
                    >
                      {formatTimeRemaining(url.expiryTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={url.clickCount} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box component="footer" textAlign="center" py={3} mt={4}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ by Lokesh Agarwal
        </Typography>
      </Box>
    </Container>
  )
}
