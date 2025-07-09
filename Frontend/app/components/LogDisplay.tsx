"use client"

import { useState, useEffect } from "react"
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  Paper,
} from "@mui/material"
import { BugReport, Clear } from "@mui/icons-material"
import { getLogEntries, clearLogs, type LogEntry } from "../utils/logger"

export default function LogDisplay() {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const loadLogs = () => {
    setLogs(getLogEntries())
  }

  useEffect(() => {
    if (open) {
      loadLogs()
      const interval = setInterval(loadLogs, 1000)
      return () => clearInterval(interval)
    }
  }, [open])

  const handleClearLogs = () => {
    clearLogs()
    setLogs([])
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "error"
      case "warn":
        return "warning"
      case "info":
        return "info"
      case "debug":
        return "default"
      case "fatal":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <>
      <Fab
        size="small"
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1000,
          bgcolor: "grey.700",
          "&:hover": {
            bgcolor: "grey.600",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <BugReport />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: "80vh" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "grey.800",
            color: "white",
          }}
        >
          <Typography variant="h6">Application Logs ({logs.length})</Typography>
          <Button onClick={handleClearLogs} startIcon={<Clear />} sx={{ color: "inherit" }}>
            Clear
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: "grey.50" }}>
          <List sx={{ maxHeight: "100%", overflow: "auto" }}>
            {logs.length === 0 ? (
              <ListItem>
                <Typography variant="body2" color="text.secondary">
                  No logs available
                </Typography>
              </ListItem>
            ) : (
              logs.map((log, index) => (
                <ListItem key={index} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Paper elevation={0} sx={{ width: "100%", p: 1, bgcolor: "transparent" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Chip
                        label={log.level.toUpperCase()}
                        size="small"
                        color={getLevelColor(log.level) as any}
                        variant="outlined"
                      />
                      <Chip label={log.package} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {log.message}
                    </Typography>
                  </Paper>
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
