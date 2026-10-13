# Workflow Engine Frontend

[![CI](https://github.com/suvamAdhikary/workflow-engine-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/suvamAdhikary/workflow-engine-frontend/actions/workflows/ci.yml)

A modern, responsive React-based frontend for managing and visualizing workflow automation. This application provides an intuitive interface for creating, editing, and monitoring automated workflows with HTTP triggers, filtering, transformations, and external API integrations.

## Features

- **Workflow Management**: Create, edit, enable/disable, and delete workflows through an intuitive UI
- **Visual Workflow Builder**: Step-by-step workflow configuration with multiple step types:
  - **Filter Steps**: Conditional logic to control workflow execution
  - **Transform Steps**: Data transformation with templating, default values, and field selection
  - **HTTP Request Steps**: Make external API calls with configurable methods, headers, and retries
- **Real-time Monitoring**: View workflow execution history and detailed run logs
- **HTTP Trigger Webhooks**: Each workflow gets a unique webhook URL for triggering
- **Authentication**: Secure user authentication with JWT tokens
- **Responsive Design**: Modern UI built with TailwindCSS, optimized for all screen sizes
- **Code Editor Integration**: Monaco Editor for advanced template editing

## Architecture

This frontend application pairs with the [Workflow Engine Backend](https://github.com/suvamAdhikary/workflow-engine-backend) to provide a complete workflow automation solution.

### Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Powerful async state management
- **Zustand** - Lightweight state management for auth
- **TailwindCSS** - Utility-first CSS framework
- **Monaco Editor** - Code editing capabilities
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Running instance of [Workflow Engine Backend](https://github.com/suvamAdhikary/workflow-engine-backend)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/suvamAdhikary/workflow-engine-frontend.git
cd workflow-engine-frontend
```

2. **Install dependencies**

```bash
yarn install
```

3. **Configure environment variables**

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section below).

4. **Start the development server**

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
yarn build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
yarn preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |
| `VITE_API_TIMEOUT` | API request timeout in milliseconds | `30000` | No |
| `VITE_APP_NAME` | Application display name | `Workflow Engine` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_NODE_ENV` | Environment (development/production) | `development` | No |
| `VITE_ENABLE_DEBUG` | Enable debug logging | `true` | No |
| `VITE_ENABLE_MOCK_DATA` | Enable mock data (not implemented) | `false` | No |
| `VITE_TOKEN_STORAGE_KEY` | LocalStorage key for access token | `workflow_engine_token` | No |
| `VITE_REFRESH_TOKEN_STORAGE_KEY` | LocalStorage key for refresh token | `workflow_engine_refresh_token` | No |

**Important**: Make sure `VITE_API_BASE_URL` points to your running backend instance.

## Project Structure

```
workflow-engine-frontend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── public/                 # Static assets
├── src/
│   ├── api/               # API client modules
│   │   ├── auth.api.ts
│   │   ├── runs.api.ts
│   │   └── workflows.api.ts
│   ├── assets/            # Images and static files
│   ├── components/        # React components
│   │   ├── auth/          # Authentication pages
│   │   ├── layout/        # Layout components
│   │   ├── runs/          # Workflow run history & details
│   │   └── workflows/     # Workflow management UI
│   ├── lib/               # Utility libraries
│   │   ├── api-client.ts  # Axios instance configuration
│   │   └── query-client.ts # TanStack Query configuration
│   ├── stores/            # Zustand stores
│   │   └── auth.store.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.tsx           # Application entry point
├── .env.example           # Environment variables template
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn preview` - Preview production build locally

## Screenshots

<!-- TODO: Add screenshots here
### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Workflow Builder
![Workflow Builder](./docs/screenshots/workflow-builder.png)

### Run History
![Run History](./docs/screenshots/run-history.png)
-->

_Screenshots coming soon_

## Backend Integration

This frontend requires the [Workflow Engine Backend](https://github.com/suvamAdhikary/workflow-engine-backend) to function. The backend provides:

- RESTful API for workflow CRUD operations
- User authentication and authorization
- Workflow execution engine
- HTTP webhook endpoints for workflow triggers
- Run history and logging

Make sure the backend is running and accessible at the URL specified in `VITE_API_BASE_URL`.

## Deployment

### Vercel

This project includes a `vercel.json` configuration for easy deployment to Vercel:

```bash
vercel deploy
```

### Other Platforms

The built static files in `dist/` can be deployed to any static hosting service (Netlify, GitHub Pages, AWS S3, etc.).

## Development

### Code Style

This project uses ESLint with TypeScript support. Run linting with:

```bash
yarn lint
```

### Type Checking

TypeScript type checking is run during build, but you can also run it separately:

```bash
yarn tsc -b --noEmit
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is available as open source.

## Author

**Suvam Adhikary**

- GitHub: [@suvamAdhikary](https://github.com/suvamAdhikary)

## Related Projects

- [Workflow Engine Backend](https://github.com/suvamAdhikary/workflow-engine-backend) - The backend API for this application

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and development timeline.
