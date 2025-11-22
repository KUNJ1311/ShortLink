# ShortLink

A modern URL shortening service with analytics tracking.

## What is ShortLink?

ShortLink allows you to create short, memorable links for long URLs. Track clicks, analyze traffic by device type, and manage all your shortened links from a simple dashboard.

## Features

- ✂️ **URL Shortening** - Create short links with optional custom codes
- 📊 **Analytics** - Track clicks with device-type breakdown (desktop, mobile, tablet)
- 🎯 **Dashboard** - Manage all your links in one place
- 💾 **Persistent Links** - All links stored in MySQL database
- 🏥 **Health Monitoring** - Real-time system health dashboard
- 🎨 **Modern UI** - Built with Next.js 14 and Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Node.js with Express.js
- MySQL Database
- Cookie-based user tracking
- RESTful API

## Project Structure

```
ShortLink/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
└── .github/         # CI/CD workflows
```

## Getting Started

### Prerequisites
- Node.js 22.x
- MySQL database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/KUNJ1311/ShortLink.git
cd ShortLink
```

2. **Setup Backend**
```bash
cd server
npm install
# Configure .env file (see server/README.md)
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
# Configure .env.local file (see client/README.md)
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Documentation

- [Server Documentation](./server/README.md)
- [Client Documentation](./client/README.md)

## Deployment

The project includes automated CI/CD workflows for Azure deployment:
- Frontend deploys to Azure Web App
- Backend deploys to Azure Container Apps

## License

MIT
