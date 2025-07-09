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
} from "@mui/material"
import { ArrowBack, Refresh } from "@mui/icons-material"
import Link from "next/link"
import { Log } from "../utils/logger"
import { getAllUrls, type UrlData } from "../utils/storage"

export default function Analytics() {
  const [urls, setUrls] = useState<UrlData[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  const loadData = () => {
    const data = getAllUrls()
    setUrls(data)
    setCurrentTime(Date.now())
    Log("frontend", "info", "page", "Analytics data loaded")
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

    const minutes = Math.floor(remaining / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getStatus = (expiryTime: number) => {
    return expiryTime > currentTime ? "Active" : "Expired"
  }

  const getStatusColor = (expiryTime: number) => {
    return expiryTime > currentTime ? "success" : "error"
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Home
          </Button>
        </Link>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          Analytics Dashboard
        </Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={loadData}>
          Refresh
        </Button>
      </Box>

      {urls.length === 0 ? (
        <Alert severity="info">No shortened URLs found. Create your first short URL on the home page!</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Original URL</strong>
                </TableCell>
                <TableCell>
                  <strong>Shortcode</strong>
                </TableCell>
                <TableCell>
                  <strong>Time Remaining</strong>
                </TableCell>
                <TableCell>
                  <strong>Clicks</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
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
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {url.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {url.shortcode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={url.expiryTime > currentTime ? "text.primary" : "error"}>
                      {formatTimeRemaining(url.expiryTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={url.clickCount} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatus(url.expiryTime)}
                      color={getStatusColor(url.expiryTime) as "success" | "error"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Total URLs: {urls.length} | Active: {urls.filter((url) => url.expiryTime > currentTime).length} | Expired:{" "}
          {urls.filter((url) => url.expiryTime <= currentTime).length}
        </Typography>
      </Box>
    </Container>
  )
}
