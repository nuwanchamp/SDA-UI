# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory of the project with the following variables:

```
API_BASE_URL=your_api_base_url_here
NEXT_PUBLIC_API_MOCKING=false
```

You can also copy the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

Then update the values in the `.env` file with your actual configuration.

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

- `API_BASE_URL`: Defaults to `localhost:8000`
- `NEXT_PUBLIC_API_MOCKING`: Defaults to `true` (API mocking is enabled by default since the API service is not included)

You can override these by:
- Setting them in your environment before running docker-compose
- Creating a `.env` file in the project root

Note: The Docker setup does not include the API service. If you need to connect to an actual API, you should:
1. Set the `API_BASE_URL` to point to your API server
2. Set `NEXT_PUBLIC_API_MOCKING` to `false` if you want to use the real API

### Building the Docker Image Separately

If you want to build the Docker image without using Docker Compose:

```bash
docker build -t firebase-studio .
docker run -p 9002:9002 -e API_BASE_URL=your_api_url firebase-studio
```
