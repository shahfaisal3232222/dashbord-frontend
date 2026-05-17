# Dashboard Frontend

A modern React frontend for a dashboard-style task manager with:

- User registration and login
- Protected routes using client-side auth checks
- Todo creation, listing, toggling, and deletion
- Profile page with avatar upload and delete
- Backend integration through Axios
- Vercel-ready SPA deployment

This README is based on the current implementation so it reflects how the app actually works today.

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS v4
- Vercel

## Features

### Authentication Flow

- Register a new account
- Log in with email and password
- Store JWT token in `localStorage`
- Protect private pages on the client
- Redirect unauthenticated users back to the login page

### Todo Experience

- View personal task list
- Add new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- View progress stats:
  - total tasks
  - completed tasks
  - remaining tasks

### Profile Experience

- View account information
- View profile creation date
- Upload avatar image
- Replace existing avatar
- Delete avatar

## Project Structure

```text
dashbord-frontend/
|-- public/
|   `-- vite.svg
|-- src/
|   |-- assets/
|   |   `-- react.svg
|   |-- axiosInstance/
|   |   `-- axiosInstance.js
|   |-- pages/
|   |   |-- HomePage.jsx
|   |   |-- ImageUpload.jsx
|   |   |-- LoginPage.jsx
|   |   |-- Profile.jsx
|   |   `-- RegisterPage.jsx
|   |-- routes/
|   |   `-- Authenticated.jsx
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
|-- vercel.json
`-- vite.config.js
```

## Application Routes

The frontend currently uses these routes:

- `/` -> login page
- `/register` -> registration page
- `/home` -> protected todo dashboard
- `/profile` -> protected profile page

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_BASE_URL=http://localhost:5000
```

`VITE_BASE_URL` should point to your backend server.

Examples:

- local backend: `http://localhost:5000`
- deployed backend: `https://your-backend-domain.vercel.app`

## Installation

```bash
npm install
```

## Run Locally

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Backend Integration

All API calls are made through the Axios instance in:

- `src/axiosInstance/axiosInstance.js`

Current behavior:

- Uses `import.meta.env.VITE_BASE_URL` as the base URL
- Automatically attaches JWT token from `localStorage`
- Sends token as:

```http
Authorization: Bearer <token>
```

## API Endpoints Used By The Frontend

### Auth

- `POST /api/user/register`
- `POST /api/user/login`

### Todos

- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`

### Profile / Avatar

- `GET /api/upload/profile`
- `POST /api/upload/avatar`
- `DELETE /api/upload/avatar`

## User Flow

### 1. Registration

The user creates an account from `/register`.

### 2. Login

The user logs in from `/`.

If login succeeds:

- the JWT token is saved in `localStorage`
- the user is redirected to `/home`

### 3. Protected Navigation

The `Authenticated` route wrapper checks for a token in `localStorage`.

If no token exists:

- the user is redirected to `/`

### 4. Todo Management

On the home page, the app:

- loads the user's todos from the backend
- displays task statistics
- allows adding, toggling, and deleting todos

### 5. Profile Management

On the profile page, the app:

- fetches the authenticated user's profile
- displays name, email, and join date
- allows avatar upload and deletion

## UI Notes

The current UI has a custom styled visual direction with:

- dark dashboard aesthetic
- glass-like cards
- inline component-level styling
- animated highlights and loading states
- responsive layout for smaller screens

## Deployment

This project includes a `vercel.json` file configured for SPA routing.

All routes are rewritten to:

```text
/index.html
```

This allows direct navigation to frontend routes like `/home` and `/profile` after deployment.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Important Implementation Notes

These points reflect the current codebase and are useful for contributors:

- Auth state is stored only in `localStorage`; there is no global auth context yet
- Protected routing is handled on the client with a wrapper component
- Axios automatically injects the bearer token for authenticated requests
- The profile page removes the token and redirects to login if profile fetch returns `401`
- Image upload is handled as base64 data before being sent to the backend
- The frontend expects the backend to support avatar management and JWT auth

## Known Gaps / Improvement Opportunities

From a senior frontend engineering perspective, these are the next improvements I would recommend:

- Move repeated inline styles into reusable components or a shared styling system
- Add form validation and clearer field-level error states
- Add a global auth store or context instead of reading `localStorage` in multiple places
- Add loading, empty, and error states with shared UI primitives
- Add toast notifications instead of browser `alert()`
- Add test coverage for routing, login flow, todo actions, and avatar upload
- Improve accessibility for form controls, buttons, and keyboard interaction
- Normalize API response handling across all pages
- Add an `.env.example` file

## Current Backend Contract Caution

There appears to be a naming mismatch between the todo model in the backend and how the frontend toggles completion state.

Frontend currently uses:

- `todo.completed`
- update payload: `{ completed: true/false }`

But the backend model defines:

- `isCompleted`

If toggling completion does not behave as expected, this contract mismatch is the first thing to fix.

## Author

Shah Faisal Khalil
