# ShortLink Client

Frontend application for ShortLink - A modern URL shortening service built with Next.js 14 and Tailwind CSS.

## Features

- Create short links with optional custom codes
- View and manage all your links
- Real-time analytics dashboard
- Device-based statistics (desktop, mobile, tablet)
- System health monitoring
- Responsive design

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Axios** for API calls

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Pages

- `/` - Dashboard with link creation form
- `/code/[shortCode]` - Link statistics and analytics
- `/healthz` - System health monitoring

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable components
├── services/         # API service layer
└── styles/          # Global styles
```
