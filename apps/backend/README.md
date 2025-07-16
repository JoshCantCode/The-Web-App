# The Web App – Backend API

This is the backend API for The Web App, built with [NestJS](https://nestjs.com/) and [MikroORM](https://mikro-orm.io/). It provides all server-side logic, authentication, and database access for the platform.

## Features

- RESTful API for servers, channels, categories, messages, and users
- Real-time communication via WebSockets
- Authentication using [better-auth](https://www.npmjs.com/package/better-auth)
- PostgreSQL database (via Neon)
- Modular, scalable architecture

## Project Structure

- `src/`
  - `category/`, `channel/`, `message/`, `server/`, `user/` – Feature modules
  - `entities/` – MikroORM entity definitions
  - `migrations/` – Database migrations
  - `websocket/` – WebSocket gateway
  - `utils/` – Utility functions
- `scripts/` – Code generation and utility scripts
- `test/` – End-to-end and unit tests

## Getting Started

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Set up your environment variables. See `.env.example` for required variables.
3. Run the development server:
   ```sh
   yarn start:dev
   ```
4. Run tests:
   ```sh
   yarn test
   ```

## Database Migrations

- Create a new migration:
  ```sh
  yarn migration:create
  ```
- Run migrations:
  ```sh
  yarn migration:up
  ```

## License

MIT License. See `LICENSE` for details.
