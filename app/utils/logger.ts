export interface LogEntry {
  timestamp: number
  stack: string
  level: string
  package: string
  message: string
}

const LOG_STORAGE_KEY = "urlshortener-logs"
const MAX_LOGS = 1000

export function Log(
  stack: "frontend",
  level: "info" | "debug" | "warn" | "error" | "fatal",
  packageName: "component" | "middleware" | "auth" | "utils" | "config" | "style" | "page" | "state" | "hook",
  message: string,
) {
  // Check if we're in the browser
  if (typeof window === "undefined") return

  const logEntry: LogEntry = {
    timestamp: Date.now(),
    stack,
    level,
    package: packageName,
    message,
  }

  // Store locally for debugging
  try {
    const existingLogs = getLogEntries()
    const updatedLogs = [logEntry, ...existingLogs].slice(0, MAX_LOGS)
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs))
  } catch (error) {
    // Fail silently if localStorage is not available
  }

  // Send to evaluation server (as per requirements)
  try {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
      fetch("http://20.244.56.144/evaluation-service/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      }).catch(() => {
        // Fail silently for network errors
      })
    }
  } catch (error) {
    // Fail silently
  }
}

export function getLogEntries(): LogEntry[] {
  if (typeof window === "undefined") return []

  try {
    const logs = localStorage.getItem(LOG_STORAGE_KEY)
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    return []
  }
}

export function clearLogs() {
  if (typeof window === "undefined") return
  localStorage.removeItem(LOG_STORAGE_KEY)
}
