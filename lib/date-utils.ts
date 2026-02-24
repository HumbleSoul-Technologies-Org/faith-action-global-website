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
