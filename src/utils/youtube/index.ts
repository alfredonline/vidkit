import { URLValidationOptions, URLValidationResult } from '../../types';

/**
 * Validates a YouTube video URL and extracts the video ID
 * @param url - The YouTube URL to validate
 * @param options - Optional validation options
 * @returns A URLValidationResult object containing validation status and video ID
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
 *   allowNoWWW: true
 * });
 * ```
 */
export function isValidYouTubeVideoURL(
  url: string,
  options: URLValidationOptions = {}
): URLValidationResult {
  const {
    allowNoProtocol = true,
    allowNoWWW = true,
    allowQueryParams = true
  } = options;

  // Input validation
  if (!url) {
    return {
      isValid: false,
      error: 'URL cannot be empty'
    };
  }

  // Build regex pattern based on options
  const protocolPattern = allowNoProtocol ? '(https?:\\/\\/)?' : 'https?:\\/\\/';
  const wwwPattern = allowNoWWW ? '(www\\.)?' : 'www\\.';
  const queryPattern = allowQueryParams ? '(\\S*)?' : '';

  const pattern = new RegExp(
    `^${protocolPattern}${wwwPattern}(youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]{11})${queryPattern}$`
  );

  const match = url.match(pattern);

  if (!match) {
    return {
      isValid: false,
      error: 'Invalid YouTube URL format'
    };
  }

  return {
    isValid: true,
    videoId: match[2]
  };
}
