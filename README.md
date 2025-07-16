# The Web App Monorepo

## Overview

This repository is a monorepo containing all code for The Web App, a modern desktop collaboration tool for developer teams. It includes both the frontend (Next.js + Tauri) and backend (NestJS API), as well as shared packages for types, UI, hooks, and notifications.

## Structure

- `apps/frontend` – Next.js + Tauri desktop app
- `apps/backend` – NestJS API server
- `packages/types` – Shared TypeScript types
- `packages/ui` – Shared UI components (shadcn/ui-based)
- `packages/hooks` – Shared React hooks
- `packages/notifications` – Shared notification logic

## Getting Started

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Start development servers:
   ```sh
   yarn tauri dev
   ```
   This runs both frontend and backend in development mode using Turborepo, as well as starting the Tauri App. Use `yarn dev` to run without the Tauri App.

3. See individual app READMEs for more details.

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines on how to get started, coding standards, and submitting pull requests.

## License

MIT License. See `LICENSE` for details. 