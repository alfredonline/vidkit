import { URLValidationOptions, YouTubeShareOptions, YouTubeURLComponents } from '../../types';

/**
 * Validates a YouTube video URL
 *
 * This function checks if a given URL is a valid YouTube video URL.
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
 * @returns boolean - Whether the URL is valid
 *
 * @example
 * ```typescript
 * // Basic usage
 * const isValid = isValidYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * console.log(isValid); // true
 *
 * // With options
 * const isValid = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
 *   allowNoProtocol: true,
 *   allowQueryParams: true
 * });
 *
 * // Invalid URL
 * const isValid = isValidYouTubeVideoURL('invalid-url');
 * console.log(isValid); // false
 * ```
 */
export function isValidYouTubeVideoURL(
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
  const allowedHosts = new Set(['youtube.com', 'm.youtube.com', 'youtu.be']);
  if (!allowedHosts.has(hostname)) {
    return false;
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
    return false;
  }

  if (videoId.length !== 11 || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return false;
  }

  if (/^(.)\1{10}$/.test(videoId)) {
    return false;
  }

  if (!allowQueryParams) {
    const keys = Array.from(parsed.searchParams.keys());
    if (!(keys.length === 1 && keys[0] === 'v')) {
      return false;
    }
  }

  return true;
}

/**
 * Extracts the video ID from a YouTube URL
 *
 * This function extracts the video ID from a YouTube URL. It supports various YouTube URL formats including:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - www.youtube.com/watch?v=VIDEO_ID
 * - m.youtube.com/watch?v=VIDEO_ID
 *
 * @param url - The YouTube URL to extract the video ID from
 * @param options - Optional validation options
 * @param options.allowNoProtocol - Whether to allow URLs without http/https protocol (default: true)
 * @param options.allowQueryParams - Whether to allow additional query parameters (default: true)
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
export function getYouTubeVideoId(
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
  const allowedHosts = new Set(['youtube.com', 'm.youtube.com', 'youtu.be']);
  if (!allowedHosts.has(hostname)) {
    return null;
  }

  let videoId: string | null = null;
  
  // Handle different URL formats
  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.pathname.startsWith('/shorts/')) {
      videoId = parsed.pathname.split('/')[2];
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.split('/')[2];
    } else if (parsed.pathname.startsWith('/live/')) {
      videoId = parsed.pathname.split('/')[2];
    }
  } else if (hostname === 'youtu.be') {
    videoId = parsed.pathname.replace(/^\/+|\/+$/g, '');
  }

  if (!videoId) {
    return null;
  }

  if (videoId.length !== 11 || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  if (/^(.)\1{10}$/.test(videoId)) {
    return null;
  }

  if (!allowQueryParams) {
    const keys = Array.from(parsed.searchParams.keys());
    if (!(keys.length === 1 && keys[0] === 'v')) {
      return null;
    }
  }

  return videoId;
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

/**
 * Generates a YouTube share URL with specific parameters.
 * @param videoId - The YouTube video ID
 * @param params - Optional parameters to include in the share URL (e.g., t, list, etc.)
 * @returns The share URL as a string
 * @example
 * generateYouTubeShareURL('dQw4w9WgXcQ', { t: '120' })
 * // => 'https://youtu.be/dQw4w9WgXcQ?t=120'
 */
export function generateYouTubeShareURL(
  videoId: string,
  params: YouTubeShareOptions = {}
): string {
  let url = `https://youtu.be/${videoId}`;
  const paramStr = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  if (paramStr) {
    url += `?${paramStr}`;
  }
  return url;
}

/**
 * Parses a YouTube URL into its components (video ID, playlist ID, channel ID, parameters, etc.)
 * @param url - The YouTube URL to parse
 * @returns An object with detected type, IDs, parameters, and original URL
 * @example
 * parseYouTubeURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s')
 */
export function parseYouTubeURL(url: string): YouTubeURLComponents {
  let parsed: URL;
  let type: 'video' | 'playlist' | 'channel' | 'short' | 'live' | 'unknown' = 'unknown';
  let videoId: string | undefined;
  let playlistId: string | undefined;
  let channelId: string | undefined;
  let isEmbed = false;
  const parameters: Record<string, string> = {};
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return { type, parameters, isEmbed, originalUrl: url };
  }
  const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
  // Video
  if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname === '/watch') {
    videoId = parsed.searchParams.get('v') || undefined;
    type = 'video';
  } else if (hostname === 'youtu.be') {
    videoId = parsed.pathname.replace(/^\/+|\/+$/g, '');
    type = 'video';
  } else if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname.startsWith('/shorts/')) {
    videoId = parsed.pathname.split('/')[2];
    type = 'short';
  } else if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname.startsWith('/embed/')) {
    videoId = parsed.pathname.split('/')[2];
    type = 'video';
    isEmbed = true;
  } else if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname.startsWith('/live/')) {
    videoId = parsed.pathname.split('/')[2];
    type = 'live';
  } else if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname.startsWith('/playlist')) {
    playlistId = parsed.searchParams.get('list') || undefined;
    type = 'playlist';
  } else if ((hostname === 'youtube.com' || hostname === 'm.youtube.com') && parsed.pathname.startsWith('/channel/')) {
    channelId = parsed.pathname.split('/')[2];
    type = 'channel';
  }
  // Parameters
  parsed.searchParams.forEach((value, key) => {
    parameters[key] = value;
  });
  return {
    type,
    videoId,
    playlistId,
    channelId,
    parameters,
    isEmbed,
    originalUrl: url
  };
}

/**
 * Checks if a URL is any valid YouTube URL (video, playlist, channel, etc.)
 * 
 * This function validates if a URL belongs to any YouTube domain, including:
 * - youtube.com
 * - m.youtube.com
 * - youtu.be
 * - music.youtube.com
 * - www.youtube.com
 * 
 * It handles various edge cases including:
 * - URLs with or without protocol
 * - URLs with www prefix
 * - URLs with subdomains
 * - URLs with query parameters
 * - URLs with hash fragments
 * - URLs with trailing slashes
 * - Case-insensitive hostname matching
 * 
 * @param url - The URL to check
 * @returns true if the URL is a YouTube URL, false otherwise
 * 
 * @example
 * ```typescript
 * // Basic usage
 * isYouTubeURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // true
 * isYouTubeURL('https://youtu.be/dQw4w9WgXcQ') // true
 * 
 * // Edge cases
 * isYouTubeURL('youtube.com') // true
 * isYouTubeURL('music.youtube.com') // true
 * isYouTubeURL('https://www.youtube.com/') // true
 * isYouTubeURL('https://youtube.com/watch?v=123&t=30s') // true
 * isYouTubeURL('https://youtube.com/#section') // true
 * isYouTubeURL('https://vimeo.com/123456') // false
 * isYouTubeURL('') // false
 * isYouTubeURL('not-a-url') // false
 * ```
 */
export function isYouTubeURL(url: string): boolean {
  // Handle empty or non-string input
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim the URL and handle empty strings
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return false;
  }

  try {
    // Add protocol if missing
    const urlWithProtocol = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    const parsed = new URL(urlWithProtocol);

    // Normalize hostname: remove www prefix and convert to lowercase
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();

    // List of valid YouTube domains and subdomains
    const validDomains = [
      'youtube.com',
      'm.youtube.com',
      'youtu.be',
      'music.youtube.com'
    ];

    // Check if the hostname is a valid YouTube domain
    return validDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    // Return false for any URL parsing errors
    return false;
  }
}

/**
 * Converts a YouTube URL to an embed URL format
 * 
 * This function takes any valid YouTube URL and converts it to the standard
 * embed format (youtube.com/embed/VIDEO_ID). It supports various YouTube URL formats including:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/live/VIDEO_ID
 * 
 * @param url - The YouTube URL to convert
 * @returns The embed URL in the format https://www.youtube.com/embed/VIDEO_ID,
 *          or null if the URL is invalid or cannot be converted
 * 
 * @example
 * ```typescript
 * // Standard watch URL
 * toYouTubeEmbedURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
 * // => 'https://www.youtube.com/embed/dQw4w9WgXcQ'
 * 
 * // Short URL
 * toYouTubeEmbedURL('https://youtu.be/dQw4w9WgXcQ')
 * // => 'https://www.youtube.com/embed/dQw4w9WgXcQ'
 * 
 * // Shorts URL
 * toYouTubeEmbedURL('https://youtube.com/shorts/dQw4w9WgXcQ')
 * // => 'https://www.youtube.com/embed/dQw4w9WgXcQ'
 * 
 * // Invalid URL
 * toYouTubeEmbedURL('invalid-url')
 * // => null
 * ```
 */
export function toYouTubeEmbedURL(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Converts a YouTube URL to a short URL format
 * 
 * This function takes any valid YouTube URL and converts it to the short
 * format (youtu.be/VIDEO_ID). It supports various YouTube URL formats including:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/live/VIDEO_ID
 * 
 * @param url - The YouTube URL to convert
 * @returns The short URL in the format https://youtu.be/VIDEO_ID,
 *          or null if the URL is invalid or cannot be converted
 * 
 * @example
 * ```typescript
 * // Standard watch URL
 * toYouTubeShortURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
 * // => 'https://youtu.be/dQw4w9WgXcQ'
 * 
 * // Embed URL
 * toYouTubeShortURL('https://www.youtube.com/embed/dQw4w9WgXcQ')
 * // => 'https://youtu.be/dQw4w9WgXcQ'
 * 
 * // Shorts URL
 * toYouTubeShortURL('https://youtube.com/shorts/dQw4w9WgXcQ')
 * // => 'https://youtu.be/dQw4w9WgXcQ'
 * 
 * // Invalid URL
 * toYouTubeShortURL('invalid-url')
 * // => null
 * ```
 */
export function toYouTubeShortURL(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return `https://youtu.be/${videoId}`;
}

/**
 * Checks if a URL is a YouTube embed URL
 * 
 * This function validates if a URL is in the YouTube embed format.
 * It supports various embed URL formats including:
 * - youtube.com/embed/VIDEO_ID
 * - www.youtube.com/embed/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID?autoplay=1
 * 
 * @param url - The URL to check
 * @returns true if the URL is a YouTube embed URL, false otherwise
 * 
 * @example
 * ```typescript
 * // Valid embed URLs
 * isYouTubeEmbedURL('https://www.youtube.com/embed/dQw4w9WgXcQ') // true
 * isYouTubeEmbedURL('https://youtube.com/embed/dQw4w9WgXcQ') // true
 * isYouTubeEmbedURL('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1') // true
 * 
 * // Invalid URLs
 * isYouTubeEmbedURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // false
 * isYouTubeEmbedURL('https://youtu.be/dQw4w9WgXcQ') // false
 * isYouTubeEmbedURL('invalid-url') // false
 * ```
 */
export function isYouTubeEmbedURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
    
    if (hostname !== 'youtube.com') {
      return false;
    }

    return parsed.pathname.startsWith('/embed/');
  } catch {
    return false;
  }
}
