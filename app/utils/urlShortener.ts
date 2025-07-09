import { saveUrl, getUrlByShortcode } from "./storage"
import { Log } from "./logger"

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function generateShortcode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export interface ShortUrlResult {
  success: boolean
  shortUrl?: string
  shortcode?: string
  expiryTime?: number
  error?: string
}

export function createShortUrl(originalUrl: string, customShortcode?: string, expiryMinutes = 30): ShortUrlResult {
  Log("frontend", "info", "utils", `Creating short URL for: ${originalUrl}`)

  let shortcode = customShortcode

  if (shortcode) {
    // Check if custom shortcode already exists
    if (getUrlByShortcode(shortcode)) {
      Log("frontend", "warn", "utils", `Shortcode already exists: ${shortcode}`)
      return {
        success: false,
        error: "This shortcode is already taken. Please choose a different one.",
      }
    }
  } else {
    // Generate a unique shortcode
    let attempts = 0
    do {
      shortcode = generateShortcode()
      attempts++
      if (attempts > 100) {
        Log("frontend", "error", "utils", "Failed to generate unique shortcode after 100 attempts")
        return {
          success: false,
          error: "Unable to generate unique shortcode. Please try again.",
        }
      }
    } while (getUrlByShortcode(shortcode))
  }

  const expiryTime = Date.now() + expiryMinutes * 60 * 1000
  const shortUrl = `${window.location.origin}/${shortcode}`

  const urlData = {
    shortcode,
    originalUrl,
    expiryTime,
    clickCount: 0,
    createdAt: Date.now(),
  }

  try {
    saveUrl(urlData)
    Log("frontend", "info", "utils", `Short URL created successfully: ${shortcode}`)

    return {
      success: true,
      shortUrl,
      shortcode,
      expiryTime,
    }
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to save URL data")
    return {
      success: false,
      error: "Failed to save URL data. Please try again.",
    }
  }
}
