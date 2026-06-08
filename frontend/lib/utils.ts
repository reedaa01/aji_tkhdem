import { clsx, type ClassValue } from 'clsx';
import type React from 'react';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Using inline style objects instead of Tailwind for brand accuracy
export const STATUS_COLORS: Record<string, string> = {
  applied: 'status-applied',
  interview: 'status-interview',
  offer: 'status-offer',
  rejected: 'status-rejected',
  withdrawn: 'status-withdrawn',
};

export const STATUS_STYLES: Record<string, React.CSSProperties> = {
  applied: { backgroundColor: '#E8F2FB', color: '#1F6FAF' },
  interview: { backgroundColor: '#FEF3C7', color: '#92400e' },
  offer: { backgroundColor: '#D1FAE5', color: '#065f46' },
  rejected: { backgroundColor: '#FEE2E2', color: '#991b1b' },
  withdrawn: { backgroundColor: '#F3F4F6', color: '#6B7280' },
};

export const SKILL_LEVEL_STYLES: Record<string, React.CSSProperties> = {
  beginner: { backgroundColor: '#F2F4F7', color: '#6B7280' },
  intermediate: { backgroundColor: '#E8F2FB', color: '#1F6FAF' },
  advanced: { backgroundColor: '#FEF0E7', color: '#F26A21' },
  expert: { backgroundColor: '#D1FAE5', color: '#065f46' },
};

// Legacy Tailwind fallback (kept for compatibility)
export const SKILL_LEVEL_COLORS: Record<string, string> = {
  beginner: 'skill-beginner',
  intermediate: 'skill-intermediate',
  advanced: 'skill-advanced',
  expert: 'skill-expert',
};
