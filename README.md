# Full-Stack TODO App

## Stack

### Backend

- **Node.js & Express** - server.
- **PostgreSQL** - database.
- **Sequelize** - ORM.
- **JWT & Bcrypt** - authentication.
- **Docker** - containerization for DB.

### Frontend

- **React 19 (Vite)** - main library.
- **Tailwind CSS v4** - stylization.
- **React Query (TanStack)** - caching and state management.
- **Axios** - HTTP-requests and interceptors for JWT tokens.
- **Lucide React** - UI icons.

---

## Quick startup

### 1. Prepare database

Make sure Docker is running on your system and execute this command:

```bash
docker-compose up -d
```

_Alternatively, use the shortcut:_ `npm run docker:up`

### 2. Prepare environment variables

Create a `.env` file in root directory with corresponding variables (see `.env.example` for reference).

### 3. Install dependencies

Install dependencies for the root, client, and server with this single command:

```bash
npm run install:all
```

### 4. Start the app

For concurrent startup of the client and server, run:

```bash
npm run dev
```

---

## Scripts Reference

| Command               | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `npm run install:all` | Installs dependencies for root, client, and server folders.        |
| `npm run dev`         | Starts both backend and frontend development servers concurrently. |
| `npm run docker:up`   | Spins up the PostgreSQL container.                                 |
| `npm run docker:down` | Stops and removes the PostgreSQL container.                        |
| `npm run server`      | Runs only the backend server.                                      |
| `npm run client`      | Runs only the frontend client.                                     |
