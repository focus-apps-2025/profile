export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'login',
  'register',
  'logout',
  'assets',
  'static',
  'public',
  'health',
  'auth',
  'portfolios',
  'dashboard',
  'settings',
  'profile',
  'users',
  'v1',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

/**
 * Normalizes text to a clean URL-safe slug:
 * - lowercase
 * - replaces whitespace and symbols with hyphens
 * - strips consecutive hyphens
 * - trims hyphens from edges
 */
export function normalizeSlug(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
    .replace(/[\s_]+/g, '-') // replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
}

/**
 * Validates whether a slug is well-formed and not reserved.
 */
export function validateSlug(slug: string): { isValid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { isValid: false, error: 'Slug cannot be empty' };
  }

  const normalized = normalizeSlug(slug);

  if (normalized !== slug) {
    return { isValid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  if (slug.length < 2 || slug.length > 50) {
    return { isValid: false, error: 'Slug must be between 2 and 50 characters' };
  }

  if (RESERVED_SLUGS.has(normalized)) {
    return { isValid: false, error: `'${normalized}' is a reserved system path and cannot be used as a portfolio slug` };
  }

  return { isValid: true };
}
