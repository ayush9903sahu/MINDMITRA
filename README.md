# BrainCare — Module 2: Authentication

This folder contains only Module 2 (Authentication), built to slot into the
shared `braincare/` monorepo structure (`client/`, `server/`, `shared/`).

See the accompanying integration summary provided in chat (files created,
API docs, env vars, test/run commands, and integration steps) for full
details. In short:

- Backend: `server/src/{controllers,routes,services,middleware,utils}/auth*`
  plus `server/prisma/schema.prisma` (User model).
- Frontend: `client/src/context/AuthContext.tsx`, `client/src/hooks/useAuth.ts`,
  `client/src/components/ProtectedRoute.tsx`, `client/src/pages/{Login,Register}Page.tsx`.
- Shared: `shared/types/auth.types.ts`, `shared/constants/auth.constants.ts`.

`client/src/pages/DashboardPage.tsx` and the route wiring in `client/src/App.tsx`
are placeholders for exercising the protected-route flow only — Module 1 owns
the real navigation shell and should replace them, following the integration
notes at the top of `App.tsx`.
