# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TikTok URL validation and parsing utilities:
  - `isValidTikTokVideoURL` function to validate TikTok video URLs
  - `getTikTokVideoId` function to extract video IDs from TikTok URLs
  - `normalizeTikTokVideoURL` function to convert any valid TikTok URL format to the standard format
  - `generateTikTokShareURL` function to generate TikTok share URLs
  - `isTikTokURL` function to check if a URL is any valid TikTok URL
  - Support for various TikTok URL formats:
    - Standard URLs (tiktok.com/@username/video/VIDEO_ID)
    - Short URLs (vm.tiktok.com/VIDEO_ID)
  - Configurable validation options:
    - Protocol validation
    - Query parameter validation
    - Username validation
- Documentation and unit tests for TikTok utilities
- `generateYouTubeShareURL` function to generate a YouTube share URL with specific parameters
- `parseYouTubeURL` function to parse a YouTube URL into its components (video ID, playlist ID, channel ID, parameters, etc.)
- `isYouTubeURL` function to check if a URL is any valid YouTube URL (video, playlist, channel, etc.)
- Documentation and unit tests for the above functions

## [2.0.0] - 2024-03-19

### Breaking Changes
- `isValidYouTubeVideoURL` now returns a boolean instead of an object with `isValid`, `videoId`, and `error` properties
  - Use `getYouTubeVideoId` to extract video IDs from URLs
  - The function is now more focused on its single responsibility of validation
- `getYouTubeVideoId` has been enhanced to handle all video ID extraction logic
  - Now accepts the same validation options as `isValidYouTubeVideoURL`
  - Returns `null` for invalid URLs instead of undefined

### Migration Guide

#### Updating from v1.x to v2.0.0

1. Replace validation result object usage with direct boolean:
   ```typescript
   // Before (v1.x)
   const result = isValidYouTubeVideoURL(url);
   if (result.isValid) {
     const videoId = result.videoId;
     // ... use videoId
   }

   // After (v2.0.0)
   const isValid = isValidYouTubeVideoURL(url);
   if (isValid) {
     const videoId = getYouTubeVideoId(url);
     // ... use videoId
   }
   ```

2. Update error handling:
   ```typescript
   // Before (v1.x)
   const result = isValidYouTubeVideoURL(url);
   if (!result.isValid) {
     console.error(result.error);
   }

   // After (v2.0.0)
   const isValid = isValidYouTubeVideoURL(url);
   if (!isValid) {
     // Handle invalid URL case
     // Note: Specific error messages are no longer provided
   }
   ```

3. Using validation options with `getYouTubeVideoId`:
   ```typescript
   // Before (v1.x)
   const result = isValidYouTubeVideoURL(url, { allowNoProtocol: false });
   const videoId = result.videoId;

   // After (v2.0.0)
   const videoId = getYouTubeVideoId(url, { allowNoProtocol: false });
   ```

### Improvements
- Better separation of concerns between validation and ID extraction
- Simplified API that's easier to use and understand
- More consistent error handling across functions

## [1.1.0] - 2024-03-19

### Added
- Added `normalizeYouTubeVideoURL` function to convert any valid YouTube URL format to the standard format
- Added support for YouTube Shorts URLs in URL normalization

### Improvements
- Enhanced documentation with more examples
- Added comprehensive test coverage for new features

## [1.0.0] - 2024-03-19

### Added
- Initial release
- YouTube URL validation with `isValidYouTubeVideoURL`
- Video ID extraction with `getYouTubeVideoId`
- Support for various YouTube URL formats:
  - Standard watch URLs (youtube.com/watch?v=VIDEO_ID)
  - Short URLs (youtu.be/VIDEO_ID)
  - Mobile URLs (m.youtube.com/watch?v=VIDEO_ID)
- Configurable validation options:
  - Protocol validation
  - Query parameter validation
  - WWW prefix validation 