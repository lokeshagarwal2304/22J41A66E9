import { Log } from "./logger"

export interface UrlData {
  shortcode: string
  originalUrl: string
  expiryTime: number
  clickCount: number
  createdAt: number
}

const STORAGE_KEY = "urlshortener-urls"

export function saveUrl(urlData: UrlData): void {
  if (typeof window === "undefined") return

  try {
    const existingUrls = getAllUrls()
    const updatedUrls = [...existingUrls, urlData]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls))
    Log("frontend", "info", "utils", `URL saved to storage: ${urlData.shortcode}`)
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to save URL to storage")
    throw error
  }
}

export function getUrlByShortcode(shortcode: string): UrlData | null {
  if (typeof window === "undefined") return null

  try {
    const urls = getAllUrls()
    const url = urls.find((u) => u.shortcode === shortcode)
    if (url) {
      Log("frontend", "debug", "utils", `URL retrieved from storage: ${shortcode}`)
    }
    return url || null
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to retrieve URL from storage")
    return null
  }
}

export function getAllUrls(): UrlData[] {
  if (typeof window === "undefined") return []

  try {
    const urls = localStorage.getItem(STORAGE_KEY)
    return urls ? JSON.parse(urls) : []
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to retrieve URLs from storage")
    return []
  }
}

export function incrementClickCount(shortcode: string): void {
  if (typeof window === "undefined") return

  try {
    const urls = getAllUrls()
    const urlIndex = urls.findIndex((u) => u.shortcode === shortcode)

    if (urlIndex !== -1) {
      urls[urlIndex].clickCount += 1
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
      Log("frontend", "info", "utils", `Click count incremented for: ${shortcode}`)
    }
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to increment click count")
  }
}

export function clearAllUrls(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEY)
    Log("frontend", "info", "utils", "All URLs cleared from storage")
  } catch (error) {
    Log("frontend", "error", "utils", "Failed to clear URLs from storage")
  }
}
