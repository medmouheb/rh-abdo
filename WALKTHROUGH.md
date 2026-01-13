# Project Walkthrough & Developer Guide

This guide explains how to set up, run, and build the NextAdmin HR Desktop Application.

## Prerequisites

- **Node.js**: Ensure Node.js is installed (LTS version recommended).
- **Git**: For version control.
- **Visual Studio Code** (Recommended) with ESLint and Prettier extensions.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Database Setup**:
    Initialize the SQLite database with Prisma.
    ```bash
    npx prisma migrate dev --name init
    # Or to just generate the client
    npx prisma generate
    ```

## Development

To run the application in development mode (Next.js server + Electron window with hot-reload):

```bash
npm run electron:dev
```

- This command runs `next dev` on port 3000.
- It waits for the server to be ready and then launches Electron.
- You can access the web version at `http://localhost:3000`.

## Building for Production

To create a distributable Windows executable (`.exe`):

```bash
npm run electron:build
```

- This runs `next build` to compile the Next.js app.
- Then it runs `electron-builder` to package the application.
- **Output**: The generated executable will be in the `dist_v2/win-unpacked` folder (or `dist_v2` installer depending on config).

## Project Structure

-   `src/`: Next.js source code (pages, components, API).
-   `electron/`: Electron main process (`main.js`) and production server script (`serve.js`).
-   `prisma/`: Database schema and SQLite file (`dev.db`).
-   `public/`: Static assets.

## Common Issues

-   **"spawn cmd.exe ENOENT"**: This is fixed by `electron/serve.js`. If you see this in production, ensure `electron/main.js` is correctly forking `serve.js` instead of spawning npm.
-   **Database Access**: In production, the database is accessed from the resources directory. Ensure migrations are applied before packaging if bundling a pre-seeded DB.
