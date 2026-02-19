import { formatDistanceToNow, format } from 'date-fns'

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatScore(score: number): string {
  return `${Math.round(score * 20)}%`
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}
