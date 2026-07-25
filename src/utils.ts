import { categories } from './config';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function categoryImage(slug: string): string {
  const map: Record<string, string> = {
    'phat-phap': '/images/phat-phap.svg',
    'cong-nghe': '/images/cong-nghe.svg',
    'phat-trien-ban-than': '/images/phat-trien-ban-than.svg',
  };
  return map[slug] ?? '/images/phat-trien-ban-than.svg';
}

// Ước lượng thời gian đọc (~200 từ/phút cho tiếng Việt)
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
