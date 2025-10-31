export function formatCurrency(value, currency = "IDR") {
  if (value === null || value === undefined || isNaN(value)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDimensions(dimensions) {
  if (
    !dimensions ||
    !dimensions.width ||
    !dimensions.height ||
    !dimensions.unit
  ) {
    return "";
  }
  let dimStr = `${dimensions.width} x ${dimensions.height}`;
  if (dimensions.depth) {
    dimStr += ` x ${dimensions.depth}`;
  }
  dimStr += ` ${dimensions.unit}`;
  return dimStr;
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffSeconds = Math.round((now - date) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (diffSeconds < 60) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 5) return `${diffWeeks} minggu lalu`;
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;
  return `${diffYears} tahun lalu`;
}

export function formatFullDate(timestamp) {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
