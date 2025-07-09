"use client"
import { Paper, TextField, Grid, Typography, IconButton, Box } from "@mui/material"
import { Delete, Link as LinkIcon, Schedule, Code } from "@mui/icons-material"

interface URLEntry {
  id: string
  longUrl: string
  customShortcode: string
  validityMinutes: string
}

interface URLInputFormProps {
  entry: URLEntry
  index: number
  onUpdate: (id: string, field: keyof URLEntry, value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export default function URLInputForm({ entry, index, onUpdate, onRemove, canRemove }: URLInputFormProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" color="primary">
          URL #{index + 1}
        </Typography>
        {canRemove && (
          <IconButton onClick={() => onRemove(entry.id)} color="error" size="small">
            <Delete />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Long URL"
            placeholder="https://example.com/very/long/url"
            value={entry.longUrl}
            onChange={(e) => onUpdate(entry.id, "longUrl", e.target.value)}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Custom Shortcode (Optional)"
            placeholder="mylink123"
            value={entry.customShortcode}
            onChange={(e) => onUpdate(entry.id, "customShortcode", e.target.value)}
            InputProps={{
              startAdornment: <Code sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            helperText="3-20 alphanumeric characters"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Validity (Minutes)"
            type="number"
            placeholder="30"
            value={entry.validityMinutes}
            onChange={(e) => onUpdate(entry.id, "validityMinutes", e.target.value)}
            InputProps={{
              startAdornment: <Schedule sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            helperText="Default: 30 minutes"
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
