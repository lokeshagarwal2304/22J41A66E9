"use client"

import { useState } from "react"
import { Container, Typography, Paper, Box, Button, Alert, Grid, Divider } from "@mui/material"
import { Add, Clear, Link as LinkIcon } from "@mui/icons-material"
import URLInputForm from "./URLInputForm"
import ResultsDisplay from "./ResultsDisplay"
import { Log } from "../utils/logger"
import { createShortUrl, type ShortUrlResult } from "../utils/urlShortener"

interface URLEntry {
  id: string
  longUrl: string
  customShortcode: string
  validityMinutes: string
}

interface ProcessedResult extends ShortUrlResult {
  id: string
  longUrl: string
}

export default function URLShortenerPage() {
  const [urlEntries, setUrlEntries] = useState<URLEntry[]>([
    { id: "1", longUrl: "", customShortcode: "", validityMinutes: "" },
  ])
  const [results, setResults] = useState<ProcessedResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [globalError, setGlobalError] = useState("")

  const addUrlEntry = () => {
    if (urlEntries.length < 5) {
      const newId = (urlEntries.length + 1).toString()
      setUrlEntries([...urlEntries, { id: newId, longUrl: "", customShortcode: "", validityMinutes: "" }])
      Log("frontend", "info", "component", `Added new URL entry slot ${newId}`)
    }
  }

  const removeUrlEntry = (id: string) => {
    if (urlEntries.length > 1) {
      setUrlEntries(urlEntries.filter((entry) => entry.id !== id))
      Log("frontend", "info", "component", `Removed URL entry slot ${id}`)
    }
  }

  const updateUrlEntry = (id: string, field: keyof URLEntry, value: string) => {
    setUrlEntries(urlEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const clearAllEntries = () => {
    setUrlEntries([{ id: "1", longUrl: "", customShortcode: "", validityMinutes: "" }])
    setResults([])
    setGlobalError("")
    Log("frontend", "info", "component", "Cleared all URL entries")
  }

  const validateEntry = (entry: URLEntry): string | null => {
    if (!entry.longUrl.trim()) {
      return "URL is required"
    }

    try {
      new URL(entry.longUrl)
    } catch {
      return "Please enter a valid URL"
    }

    if (entry.customShortcode && !/^[a-zA-Z0-9]+$/.test(entry.customShortcode)) {
      return "Custom shortcode must be alphanumeric"
    }

    if (entry.customShortcode && (entry.customShortcode.length < 3 || entry.customShortcode.length > 20)) {
      return "Custom shortcode must be between 3-20 characters"
    }

    if (entry.validityMinutes) {
      const validity = Number.parseInt(entry.validityMinutes)
      if (isNaN(validity) || validity <= 0) {
        return "Validity must be a positive number"
      }
    }

    return null
  }

  const processUrls = async () => {
    setIsProcessing(true)
    setGlobalError("")
    setResults([])

    Log("frontend", "info", "component", "Starting URL processing")

    const validEntries = urlEntries.filter((entry) => entry.longUrl.trim())

    if (validEntries.length === 0) {
      setGlobalError("Please enter at least one URL to shorten")
      setIsProcessing(false)
      return
    }

    // Validate all entries first
    const validationErrors: string[] = []
    for (const entry of validEntries) {
      const error = validateEntry(entry)
      if (error) {
        validationErrors.push(`Entry ${entry.id}: ${error}`)
      }
    }

    if (validationErrors.length > 0) {
      setGlobalError(validationErrors.join("; "))
      setIsProcessing(false)
      Log("frontend", "warn", "component", `Validation errors: ${validationErrors.join("; ")}`)
      return
    }

    // Check for duplicate custom shortcodes
    const customShortcodes = validEntries
      .filter((entry) => entry.customShortcode.trim())
      .map((entry) => entry.customShortcode.trim())

    const duplicateShortcodes = customShortcodes.filter((code, index) => customShortcodes.indexOf(code) !== index)

    if (duplicateShortcodes.length > 0) {
      setGlobalError(`Duplicate custom shortcodes found: ${duplicateShortcodes.join(", ")}`)
      setIsProcessing(false)
      Log("frontend", "warn", "component", `Duplicate shortcodes detected: ${duplicateShortcodes.join(", ")}`)
      return
    }

    // Process each URL
    const processedResults: ProcessedResult[] = []

    for (const entry of validEntries) {
      try {
        const validityMinutes = entry.validityMinutes ? Number.parseInt(entry.validityMinutes) : 30
        const result = createShortUrl(entry.longUrl, entry.customShortcode || undefined, validityMinutes)

        processedResults.push({
          ...result,
          id: entry.id,
          longUrl: entry.longUrl,
        })

        if (result.success) {
          Log("frontend", "info", "component", `Successfully created short URL for entry ${entry.id}`)
        } else {
          Log("frontend", "error", "component", `Failed to create short URL for entry ${entry.id}: ${result.error}`)
        }
      } catch (error) {
        processedResults.push({
          success: false,
          error: "An unexpected error occurred",
          id: entry.id,
          longUrl: entry.longUrl,
        })
        Log("frontend", "error", "component", `Unexpected error processing entry ${entry.id}`)
      }
    }

    setResults(processedResults)
    setIsProcessing(false)
    Log(
      "frontend",
      "info",
      "component",
      `URL processing completed. ${processedResults.filter((r) => r.success).length} successful, ${processedResults.filter((r) => !r.success).length} failed`,
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Typography variant="body1" color="text.secondary">
          Shorten up to 5 URLs concurrently with custom options and analytics
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinkIcon color="primary" />
            URL Entries ({urlEntries.length}/5)
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<Add />} onClick={addUrlEntry} disabled={urlEntries.length >= 5}>
              Add URL
            </Button>
            <Button variant="outlined" startIcon={<Clear />} onClick={clearAllEntries} color="secondary">
              Clear All
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {urlEntries.map((entry, index) => (
            <Grid item xs={12} key={entry.id}>
              <URLInputForm
                entry={entry}
                index={index}
                onUpdate={updateUrlEntry}
                onRemove={removeUrlEntry}
                canRemove={urlEntries.length > 1}
              />
              {index < urlEntries.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Grid>
          ))}
        </Grid>

        {globalError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {globalError}
          </Alert>
        )}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={processUrls}
            disabled={isProcessing}
            sx={{
              minWidth: 200,
              py: 1.5,
              background: "linear-gradient(45deg, #1976d2, #dc004e)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #c51162)",
              },
            }}
          >
            {isProcessing ? "Processing..." : "Shorten URLs"}
          </Button>
        </Box>
      </Paper>

      {results.length > 0 && <ResultsDisplay results={results} />}

      <Box component="footer" textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ by Lokesh Agarwal
        </Typography>
      </Box>
    </Container>
  )
}
