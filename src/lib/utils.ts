
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLiters(liters: number): string {
  return `${liters.toLocaleString()} L`;
}

export function calculateEfficiency(usage: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((usage / target) * 100));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
