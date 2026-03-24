# Digital Showroom Frontend

A premium Next.js application for browsing luxury building materials with advanced filtering, search, and lead generation capabilities.

## Features

- **Product Browsing**: Browse tiles, sanitary ware, and kitchen appliances
- **Dual-Tab Filtering**: Filter by inspiration (style/space) or technical specifications
- **Search Functionality**: Full-text search across product names, SKUs, and descriptions
- **Media Gallery**: View high-resolution images, videos, and 3D files
- **Lead Capture**: Book appointments and request quotes
- **Responsive Design**: Optimized for all device sizes
- **Performance**: Lazy loading, CDN-optimized media delivery

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Update the API URL if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:watch
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and API client
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## API Integration

The application communicates with the Backend API at `/api/v1`. The API client automatically:

- Includes JWT tokens in request headers
- Handles authentication errors
- Provides standardized error handling
- Manages token storage

## Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **CDN Integration**: Media served through Cloudflare CDN
- **Caching**: Optimized cache headers for static assets

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Reduced motion preferences respected

## License

Proprietary - All rights reserved
