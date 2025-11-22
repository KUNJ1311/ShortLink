# ShortLink Server

Backend API for ShortLink - A URL shortening service built with Express.js and MySQL.

## Features

- URL shortening with custom codes
- Click analytics tracking (device type, timestamps)
- Real-time health monitoring
- Cookie-based user tracking
- 404 error pages for invalid links

## Tech Stack

- **Node.js** with Express.js
- **MySQL** for data storage
- **Cookie-based authentication**
- **CORS enabled** for cross-origin requests

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=shortlinks
CLIENT_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /healthz` - System health with database metrics

### Links
- `POST /api/links` - Create short link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get link statistics
- `PATCH /api/links/:code` - Update link URL
- `DELETE /api/links/:code` - Delete link

### Redirection
- `GET /:code` - Redirect to original URL

## Database

The database is automatically initialized on startup with the required tables:
- `links` - Stores shortened URLs
- `analytics` - Tracks click events
