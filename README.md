<!-- @format -->

<p align="center">
  <img src="apps/frontend/public/placedly_logo.png" alt="Placedly Logo" width="500"/>
</p>

<h1 align="center">Placedly</h1>

<p align="center">
  An app that connects people to their perfect community
</p>

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)
- A Mapbox API key
- An OpenWeather API key

### Environment Setup

1. Create environment files:

```bash
# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env

# Backend environment
cp apps/backend/.env.example apps/backend/.env
```

2. Add your API keys to the environment files:

```env
# apps/frontend/.env
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# apps/backend/.env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```


### Development

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend
```
The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3000`

## Tech Stack

- **Frontend**: React, Material-UI, Vite
- **Backend**: NestJS
- **APIs**: Mapbox, OpenWeather


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
