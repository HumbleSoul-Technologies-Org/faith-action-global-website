/**
 * Format a date string to a consistent format that works on both server and client
 * This prevents hydration mismatches caused by locale-specific formatting
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Use toISOString and extract YYYY-MM-DD, then convert to readable format
    // This ensures consistent output regardless of timezone
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    
    // Format as "Month DD, YYYY" (e.g., "February 14, 2024")
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December']
    
    return `${monthNames[parseInt(month) - 1]} ${day}, ${year}`
  } catch (e) {
    return dateString
  }
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return formatDate(dateString)
    }
  } catch (e) {
    return dateString
  }
}
