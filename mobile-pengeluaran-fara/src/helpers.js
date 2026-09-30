// src/helpers.js

/**
 * Validasi Input Form Pengeluaran
 */
export function validate(judul, nominal) {
  if (!judul.trim()) return 'Judul wajib diisi';
  if (judul.trim().length > 100) return 'Judul maksimal 100 karakter';
  if (!/^\d+$/.test(nominal)) return 'Nominal harus berupa angka rupiah utuh';

  const nilai = Number(nominal);
  if (!Number.isInteger(nilai) || nilai < 1 || nilai > 2147483647) {
    return 'Nominal harus 1 sampai 2147483647';
  }

  return '';
}

/**
 * Pemformat Angka ke Format Tampilan Rupiah (Contoh: 20000 -> "Rp 20.000")
 */
export const rupiah = (nilai) =>
  `Rp ${String(Number(nilai)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

/**
 * Pemformat Tanggal ISO/MySQL ke Format Lokal DD/MM/YYYY
 */
export function tanggalLokal(value) {
  if (!value) return '-';

  // Jika format berupa string YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value.split('-').reverse().join('/');
  }

  // Jika berupa Date string ISO
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/');
}