import { URLValidationOptions, URLValidationResult } from '../../types';

/**
 * Validates a YouTube video URL and extracts the video ID
 *
 * This function checks if a given URL is a valid YouTube video URL and extracts the video ID.
 * It supports various YouTube URL formats including:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - www.youtube.com/watch?v=VIDEO_ID
 * - m.youtube.com/watch?v=VIDEO_ID
 *
 * @param url - The YouTube URL to validate
 * @param options - Optional validation options
 * @param options.allowNoProtocol - Whether to allow URLs without http/https protocol (default: true)
 * @param options.allowQueryParams - Whether to allow additional query parameters (default: true)
 *
 * @returns A URLValidationResult object containing:
 * - isValid: boolean - Whether the URL is valid
 * - videoId?: string - The extracted video ID if valid
 * - error?: string - Error message if invalid
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = isValidYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * console.log(result.isValid); // true
 * console.log(result.videoId); // 'dQw4w9WgXcQ'
 *
 * // With options
 * const result = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
 *   allowNoProtocol: true,
 *   allowQueryParams: true
 * });
 *
 * // Invalid URL
 * const result = isValidYouTubeVideoURL('invalid-url');
 * console.log(result.isValid); // false
 * console.log(result.error); // 'Malformed URL'
 * ```
 */
export function isValidYouTubeVideoURL(
  url: string,
  options: URLValidationOptions = {}
): URLValidationResult {
  const { allowNoProtocol = true, allowQueryParams = true } = options;

  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string' };
  }

  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (!allowNoProtocol) return { isValid: false, error: 'Missing protocol (http or https)' };
    finalUrl = 'https://' + finalUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(finalUrl);
  } catch {
    return { isValid: false, error: 'Malformed URL' };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const allowedHosts = new Set(['youtube.com', 'm.youtube.com', 'youtu.be']);
  if (!allowedHosts.has(hostname)) {
    return { isValid: false, error: 'Unsupported domain' };
  }

  let videoId: string | null = null;
  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      videoId = parsed.searchParams.get('v');
    }
  } else if (hostname === 'youtu.be') {
    videoId = parsed.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId) {
    return { isValid: false, error: 'Missing video ID' };
  }

  if (videoId.length !== 11 || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return { isValid: false, error: 'Invalid video ID format' };
  }

  if (/^(.)\1{10}$/.test(videoId)) {
    return { isValid: false, error: 'Invalid video ID (repeated characters)' };
  }

  if (!allowQueryParams) {
    const keys = Array.from(parsed.searchParams.keys());
    if (!(keys.length === 1 && keys[0] === 'v')) {
      return { isValid: false, error: 'Extra query parameters not allowed' };
    }
  }

  return { isValid: true, videoId };
}

/**
 * Extracts the video ID from a YouTube URL
 *
 * This is a convenience function that uses isValidYouTubeVideoURL to extract
 * just the video ID from a YouTube URL. It returns null if the URL is invalid.
 *
 * @param url - The YouTube URL to extract the video ID from (can be in any valid URL format (mobile, etc.))
 *
 * @returns The video ID as a string if the URL is valid, null otherwise
 *
 * @example
 * ```typescript
 * // Valid URL
 * const videoId = getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * console.log(videoId); // 'dQw4w9WgXcQ'
 *
 * // Invalid URL
 * const videoId = getYouTubeVideoId('invalid-url');
 * console.log(videoId); // null
 * ```
 */
export function getYouTubeVideoId(url: string): string | null {
  const result = isValidYouTubeVideoURL(url);
  if (!result.isValid) return null;
  return result.videoId ?? null;
}

/**
 * Normalizes a YouTube video URL to the standard format
 *
 * This function takes any valid YouTube URL format and converts it to the standard
 * youtube.com/watch?v=VIDEO_ID format. It supports various YouTube URL formats including:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - www.youtube.com/watch?v=VIDEO_ID
 * - m.youtube.com/watch?v=VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 *
 * @param inputUrl - The YouTube URL to normalize
 *
 * @returns The normalized URL in the format https://www.youtube.com/watch?v=VIDEO_ID,
 *          or null if the URL is invalid or cannot be normalized
 *
 * @example
 * ```typescript
 * // Standard watch URL
 * const normalized = normalizeYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *
 * // Short URL
 * const normalized = normalizeYouTubeVideoURL('https://youtu.be/dQw4w9WgXcQ');
 * console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *
 * // Shorts URL
 * const normalized = normalizeYouTubeVideoURL('https://youtube.com/shorts/dQw4w9WgXcQ');
 * console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *
 * // Invalid URL
 * const normalized = normalizeYouTubeVideoURL('invalid-url');
 * console.log(normalized); // null
 * ```
 */
export function normalizeYouTubeVideoURL(inputUrl: string): string | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;

  let url: URL;
  try {
    url = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '').toLowerCase();

  let videoId: string | null = null;

  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v');
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2];
    }
  } else if (hostname === 'youtu.be') {
    videoId = url.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
}
