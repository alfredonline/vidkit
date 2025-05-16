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
 * Result of URL validation
 */
export interface URLValidationResult {
  /**
   * Whether the URL is valid
   */
  isValid: boolean;
  
  /**
   * The video ID if the URL is valid, undefined otherwise
   */
  videoId?: string;
  
  /**
   * Error message if the URL is invalid, undefined otherwise
   */
  error?: string;
} 