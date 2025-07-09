"use client"

import React from "react"
import { Paper, Typography, Box, Alert, Grid, TextField, Button, Chip, Divider } from "@mui/material"
import { ContentCopy, CheckCircle, Error, Schedule } from "@mui/icons-material"
import { Log } from "../utils/logger"
import type { ShortUrlResult } from "../utils/urlShortener"

interface ProcessedResult extends ShortUrlResult {
  id: string
  longUrl: string
}

interface ResultsDisplayProps {
  results: ProcessedResult[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const copyToClipboard = async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      Log("frontend", "info", "component", `Short URL copied to clipboard: ${shortUrl}`)
    } catch (error) {
      Log("frontend", "error", "component", "Failed to copy URL to clipboard")
    }
  }

  const formatExpiryDate = (expiryTime: number) => {
    return new Date(expiryTime).toLocaleString()
  }

  const successfulResults = results.filter((r) => r.success)
  const failedResults = results.filter((r) => !r.success)

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom color="primary">
        Results
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Chip icon={<CheckCircle />} label={`${successfulResults.length} Successful`} color="success" sx={{ mr: 1 }} />
        {failedResults.length > 0 && <Chip icon={<Error />} label={`${failedResults.length} Failed`} color="error" />}
      </Box>

      {successfulResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Successfully Shortened URLs
          </Typography>
          <Grid container spacing={3}>
            {successfulResults.map((result) => (
              <Grid item xs={12} key={result.id}>
                <Paper variant="outlined" sx={{ p: 3, bgcolor: "success.50" }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Original URL:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-all" }}>
                    {result.longUrl}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Shortened URL:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      value={result.shortUrl}
                      InputProps={{
                        readOnly: true,
                      }}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(result.shortUrl!, result.id)}
                      disabled={copiedId === result.id}
                      size="small"
                    >
                      {copiedId === result.id ? "Copied!" : "Copy"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Expires: {formatExpiryDate(result.expiryTime!)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {failedResults.length > 0 && (
        <Box>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom color="error.main">
            Failed URLs
          </Typography>
          {failedResults.map((result) => (
            <Alert severity="error" key={result.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                URL #{result.id}: {result.longUrl}
              </Typography>
              <Typography variant="body2">Error: {result.error}</Typography>
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  )
}
