export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Detect the browser's timezone using Intl API.
 * Falls back to "Asia/Jakarta" if detection fails.
 */
export const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
  } catch (e) {
    return "Asia/Jakarta";
  }
};

// Zona waktu baku untuk data, transaksi, dan seluruh dokumen ekspor.
export const DEFAULT_DATA_TIMEZONE = "Asia/Jakarta";

/**
 * Map timezone identifier to Indonesian timezone label (WIB/WITA/WIT).
 * For non-Indonesian timezones, returns the UTC offset (e.g. "UTC+8").
 */
export const getTimezoneLabel = (timezone) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;

  // Indonesian timezone mapping
  const WIB_ZONES = ["Asia/Jakarta", "Asia/Pontianak"];
  const WITA_ZONES = ["Asia/Makassar", "Asia/Ujung_Pandang"];
  const WIT_ZONES = ["Asia/Jayapura"];

  if (WIB_ZONES.includes(tz)) return "WIB";
  if (WITA_ZONES.includes(tz)) return "WITA";
  if (WIT_ZONES.includes(tz)) return "WIT";

  // For other timezones, calculate UTC offset
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    if (tzPart) return tzPart.value; // e.g. "GMT+8"
  } catch (e) {
    // fallback
  }
  return "WIB";
};

export const formatDate = (dateString, timezone) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const formatted = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });
  return `${formatted} ${getTimezoneLabel(tz)}`;
};

export const getNow = (timezone) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const now = new Date();
  
  // Format to YYYY-MM-DDTHH:mm for datetime-local input
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find(p => p.type === type)?.value || '';
  
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');
  
  // Fix 24:00 to 00:00 bug in some browsers/locales
  const formattedHour = hour === '24' ? '00' : hour;

  return `${year}-${month}-${day}T${formattedHour}:${minute}`;
};

export const toWibISOString = (dateTimeLocal) => {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(dateTimeLocal || "");
  if (!match) return null;

  const [, date, hour = "00", minute = "00", second = "00"] = match;
  const parsedDate = new Date(`${date}T${hour}:${minute}:${second}+07:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};
