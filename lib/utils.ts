import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  currency?: { symbol: string; position: "prefix" | "suffix" }
) {
  const symbol = currency?.symbol ?? "$"
  const position = currency?.position ?? "prefix"
  const formatted = price.toLocaleString()
  return position === "prefix" ? `${symbol}${formatted}` : `${formatted} ${symbol}`
}
