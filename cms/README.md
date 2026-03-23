# Digital Showroom CMS

Admin dashboard for managing products, media, leads, and system content for the Digital Showroom platform.

## Features

- **Authentication**: JWT-based login system with token management
- **Protected Routes**: Authenticated users only access to admin features
- **Dashboard**: Overview of key metrics and quick access to management interfaces
- **Product Management**: Create, edit, and manage products with JSONB technical specifications
- **Category Management**: Organize products into hierarchical categories
- **Tag Management**: Manage style and space tags for inspiration-based filtering
- **Media Management**: Upload and organize multiple media types per product
- **Lead Management**: Track and manage customer inquiries

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

```bash
cd cms
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Development

```bash
npm run dev
```

The CMS will be available at `http://localhost:3002`

### Building

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
├── app/                    # Next.js app directory
│   ├── dashboard/         # Protected dashboard routes
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Root redirect page
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   └── protected-route.tsx
├── contexts/            # React contexts
│   └── auth-context.tsx
└── lib/                 # Utility functions and services
    ├── api-client.ts
    └── auth-service.ts
```

## Authentication Flow

1. User navigates to `/login`
2. Enters email and password
3. Credentials sent to `/api/v1/auth/login`
4. JWT token received and stored in localStorage
5. User redirected to `/dashboard`
6. Protected routes check for valid token
7. Token automatically included in all API requests
8. On 401 response, user redirected to login

## API Integration

The CMS communicates with the backend API at `/api/v1`. All requests include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development Notes

- Uses Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for HTTP requests
- React Context for state management
