import { URLValidationOptions, URLValidationResult } from '../../types';

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
