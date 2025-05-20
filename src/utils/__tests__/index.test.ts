import {
  getYouTubeVideoId,
  isValidYouTubeVideoURL,
  normalizeYouTubeVideoURL,
  generateYouTubeShareURL,
  parseYouTubeURL,
  isYouTubeURL,
  toYouTubeEmbedURL,
  toYouTubeShortURL,
  isYouTubeEmbedURL
} from '../youtube/index';

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
      const isValid = isValidYouTubeVideoURL(url);
      expect(isValid).toBe(true);
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
      const isValid = isValidYouTubeVideoURL(url);
      expect(isValid).toBe(false);
    });

    const isValid = isValidYouTubeVideoURL('https://notyoutube.com/watch?v=dQw4w9WgXcQ');
    expect(isValid).toBe(false);
  });

  // Test with different options
  test('should respect validation options', () => {
    // Test with strict options
    const strictResult = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: false,
      allowQueryParams: false,
    });
    expect(strictResult).toBe(false);

    // Test with loose options
    const looseResult = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: true,
      allowNoWWW: true,
      allowQueryParams: true,
    });
    expect(looseResult).toBe(true);
  });

  // Test edge cases
  test('should handle edge cases', () => {
    // Test with special characters in video ID
    const specialCharsResult = isValidYouTubeVideoURL(
      'https://www.youtube.com/watch?v=abcde-fghij'
    );
    expect(specialCharsResult).toBe(true);

    // Test with query parameters
    const queryParamsResult = isValidYouTubeVideoURL(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s&feature=share'
    );
    expect(queryParamsResult).toBe(true);
  });

  test('should add protocol if allowNoProtocol is true', () => {
    const result = isValidYouTubeVideoURL('www.youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: true,
    });
    expect(result).toBe(true);
  });

  test('should reject extra query params when allowQueryParams is false', () => {
    const result = isValidYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123s', {
      allowQueryParams: false,
    });
    expect(result).toBe(false);
  });

  test('should reject video IDs with repeated characters', () => {
    const result = isValidYouTubeVideoURL('https://youtu.be/aaaaaaaaaaa');
    expect(result).toBe(false);
  });
});

describe('getYouTubeVideoId', () => {
  test('should return the video ID from a valid YouTube URL', () => {
    const result = getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toBe('dQw4w9WgXcQ');
  });

  test('should return null for invalid YouTube URLs', () => {
    const result = getYouTubeVideoId('invalid-url');
    expect(result).toBeNull();
  });

  test('should handle various YouTube URL formats', () => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtu.be/dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      const videoId = getYouTubeVideoId(url);
      expect(videoId).toBe('dQw4w9WgXcQ');
    });
  });

  test('should respect validation options', () => {
    // Test with strict options
    const strictResult = getYouTubeVideoId('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: false,
      allowQueryParams: false,
    });
    expect(strictResult).toBeNull();

    // Test with loose options
    const looseResult = getYouTubeVideoId('youtube.com/watch?v=dQw4w9WgXcQ', {
      allowNoProtocol: true,
      allowNoWWW: true,
      allowQueryParams: true,
    });
    expect(looseResult).toBe('dQw4w9WgXcQ');
  });
});

describe('normalizeYouTubeVideoURL (YouTube only)', () => {
  // Test valid YouTube URLs
  test('should normalize standard YouTube URLs', () => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share',
      'http://youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      const result = normalizeYouTubeVideoURL(url);
      expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });
  });

  // Test shortened youtu.be links
  test('should normalize youtu.be URLs', () => {
    const urls = [
      'https://youtu.be/dQw4w9WgXcQ',
      'http://youtu.be/dQw4w9WgXcQ',
      'youtu.be/dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ?t=30s',
      'https://youtu.be/dQw4w9WgXcQ/',
    ];

    urls.forEach((url) => {
      const result = normalizeYouTubeVideoURL(url);
      expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });
  });

  // Test mobile YouTube URLs
  test('should normalize mobile YouTube URLs', () => {
    const result = normalizeYouTubeVideoURL('https://m.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  // Test invalid YouTube URLs
  test('should return null for invalid or incomplete YouTube URLs', () => {
    const invalidUrls = [
      '',
      'not-a-url',
      'https://www.youtube.com',
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?v=short',
      'https://youtu.be/',
      'https://www.youtube.com/watch?v=tooLongVideoId12345',
    ];

    invalidUrls.forEach((url) => {
      const result = normalizeYouTubeVideoURL(url);
      expect(result).toBeNull();
    });
  });

  // Test non-YouTube URLs
  test('should return null for non-YouTube URLs', () => {
    const result = normalizeYouTubeVideoURL('https://vimeo.com/12345678');
    expect(result).toBeNull();
  });
});

describe('generateYouTubeShareURL', () => {
  test('should generate a basic share URL', () => {
    expect(generateYouTubeShareURL('dQw4w9WgXcQ')).toBe('https://youtu.be/dQw4w9WgXcQ');
  });
  test('should add parameters to the share URL', () => {
    expect(generateYouTubeShareURL('dQw4w9WgXcQ', { t: 120 })).toBe('https://youtu.be/dQw4w9WgXcQ?t=120');
    expect(generateYouTubeShareURL('dQw4w9WgXcQ', { t: '2m3s', foo: 'bar' })).toBe('https://youtu.be/dQw4w9WgXcQ?t=2m3s&foo=bar');
  });
});

describe('parseYouTubeURL', () => {
  test('should parse a standard video URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s');
    expect(result.type).toBe('video');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
    expect(result.parameters.t).toBe('120s');
    expect(result.isEmbed).toBe(false);
  });
  test('should parse a youtu.be short URL', () => {
    const result = parseYouTubeURL('https://youtu.be/dQw4w9WgXcQ?t=30');
    expect(result.type).toBe('video');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
    expect(result.parameters.t).toBe('30');
  });
  test('should parse a playlist URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/playlist?list=PL1234567890ABCDEF');
    expect(result.type).toBe('playlist');
    expect(result.playlistId).toBe('PL1234567890ABCDEF');
  });
  test('should parse a channel URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/channel/UC1234567890ABCDEF');
    expect(result.type).toBe('channel');
    expect(result.channelId).toBe('UC1234567890ABCDEF');
  });
  test('should parse a shorts URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    expect(result.type).toBe('short');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });
  test('should parse an embed URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(result.type).toBe('video');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
    expect(result.isEmbed).toBe(true);
  });
  test('should parse a live URL', () => {
    const result = parseYouTubeURL('https://www.youtube.com/live/dQw4w9WgXcQ');
    expect(result.type).toBe('live');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });
  test('should return unknown for invalid URLs', () => {
    const result = parseYouTubeURL('not-a-url');
    expect(result.type).toBe('unknown');
  });
});

describe('isYouTubeURL', () => {
  test('should return true for valid YouTube URLs', () => {
    expect(isYouTubeURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    expect(isYouTubeURL('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    expect(isYouTubeURL('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
  });

  test('should handle URLs without protocol', () => {
    expect(isYouTubeURL('youtube.com')).toBe(true);
    expect(isYouTubeURL('www.youtube.com')).toBe(true);
    expect(isYouTubeURL('youtu.be/dQw4w9WgXcQ')).toBe(true);
  });

  test('should handle URLs with subdomains', () => {
    expect(isYouTubeURL('music.youtube.com')).toBe(true);
    expect(isYouTubeURL('https://music.youtube.com')).toBe(true);
    expect(isYouTubeURL('https://www.music.youtube.com')).toBe(true);
  });

  test('should handle URLs with query parameters and fragments', () => {
    expect(isYouTubeURL('https://youtube.com/watch?v=123&t=30s')).toBe(true);
    expect(isYouTubeURL('https://youtube.com/#section')).toBe(true);
    expect(isYouTubeURL('https://youtube.com/watch?v=123#section')).toBe(true);
  });

  test('should handle URLs with trailing slashes', () => {
    expect(isYouTubeURL('https://youtube.com/')).toBe(true);
    expect(isYouTubeURL('https://youtu.be/')).toBe(true);
    expect(isYouTubeURL('youtube.com/')).toBe(true);
  });

  test('should handle case-insensitive hostnames', () => {
    expect(isYouTubeURL('https://YOUTUBE.com')).toBe(true);
    expect(isYouTubeURL('https://YOUTU.BE/dQw4w9WgXcQ')).toBe(true);
    expect(isYouTubeURL('https://www.YOUTUBE.com')).toBe(true);
  });

  test('should return false for non-YouTube URLs', () => {
    expect(isYouTubeURL('https://vimeo.com/123456')).toBe(false);
    expect(isYouTubeURL('https://example.com')).toBe(false);
    expect(isYouTubeURL('https://youtube.example.com')).toBe(false);
  });

  test('should handle invalid inputs', () => {
    expect(isYouTubeURL('')).toBe(false);
    expect(isYouTubeURL('   ')).toBe(false);
    expect(isYouTubeURL('not-a-url')).toBe(false);
    expect(isYouTubeURL('http://')).toBe(false);
    expect(isYouTubeURL('https://')).toBe(false);
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeURL(null)).toBe(false);
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeURL(undefined)).toBe(false);
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeURL(123)).toBe(false);
  });
});

describe('toYouTubeEmbedURL', () => {
  test('should convert standard watch URLs to embed URLs', () => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeEmbedURL(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });
  });

  test('should convert short URLs to embed URLs', () => {
    const urls = [
      'https://youtu.be/dQw4w9WgXcQ',
      'youtu.be/dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeEmbedURL(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });
  });

  test('should convert shorts URLs to embed URLs', () => {
    const urls = [
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'youtube.com/shorts/dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeEmbedURL(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });
  });

  test('should return null for invalid URLs', () => {
    const invalidUrls = [
      '',
      'not-a-url',
      'https://www.youtube.com',
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?v=',
      'https://vimeo.com/123456789',
    ];

    invalidUrls.forEach((url) => {
      expect(toYouTubeEmbedURL(url)).toBeNull();
    });
  });
});

describe('toYouTubeShortURL', () => {
  test('should convert standard watch URLs to short URLs', () => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeShortURL(url)).toBe('https://youtu.be/dQw4w9WgXcQ');
    });
  });

  test('should convert embed URLs to short URLs', () => {
    const urls = [
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://youtube.com/embed/dQw4w9WgXcQ',
      'youtube.com/embed/dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeShortURL(url)).toBe('https://youtu.be/dQw4w9WgXcQ');
    });
  });

  test('should convert shorts URLs to short URLs', () => {
    const urls = [
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'youtube.com/shorts/dQw4w9WgXcQ',
    ];

    urls.forEach((url) => {
      expect(toYouTubeShortURL(url)).toBe('https://youtu.be/dQw4w9WgXcQ');
    });
  });

  test('should return null for invalid URLs', () => {
    const invalidUrls = [
      '',
      'not-a-url',
      'https://www.youtube.com',
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?v=',
      'https://vimeo.com/123456789',
    ];

    invalidUrls.forEach((url) => {
      expect(toYouTubeShortURL(url)).toBeNull();
    });
  });
});

describe('isYouTubeEmbedURL', () => {
  test('should return true for valid embed URLs', () => {
    const validUrls = [
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://youtube.com/embed/dQw4w9WgXcQ',
      'youtube.com/embed/dQw4w9WgXcQ',
      'www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      'https://youtube.com/embed/dQw4w9WgXcQ?rel=0',
    ];

    validUrls.forEach((url) => {
      expect(isYouTubeEmbedURL(url)).toBe(true);
    });
  });

  test('should return false for non-embed URLs', () => {
    const invalidUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'https://youtube.com/live/dQw4w9WgXcQ',
      'https://vimeo.com/123456789',
      '',
      'not-a-url',
    ];

    invalidUrls.forEach((url) => {
      expect(isYouTubeEmbedURL(url)).toBe(false);
    });
  });

  test('should handle edge cases', () => {
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeEmbedURL(null)).toBe(false);
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeEmbedURL(undefined)).toBe(false);
    // @ts-expect-error Testing invalid input type
    expect(isYouTubeEmbedURL(123)).toBe(false);
    expect(isYouTubeEmbedURL('')).toBe(false);
    expect(isYouTubeEmbedURL('   ')).toBe(false);
  });
});
