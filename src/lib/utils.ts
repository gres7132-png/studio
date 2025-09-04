import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, compact = false) {
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const kesFormatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(compact && { notation: 'compact' }),
  });

  const kesAmount = amount * 130;

  const formattedKsh = kesFormatter.format(kesAmount).replace(/\s/g, ' ');

  if (compact) {
    return `${usdFormatter.format(amount)}`;
  }
  
  return `${usdFormatter.format(amount)} (${formattedKsh})`;
}
