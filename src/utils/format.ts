export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return ""

  try {
    return new Intl.DateTimeFormat("en-IN", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts
    }).format(new Date(date))
  } catch {
    return ""
  }
}

export function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata", // IST timezone
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }

  return new Intl.DateTimeFormat("en-IN", options)
    .format(date)
    .replace(/(\d{2}) (\w{3}) \d{4}, (\d{2}:\d{2}:\d{2})/, "$1 $2, $3")
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  let result = ""
  if (hours > 0) result += `${hours}h `
  if (minutes > 0 || hours > 0) result += `${minutes}m `
  if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) result += `${remainingSeconds}s`
  return result.trim()
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount)
}
