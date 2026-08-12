/**
 * Format angka menjadi format mata uang Rupiah
 * Contoh: 10000 -> Rp10.000
 */
export const formatRupiah = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Format ISO Date String menjadi tanggal Indonesia
 * Contoh: 2026-01-12 -> 12 Januari 2026
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Format Date menjadi YYYY-MM-DD
 * Digunakan untuk input type="date"
 */
export const formatInputDate = (date) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};