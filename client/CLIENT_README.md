# BrainCare Client

This folder is the complete React/Vite frontend for BrainCare. It is intentionally independent from the backend folder. The backend API is not modified by this client package.

## Modules covered

### Module 1 — Foundation and Design System
- React + Vite + TypeScript
- Tailwind CSS configuration
- Accessible responsive application shell
- Header, desktop sidebar, mobile navigation
- Routes for login, register, dashboard, games, game details, progress, profile and settings
- Reusable Button, Card, Modal, Input, Select, ProgressBar, GameCard, DifficultySelector, LoadingSpinner, EmptyState, ErrorMessage and ConfirmationDialog components
- Loading, empty and error states
- Keyboard focus and skip-navigation foundation
- Large typography and 48px touch targets
- Local shared TypeScript contracts under `src/types`

### Module 2 — Authentication
The client is connected to the existing backend authentication contract:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Authentication uses the existing HTTP-only cookie flow through `credentials: include`. The client never stores a JWT in localStorage and never contains the JWT secret.

Implemented in the client:
- Auth context
- Login form
- Registration form
- Session restoration
- Protected routes
- Logout
- Safe user state
- Field-level API errors

### Module 3 — User Profile
Connected to the existing profile API contract:
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/profile/avatar`
- `DELETE /api/profile/avatar` when supported by the existing backend

Implemented:
- Private profile page
- Profile summary
- Edit profile form
- Date-of-birth validation and client-side age preview
- Gender selection
- Contact email
- Optional address fields
- Avatar upload/remove UI
- Accessible validation and error states

## Intentionally not implemented
- No actual cognitive games
- No game scoring/session persistence
- No progress analytics backend
- No reminders
- No authentication backend logic
- No database logic
- No changes to the server

## Run

1. Copy `.env.example` to `.env` if the backend is not running on port 4000.
2. Set `VITE_API_BASE_URL` to the existing backend URL.
3. Run:

```bash
npm install
npm run dev
```

The Vite development server runs on port 5173.

## Build

```bash
npm run build
```

## Backend integration

Start the existing backend separately. The frontend sends API requests to `VITE_API_BASE_URL` and includes credentials so the backend HTTP-only authentication cookie is used. CORS on the existing backend must allow the frontend origin and credentials.

## Folder map

```text
src/
  components/       reusable UI, layout and profile components
  context/          authentication state
  hooks/            auth/profile hooks
  pages/            application routes
  services/         API clients
  types/            frontend TypeScript contracts
  constants.ts      routes, API paths and design/navigation constants
  App.tsx           routing root
  index.css         Tailwind + accessibility foundation
```
