import { URLValidationOptions } from '../../types';

// Constants for validation
const TIKTOK_VIDEO_ID_REGEX = /^\d{19}$/;
const TIKTOK_USERNAME_REGEX = /^[a-zA-Z0-9._]{2,24}$/;
const MAX_USERNAME_LENGTH = 24;

/**
 * Validates a TikTok username
 * @param username - The username to validate
 * @returns boolean - Whether the username is valid
 */
function isValidTikTokUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  const cleanUsername = username.replace(/^@/, '');
  return TIKTOK_USERNAME_REGEX.test(cleanUsername) && cleanUsername.length <= MAX_USERNAME_LENGTH;
}

/**
 * Validates a TikTok video ID
 * @param videoId - The video ID to validate
 * @returns boolean - Whether the video ID is valid
 */
function isValidTikTokVideoId(videoId: string): boolean {
  if (!videoId || typeof videoId !== 'string') return false;
  return TIKTOK_VIDEO_ID_REGEX.test(videoId.trim());
}

/**
 * Validates a TikTok video URL
 *
 * This function checks if a given URL is a valid TikTok video URL.
 * It supports various TikTok URL formats including:
 * - tiktok.com/@username/video/VIDEO_ID
 * - vm.tiktok.com/VIDEO_ID
 * - www.tiktok.com/@username/video/VIDEO_ID
 *
 * @param url - The TikTok URL to validate
 * @param options - Optional validation options
 * @param options.allowNoProtocol - Whether to allow URLs without http/https protocol (default: true)
 * @param options.allowQueryParams - Whether to allow additional query parameters (default: true)
 *
 * @returns boolean - Whether the URL is valid
 *
 * @example
 * ```typescript
 * // Basic usage
 * const isValid = isValidTikTokVideoURL('https://www.tiktok.com/@username/video/1234567890123456789');
 * console.log(isValid); // true
 *
 * // With options
 * const isValid = isValidTikTokVideoURL('tiktok.com/@username/video/1234567890123456789', {
 *   allowNoProtocol: true,
 *   allowQueryParams: true
 * });
 *
 * // Invalid URL
 * const isValid = isValidTikTokVideoURL('invalid-url');
 * console.log(isValid); // false
 * ```
 */
export function isValidTikTokVideoURL(
  url: string,
  options: URLValidationOptions = {}
): boolean {
  const { allowNoProtocol = true, allowQueryParams = true } = options;

  if (!url || typeof url !== 'string') {
    return false;
  }

  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (!allowNoProtocol) return false;
    finalUrl = 'https://' + finalUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(finalUrl);
  } catch {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const allowedHosts = new Set(['tiktok.com', 'vm.tiktok.com']);
  if (!allowedHosts.has(hostname)) {
    return false;
  }

  let videoId: string | null = null;
  let username: string | null = null;

  if (hostname === 'tiktok.com') {
    const pathParts = parsed.pathname.split('/').filter(Boolean); // Remove empty strings
    if (pathParts.length >= 3 && pathParts[1] === 'video') {
      videoId = pathParts[2];
      username = pathParts[0].replace(/^@/, '');
    } else if (pathParts.length >= 4 && pathParts[2] === 'video') {
      videoId = pathParts[3];
      username = pathParts[1].replace(/^@/, '');
    }
  } else if (hostname === 'vm.tiktok.com') {
    videoId = parsed.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId || !isValidTikTokVideoId(videoId)) {
    return false;
  }

  if (username && !isValidTikTokUsername(username)) {
    return false;
  }

  if (!allowQueryParams && parsed.search) {
    return false;
  }

  return true;
}

/**
 * Extracts the video ID from a TikTok URL
 *
 * This function extracts the video ID from a TikTok URL. It supports various TikTok URL formats including:
 * - tiktok.com/@username/video/VIDEO_ID
 * - vm.tiktok.com/VIDEO_ID
 * - www.tiktok.com/@username/video/VIDEO_ID
 *
 * @param url - The TikTok URL to extract the video ID from
 * @param options - Optional validation options
 * @param options.allowNoProtocol - Whether to allow URLs without http/https protocol (default: true)
 * @param options.allowQueryParams - Whether to allow additional query parameters (default: true)
 *
 * @returns The video ID as a string if the URL is valid, null otherwise
 *
 * @example
 * ```typescript
 * // Valid URL
 * const videoId = getTikTokVideoId('https://www.tiktok.com/@username/video/1234567890123456789');
 * console.log(videoId); // '1234567890123456789'
 *
 * // Invalid URL
 * const videoId = getTikTokVideoId('invalid-url');
 * console.log(videoId); // null
 * ```
 */
export function getTikTokVideoId(
  url: string,
  options: URLValidationOptions = {}
): string | null {
  const { allowNoProtocol = true, allowQueryParams = true } = options;

  if (!url || typeof url !== 'string') {
    return null;
  }

  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (!allowNoProtocol) return null;
    finalUrl = 'https://' + finalUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(finalUrl);
  } catch {
    return null;
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const allowedHosts = new Set(['tiktok.com', 'vm.tiktok.com']);
  if (!allowedHosts.has(hostname)) {
    return null;
  }

  let videoId: string | null = null;
  if (hostname === 'tiktok.com') {
    const pathParts = parsed.pathname.split('/').filter(Boolean); // Remove empty strings
    if (pathParts.length >= 3 && pathParts[1] === 'video') {
      videoId = pathParts[2];
    } else if (pathParts.length >= 4 && pathParts[2] === 'video') {
      videoId = pathParts[3];
    }
  } else if (hostname === 'vm.tiktok.com') {
    videoId = parsed.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId || !isValidTikTokVideoId(videoId)) {
    return null;
  }

  if (!allowQueryParams && parsed.search) {
    return null;
  }

  return videoId;
}

/**
 * Normalizes a TikTok video URL to the standard format
 *
 * This function takes any valid TikTok URL format and converts it to the standard
 * tiktok.com/@username/video/VIDEO_ID format. It supports various TikTok URL formats including:
 * - tiktok.com/@username/video/VIDEO_ID
 * - vm.tiktok.com/VIDEO_ID
 * - www.tiktok.com/@username/video/VIDEO_ID
 *
 * @param inputUrl - The TikTok URL to normalize
 *
 * @returns The normalized URL in the format https://www.tiktok.com/@username/video/VIDEO_ID,
 *          or null if the URL is invalid or cannot be normalized
 *
 * @example
 * ```typescript
 * // Standard URL
 * const normalized = normalizeTikTokVideoURL('https://www.tiktok.com/@username/video/1234567890123456789');
 * console.log(normalized); // 'https://www.tiktok.com/@username/video/1234567890123456789'
 *
 * // Short URL
 * const normalized = normalizeTikTokVideoURL('https://vm.tiktok.com/1234567890123456789');
 * console.log(normalized); // 'https://www.tiktok.com/@username/video/1234567890123456789'
 *
 * // Invalid URL
 * const normalized = normalizeTikTokVideoURL('invalid-url');
 * console.log(normalized); // null
 * ```
 */
export function normalizeTikTokVideoURL(inputUrl: string): string | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;

  let url: URL;
  try {
    url = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
  const allowedHosts = new Set(['tiktok.com', 'vm.tiktok.com']);
  if (!allowedHosts.has(hostname)) {
    return null;
  }

  let videoId: string | null = null;
  let username: string | null = null;

  if (hostname === 'tiktok.com') {
    const pathParts = url.pathname.split('/').filter(Boolean); // Remove empty strings
    if (pathParts.length >= 3 && pathParts[1] === 'video') {
      videoId = pathParts[2];
      username = pathParts[0].replace(/^@/, '');
    } else if (pathParts.length >= 4 && pathParts[2] === 'video') {
      videoId = pathParts[3];
      username = pathParts[1].replace(/^@/, '');
    }
  } else if (hostname === 'vm.tiktok.com') {
    videoId = url.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId || !isValidTikTokVideoId(videoId)) {
    return null;
  }

  // For vm.tiktok.com URLs or invalid usernames, we use a placeholder
  if (!username || !isValidTikTokUsername(username)) {
    username = 'user';
  }

  return `https://www.tiktok.com/@${username}/video/${videoId}`;
}

/**
 * Checks if a URL is a TikTok URL
 *
 * @param url - The URL to check
 *
 * @returns boolean - Whether the URL is a TikTok URL
 *
 * @example
 * ```typescript
 * console.log(isTikTokURL('https://www.tiktok.com/@username/video/1234567890123456789')); // true
 * console.log(isTikTokURL('https://youtube.com/watch?v=dQw4w9WgXcQ')); // false
 * ```
 */
export function isTikTokURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'https://' + finalUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(finalUrl);
  } catch {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  return ['tiktok.com', 'vm.tiktok.com'].includes(hostname);
}

/**
 * Generates a TikTok share URL
 *
 * @param videoId - The TikTok video ID
 *
 * @returns The share URL
 *
 * @example
 * ```typescript
 * const shareUrl = generateTikTokShareURL('1234567890123456789');
 * console.log(shareUrl); // 'https://vm.tiktok.com/1234567890123456789'
 * ```
 */
export function generateTikTokShareURL(videoId: string): string {
  if (!videoId || !isValidTikTokVideoId(videoId.trim())) {
    throw new Error('Invalid TikTok video ID');
  }
  return `https://vm.tiktok.com/${videoId.trim()}`;
} 