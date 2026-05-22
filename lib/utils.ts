import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const downloadCsvFromString = (
  csvDataString: string,
  fileName: string,
): void => {
  const blob = new Blob([csvDataString], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadBlob = (data: BlobPart, fileName: string): void => {
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

export const formatCurrencyCompact = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: amount >= 1000000 ? 1 : 0,
  }).format(amount || 0);

const BACKEND_TIMESTAMP_FORMATS = [
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss.SSS",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD",
];

export const parseBackendTimestamp = (value?: string | null) => {
  if (!value) return null;

  const parsed = dayjs(value, BACKEND_TIMESTAMP_FORMATS, true);
  if (parsed.isValid()) return parsed;

  const fallback = dayjs(value);
  return fallback.isValid() ? fallback : null;
};

export const formatTimestamp = (
  value?: string | null,
  format = "DD/MM/YYYY hh:mm A",
  fallback = "N/A",
) => parseBackendTimestamp(value)?.format(format) || fallback;

export const formatRelativeTimestamp = (
  value?: string | null,
  fallback = "N/A",
) => parseBackendTimestamp(value)?.fromNow() || fallback;
