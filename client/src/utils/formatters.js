/**
 * Formats a signed transaction amount (delta display).
 * Positive → '+ ₪50.00', Negative → '- ₪30.00'
 */
export function formatAmount(amount) {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix} ₪${Math.abs(amount).toFixed(2)}`;
}

/**
 * Formats a balance value — plain display, no sign prefix.
 * Example: 120.5 → '₪120.50'
 */
export function formatBalance(amount) {
  return `₪${Number(amount).toFixed(2)}`;
}

/**
 * Formats an ISO date string to the user's locale date.
 * Example: '2025-06-15T10:00:00Z' → '6/15/2025'
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}
