# Vidkit

A toolkit of utilities for developers working with video platform URLs.

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

Contributions are welcome! Please feel free to submit a Pull Request. 

## License

MIT 