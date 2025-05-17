# Vidkit

A set of utilities for developers working with video platform URLs.

## Installation

```bash
npm install vidkit
```

## Features

- YouTube URL validation and parsing
- More features coming soon!

## Usage

### YouTube URL Validation

```typescript
import { isValidYouTubeVideoURL } from 'vidkit';

// Basic usage
const result = isValidYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(result.isValid); // true
console.log(result.videoId); // 'dQw4w9WgXcQ'

// With validation options
const result = isValidYouTubeVideoURL('youtube.com/watch?v=dQw4w9WgXcQ', {
  allowNoProtocol: true,  // Allow URLs without https://
  allowQueryParams: true  // Allow additional query parameters
});

// Handle invalid URLs
const result = isValidYouTubeVideoURL('invalid-url');
if (!result.isValid) {
  console.log(result.error); // 'Invalid YouTube URL format'
}
```

### Get Video ID

```typescript
import { getYouTubeVideoId } from 'vidkit';

// Basic usage
const videoId = getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(videoId); // 'dQw4w9WgXcQ'

// Invalid URL
const videoId = getYouTubeVideoId('invalid-url');
console.log(videoId); // null
```

### Normalize YouTube URL

```typescript
import { normalizeYouTubeVideoURL } from 'vidkit';

// Standard watch URL
const normalized = normalizeYouTubeVideoURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Short URL
const normalized = normalizeYouTubeVideoURL('https://youtu.be/dQw4w9WgXcQ');
console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Shorts URL
const normalized = normalizeYouTubeVideoURL('https://youtube.com/shorts/dQw4w9WgXcQ');
console.log(normalized); // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Invalid URL
const normalized = normalizeYouTubeVideoURL('invalid-url');
console.log(normalized); // null
```

## API Reference

### `isValidYouTubeVideoURL(url: string, options?: URLValidationOptions): URLValidationResult`

Validates a YouTube video URL and extracts the video ID.

#### Parameters

- `url` (string): The YouTube URL to validate
- `options` (optional): Validation options
  - `allowNoProtocol` (boolean): Whether to allow URLs without protocol (default: true)
  - `allowQueryParams` (boolean): Whether to allow additional query parameters (default: true)

#### Returns

A `URLValidationResult` object with:
- `isValid` (boolean): Whether the URL is valid
- `videoId` (string | undefined): The video ID if valid
- `error` (string | undefined): Error message if invalid

### `getYouTubeVideoId(url: string): string | null`

Extracts the video ID from a YouTube URL. Returns null if the URL is invalid.

#### Parameters

- `url` (string): The YouTube URL to extract the video ID from (supports all valid YouTube URL formats)

#### Returns

- `string | null`: The video ID if the URL is valid, null otherwise

### `normalizeYouTubeVideoURL(url: string): string | null`

Normalizes any valid YouTube URL format to the standard youtube.com/watch?v=VIDEO_ID format.

#### Parameters

- `url` (string): The YouTube URL to normalize (supports various formats including watch URLs, short URLs, and shorts URLs)

#### Returns

- `string | null`: The normalized URL in the format https://www.youtube.com/watch?v=VIDEO_ID, or null if the URL is invalid

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the package:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Contributing

We welcome contributions to Vidkit! Here's how you can help:

### Adding Support for New Video Platforms

1. Create a new folder in the `src/utils` directory named after the platform (e.g., `vimeo`, `dailymotion`)
2. Implement the following files in your platform folder:
   - `index.ts` - Main implementation file
   - `types.ts` - TypeScript type definitions
   - `constants.ts` - Platform-specific constants
   - `index.test.ts` - Unit tests

### Development Workflow

1. Fork the repository
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-platform-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make your changes
5. Run tests:
   ```bash
   npm test
   ```
6. Build the package:
   ```bash
   npm run build
   ```
7. Submit a pull request

### Code Style Guidelines

- Follow the existing code style and patterns
- Use TypeScript for all new code
- Write comprehensive JSDoc comments for all public functions
- Keep functions pure and focused on a single responsibility
- Export all public functions through the main `index.ts`

### Testing Requirements

- Write unit tests for all new functionality
- Include tests for edge cases and error conditions
- Maintain 100% test coverage for new code
- Follow the existing test patterns in `index.test.ts`

### Pull Request Process

1. Update the README.md with documentation for your new features
2. Ensure all tests pass
4. Submit your PR with a clear description of the changes

### Questions or Need Help?

Feel free to open an issue for any questions or clarifications needed.

## License

MIT 