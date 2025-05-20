/**
 * Options for URL validation
 */
export interface URLValidationOptions {
  /**
   * Whether to allow URLs without protocol (e.g., www.youtube.com)
   * @default true
   */
  allowNoProtocol?: boolean;
  
  /**
   * Whether to allow URLs without www
   * @default true
   */
  allowNoWWW?: boolean;
  
  /**
   * Whether to allow additional query parameters
   * @default true
   */
  allowQueryParams?: boolean;
}

/**
 * @deprecated Use getYouTubeVideoId for extracting video IDs
 */
export interface URLValidationResult {
  /**
   * Whether the URL is valid
   */
  isValid: boolean;
}

/**
 * Components parsed from a YouTube URL
 */
export interface YouTubeURLComponents {
  type: 'video' | 'playlist' | 'channel' | 'short' | 'live' | 'unknown';
  videoId?: string;
  playlistId?: string;
  channelId?: string;
  parameters: Record<string, string>;
  isEmbed: boolean;
  originalUrl: string;
}

/**
 * Options for generating a YouTube share URL
 */
export interface YouTubeShareOptions {
  [key: string]: string | number;
} 