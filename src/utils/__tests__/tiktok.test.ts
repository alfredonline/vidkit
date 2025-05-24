import {
  isValidTikTokVideoURL,
  getTikTokVideoId,
  normalizeTikTokVideoURL,
  isTikTokURL,
  generateTikTokShareURL,
} from '../tiktok';

describe('TikTok URL Utilities', () => {
  describe('isValidTikTokVideoURL', () => {
    it('should validate standard TikTok URLs', () => {
      expect(
        isValidTikTokVideoURL('https://www.tiktok.com/@username/video/1234567890123456789')
      ).toBe(true);
      expect(
        isValidTikTokVideoURL('https://tiktok.com/@username/video/1234567890123456789')
      ).toBe(true);
    });

    it('should validate URLs without @ symbol', () => {
      expect(
        isValidTikTokVideoURL('https://www.tiktok.com/username/video/1234567890123456789')
      ).toBe(true);
    });

    it('should validate short TikTok URLs', () => {
      expect(
        isValidTikTokVideoURL('https://vm.tiktok.com/1234567890123456789')
      ).toBe(true);
    });

    it('should validate URLs without protocol', () => {
      expect(
        isValidTikTokVideoURL('tiktok.com/@username/video/1234567890123456789')
      ).toBe(true);
      expect(
        isValidTikTokVideoURL('vm.tiktok.com/1234567890123456789')
      ).toBe(true);
    });

    it('should validate URLs with trailing slashes', () => {
      expect(
        isValidTikTokVideoURL('https://www.tiktok.com/@username/video/1234567890123456789/')
      ).toBe(true);
      expect(
        isValidTikTokVideoURL('https://vm.tiktok.com/1234567890123456789/')
      ).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidTikTokVideoURL('invalid-url')).toBe(false);
      expect(isValidTikTokVideoURL('https://youtube.com/watch?v=123')).toBe(false);
      expect(
        isValidTikTokVideoURL('https://tiktok.com/@username/video/duhefhewfew')
      ).toBe(false);
    });

    it('should reject URLs with invalid usernames', () => {
      expect(
        isValidTikTokVideoURL('https://tiktok.com/@user!/video/1234567890123456789')
      ).toBe(false);
      expect(
        isValidTikTokVideoURL('https://tiktok.com/@a/video/1234567890123456789')
      ).toBe(false);
      expect(
        isValidTikTokVideoURL('https://tiktok.com/@very_long_username_that_exceeds_limit/video/1234567890123456789')
      ).toBe(false);
    });

    it('should respect allowNoProtocol option', () => {
      expect(
        isValidTikTokVideoURL('tiktok.com/@username/video/1234567890123456789', {
          allowNoProtocol: false,
        })
      ).toBe(false);
    });

    it('should respect allowQueryParams option', () => {
      expect(
        isValidTikTokVideoURL(
          'https://tiktok.com/@username/video/1234567890123456789?param=value',
          { allowQueryParams: false }
        )
      ).toBe(false);
    });
  });

  describe('getTikTokVideoId', () => {
    it('should extract video ID from standard URLs', () => {
      expect(
        getTikTokVideoId('https://www.tiktok.com/@username/video/1234567890123456789')
      ).toBe('1234567890123456789');
      expect(
        getTikTokVideoId('https://tiktok.com/@username/video/1234567890123456789')
      ).toBe('1234567890123456789');
    });

    it('should extract video ID from URLs without @ symbol', () => {
      expect(
        getTikTokVideoId('https://www.tiktok.com/username/video/1234567890123456789')
      ).toBe('1234567890123456789');
    });

    it('should extract video ID from short URLs', () => {
      expect(
        getTikTokVideoId('https://vm.tiktok.com/1234567890123456789')
      ).toBe('1234567890123456789');
    });

    it('should handle URLs with trailing slashes', () => {
      expect(
        getTikTokVideoId('https://www.tiktok.com/@username/video/1234567890123456789/')
      ).toBe('1234567890123456789');
      expect(
        getTikTokVideoId('https://vm.tiktok.com/1234567890123456789/')
      ).toBe('1234567890123456789');
    });

    it('should return null for invalid URLs', () => {
      expect(getTikTokVideoId('invalid-url')).toBeNull();
      expect(getTikTokVideoId('https://youtube.com/watch?v=123')).toBeNull();
      expect(
        getTikTokVideoId('https://tiktok.com/@username/video/invalid-id')
      ).toBeNull();
    });

    it('should handle URLs with whitespace', () => {
      expect(
        getTikTokVideoId('  https://www.tiktok.com/@username/video/1234567890123456789  ')
      ).toBe('1234567890123456789');
    });
  });

  describe('normalizeTikTokVideoURL', () => {
    it('should normalize standard URLs', () => {
      expect(
        normalizeTikTokVideoURL('https://www.tiktok.com/@finger.down89/video/7476926243661679902?is_from_webapp=1&sender_device=pc')
      ).toBe('https://www.tiktok.com/@finger.down89/video/7476926243661679902');
      expect(
        normalizeTikTokVideoURL('https://tiktok.com/@username/video/1234567890123456789')
      ).toBe('https://www.tiktok.com/@username/video/1234567890123456789');
    });

    it('should normalize URLs without @ symbol', () => {
      expect(
        normalizeTikTokVideoURL('https://www.tiktok.com/username/video/1234567890123456789')
      ).toBe('https://www.tiktok.com/@username/video/1234567890123456789');
    });

    it('should normalize short URLs', () => {
      expect(
        normalizeTikTokVideoURL('https://vm.tiktok.com/1234567890123456789')
      ).toBe('https://www.tiktok.com/@user/video/1234567890123456789');
    });

    it('should handle URLs with trailing slashes', () => {
      expect(
        normalizeTikTokVideoURL('https://www.tiktok.com/@username/video/1234567890123456789/')
      ).toBe('https://www.tiktok.com/@username/video/1234567890123456789');
      expect(
        normalizeTikTokVideoURL('https://vm.tiktok.com/1234567890123456789/')
      ).toBe('https://www.tiktok.com/@user/video/1234567890123456789');
    });

    it('should return null for invalid URLs', () => {
      expect(normalizeTikTokVideoURL('invalid-url')).toBeNull();
      expect(normalizeTikTokVideoURL('https://youtube.com/watch?v=123')).toBeNull();
      expect(
        normalizeTikTokVideoURL('https://tiktok.com/@username/video/invalid-id')
      ).toBeNull();
    });

    it('should handle URLs with invalid usernames', () => {
      expect(
        normalizeTikTokVideoURL('https://tiktok.com/@user!/video/1234567890123456789')
      ).toBe('https://www.tiktok.com/@user/video/1234567890123456789');
    });
  });

  describe('isTikTokURL', () => {
    it('should identify TikTok URLs', () => {
      expect(
        isTikTokURL('https://www.tiktok.com/@username/video/1234567890123456789')
      ).toBe(true);
      expect(isTikTokURL('https://vm.tiktok.com/1234567890123456789')).toBe(true);
      expect(isTikTokURL('tiktok.com/@username/video/1234567890123456789')).toBe(true);
    });

    it('should handle URLs with trailing slashes', () => {
      expect(
        isTikTokURL('https://www.tiktok.com/@username/video/1234567890123456789/')
      ).toBe(true);
      expect(isTikTokURL('https://vm.tiktok.com/1234567890123456789/')).toBe(true);
    });

    it('should reject non-TikTok URLs', () => {
      expect(isTikTokURL('https://youtube.com/watch?v=123')).toBe(false);
      expect(isTikTokURL('invalid-url')).toBe(false);
    });
  });

  describe('generateTikTokShareURL', () => {
    it('should generate share URLs', () => {
      expect(generateTikTokShareURL('1234567890123456789')).toBe(
        'https://vm.tiktok.com/1234567890123456789'
      );
    });

    it('should handle video IDs with whitespace', () => {
      expect(generateTikTokShareURL('  1234567890123456789  ')).toBe(
        'https://vm.tiktok.com/1234567890123456789'
      );
    });

    it('should throw error for invalid video IDs', () => {
      expect(() => generateTikTokShareURL('invalid-id')).toThrow('Invalid TikTok video ID');
      expect(() => generateTikTokShareURL('123')).toThrow('Invalid TikTok video ID');
      expect(() => generateTikTokShareURL('')).toThrow('Invalid TikTok video ID');
      expect(() => generateTikTokShareURL(null as any)).toThrow('Invalid TikTok video ID');
    });
  });
}); 