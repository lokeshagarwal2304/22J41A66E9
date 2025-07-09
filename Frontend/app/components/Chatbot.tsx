"use client"

import React, { useState } from "react"
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
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material"
import { Chat, Close } from "@mui/icons-material"
import { Log } from "../utils/logger"

const FAQ_DATA = [
  {
    question: "What is this URL Shortener?",
    answer:
      "This is a comprehensive URL shortening service that allows you to create short, shareable links from long URLs. You can shorten up to 5 URLs concurrently with custom shortcodes and expiry times. All data is stored locally in your browser for privacy.",
  },
  {
    question: "How do I create short links?",
    answer:
      "Go to the URL Shortener page, enter your long URLs (up to 5 at once), optionally set custom shortcodes and expiry times, then click 'Shorten URLs'. Your short links will be generated instantly with expiry dates displayed.",
  },
  {
    question: "What if my link expires?",
    answer:
      "When a link expires, anyone trying to access it will see a 'Link expired' message. You can check the status of all your links in the Statistics page, which shows real-time countdown timers and click analytics for each URL.",
  },
  {
    question: "How do custom shortcodes work?",
    answer:
      "You can provide custom shortcodes (3-20 alphanumeric characters) for your URLs. If you don't provide one, the system will automatically generate a unique 6-character code. All shortcodes must be unique across the application.",
  },
  {
    question: "Can I track my URL analytics?",
    answer:
      "Yes! The Statistics page shows comprehensive analytics including click counts, expiry status, time remaining, and creation dates. You can also click on short URLs directly from the statistics page to test them.",
  },
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  const handleOpen = () => {
    setOpen(true)
    Log("frontend", "info", "component", "Chatbot opened")
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedFaq(null)
    Log("frontend", "info", "component", "Chatbot closed")
  }

  const handleFaqClick = (index: number) => {
    setSelectedFaq(index)
    Log("frontend", "info", "component", `FAQ selected: ${FAQ_DATA[index].question}`)
  }

  const handleBack = () => {
    setSelectedFaq(null)
  }

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={handleOpen}
      >
        <Chat />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minHeight: 400 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h6">URL Shortener Assistant</Typography>
          <Button onClick={handleClose} sx={{ color: "inherit", minWidth: "auto", p: 1 }}>
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedFaq === null ? (
            <Box>
              <Box sx={{ p: 2, bgcolor: "action.hover" }}>
                <Typography variant="body2" color="text.secondary">
                  Hi! I'm here to help you with the URL Shortener. Select a question below:
                </Typography>
              </Box>
              <List>
                {FAQ_DATA.map((faq, index) => (
                  <React.Fragment key={index}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleFaqClick(index)}>
                        <ListItemText
                          primary={faq.question}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: "medium",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < FAQ_DATA.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
                <Typography variant="body2" fontWeight="medium">
                  {FAQ_DATA[selectedFaq].question}
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="body2">{FAQ_DATA[selectedFaq].answer}</Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
          {selectedFaq !== null ? (
            <Button onClick={handleBack} variant="outlined">
              Back to Questions
            </Button>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Need more help? Contact support or check our documentation.
            </Typography>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
