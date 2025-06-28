# SDA-UI

This is a Next.js application for the SDA (Semantic Document Analysis) UI.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- npm (comes with Node.js)

## Running Locally

1. Clone the repository:

```bash
git clone <repository-url>
cd SDA-UI
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the example environment file and modify it as needed:

```bash
cp .env.example .env
```

Update the values in the `.env` file with your actual configuration:

```
# For local development, use localhost:8000 to connect to the API
API_BASE_URL=localhost:8000
NEXT_PUBLIC_API_MOCKING=false
CORS_ALLOWED_ORIGINS=http://localhost:9002,http://127.0.0.1:9002,http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

This will start the application in development mode on port 9002.

5. Access the application at http://localhost:9002

6. To build and run the production version locally:

```bash
npm run build
npm start
```

## Docker Setup

This project includes Docker support for easy deployment and development.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose

1. Build and start the containers:

```bash
docker-compose up -d
```

2. Access the application at http://localhost:9002

3. To stop the containers:

```bash
docker-compose down
```

### Environment Variables in Docker

The Docker Compose setup uses the following environment variables with default values:

- `API_BASE_URL`: Defaults to `host.docker.internal:8000` (which refers to the host machine from within the Docker container)
- `NEXT_PUBLIC_API_MOCKING`: Defaults to `true` (API mocking is enabled by default)
- `CORS_ALLOWED_ORIGINS`: Defaults to a list of allowed origins for CORS

You can override these by:
- Setting them in your environment before running docker-compose
- Creating a `.env` file in the project root

Note: The Docker setup does not include the API service. If you need to connect to an actual API, you should:
1. Set the `API_BASE_URL` to point to your API server
2. Set `NEXT_PUBLIC_API_MOCKING` to `false` if you want to use the real API

### Building the Docker Image Separately

If you want to build the Docker image without using Docker Compose:

```bash
docker build -t sda-ui .
docker run -p 9002:9002 -e API_BASE_URL=your_api_url -e NEXT_PUBLIC_API_MOCKING=false sda-ui
```
