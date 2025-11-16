/**
 * Format a date object to a readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date range from two dates
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
}

/**
 * Calculate number of days between two dates (inclusive)
 */
export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Render price level as euro symbols
 */
export function formatPriceLevel(priceLevel?: number | null): string {
  if (priceLevel === null || priceLevel === undefined) return '';
  return '€'.repeat(Math.max(1, Math.min(priceLevel, 4)));
}

/**
 * Open location in native maps app
 */
export function openInMaps(latitude: number, longitude: number, label?: string): string {
  const encodedLabel = label ? encodeURIComponent(label) : '';
  return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`;
}

/**
 * Format large numbers (e.g., 1234 -> 1.2K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
