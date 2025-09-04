import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, compact = false) {
  const kesFormatter = new Intl.NumberFormat('en-KE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(compact && { notation: 'compact' }),
  });

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const usdAmount = amount / 130; // Convert KES to USD

  const formattedKsh = `KES ${kesFormatter.format(amount)}`;
  const formattedUsd = usdFormatter.format(usdAmount);

  if (compact) {
    return `${formattedUsd}`; // Compact view shows USD
  }
  
  return `${formattedKsh} (${formattedUsd})`;
}
