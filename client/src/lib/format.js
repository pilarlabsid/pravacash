export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  // Format menggunakan timezone GMT+9 (Asia/Tokyo)
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Tokyo", // GMT+9 timezone
  });
};

export const getToday = () => {
  // Get today's date in GMT+9 (Asia/Tokyo)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo", // GMT+9
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  
  // Format sebagai YYYY-MM-DD
  return formatter.format(now);
};

