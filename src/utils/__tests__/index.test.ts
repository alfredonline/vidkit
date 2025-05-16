import { isValidYouTubeVideoURL } from '../youtube/index';

describe('isValidYouTubeVideoURL', () => {
  // Test valid URLs
  test('should validate standard YouTube URLs', () => {
    const validUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s',
      'https://youtu.be/dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtu.be/dQw4w9WgXcQ',
    ];

    validUrls.forEach((url) => {
      const result = isValidYouTubeVideoURL(url);
      expect(result.isValid).toBe(true);
      expect(result.videoId).toBe('dQw4w9WgXcQ');
      expect(result.error).toBeUndefined();
    });

  });

  // Test invalid URLs
  test('should reject invalid YouTube URLs', () => {
    const invalidUrls = [
      '',
      'not-a-url',
      'https://www.youtube.com',
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?v=',
      'https://www.youtube.com/watch?v=short',
      'https://www.youtube.com/watch?v=tooLongVideoId12345',
      'https://vimeo.com/123456789',
    ];

    invalidUrls.forEach((url) => {
      const result = isValidYouTubeVideoURL(url);
      expect(result.isValid).toBe(false);
      expect(result.videoId).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    const result = isValidYouTubeVideoURL('https://notyoutube.com/watch?v=dQw4w9WgXcQ');
    expect(result.isValid).toBe(false);
  });

  // Test with different options
  test('should respect validation options', () => {
    // Test with strict options
    const strictResult = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: false,
      allowQueryParams: false,
    });
    expect(strictResult.isValid).toBe(false);

    // Test with loose options
    const looseResult = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: true,
      allowNoWWW: true,
      allowQueryParams: true,
    });
    expect(looseResult.isValid).toBe(true);
  });

  // Test edge cases
  test('should handle edge cases', () => {
    // Test with special characters in video ID
    const specialCharsResult = isValidYouTubeVideoURL(
      'https://www.youtube.com/watch?v=abcde-fghij'
    );
    expect(specialCharsResult.isValid).toBe(true);
    expect(specialCharsResult.videoId).toBe('abcde-fghij');

    // Test with query parameters
    const queryParamsResult = isValidYouTubeVideoURL(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s&feature=share'
    );
    expect(queryParamsResult.isValid).toBe(true);
    expect(queryParamsResult.videoId).toBe('dQw4w9WgXcQ');
  });

  test('should add protocol if allowNoProtocol is true', () => {
    const result = isValidYouTubeVideoURL('www.youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: true,
    });
    expect(result.isValid).toBe(true);
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });

  test('should reject extra query params when allowQueryParams is false', () => {
    const result = isValidYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s', {
      allowQueryParams: false,
    });
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/Extra query parameters/);
  });

  test('should reject video IDs with repeated characters', () => {
    const result = isValidYouTubeVideoURL('https://youtu.be/aaaaaaaaaaa');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/repeated characters/i);
  });
});
