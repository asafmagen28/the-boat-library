# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Server (Node.js + Express + JavaScript)
```bash
cd server
npm run dev          # Start development server with nodemon (port 3001)
npm start           # Run production build
```

### Client (React + JavaScript)
```bash
cd client
npm start           # Start development server (port 3000)
npm run build       # Build for production
npm test            # Run Jest tests (interactive watch mode)
npm test -- --watchAll=false              # Run all tests once (CI mode)
npm test -- --testPathPattern=Login       # Run tests matching "Login"
```

### Required Environment Variables (server)
- `JWT_SECRET` — **required**, no default, validated on startup
- `DB_USER`, `DB_NAME`, `DB_HOST`, `DB_PORT` — have defaults (see `server/src/config/database.js`)
- `DB_PASSWORD` — defaults to empty string
- `NODE_ENV` — affects error detail level and CORS policy
- `CLIENT_URL` — used for CORS in production
- `PORT` — defaults to 3001

## Architecture Overview

Full-stack library management system: React frontend + Express backend + PostgreSQL.

### Backend Structure (/server)
- **Stack**: Express 5, Sequelize ORM, PostgreSQL, JWT auth
- **Request flow**: `route → authenticate → authorize → controller → service → model`
- **Controller → Service pattern**: Controllers handle HTTP (req/res), services handle business logic (see `auth.controller.js` → `auth.service.js`)
- **Models auto-sync** on startup via `sequelize.sync()` — no migration files yet
- **Startup sequence**: validate env vars → authenticate DB connection → sync models → listen

### Database Schema
ERD defined in `ERD.mmd`. Key entities and relationships:
- **Authors → Books → Copies**: Authors write books, books have physical copy instances
- **Users → Loans → Copies**: Users borrow copies through loans
- **Transactions**: Financial records linked to users (and optionally loans). Signed amounts: deposits positive, charges negative
- **Roles / Status / TransactionType**: Lookup tables (no timestamps)
- **EmployeeCode**: Invitation codes for employee registration (bcrypt-hashed, have expiry)
- **Soft deletion** (`paranoid: true`): enabled on User, Book, Author

### Model Associations (server/src/models/index.js)
- All relationships centralized in `models/index.js`
- Transaction has dual User relationship: `targetUserId` (receiver) and `actorId` (initiator), using aliases `receivedTransactions` / `initiatedTransactions`
- User default scope excludes password — use `User.scope(null)` to include it

### API Structure
- Base route: `/api`, health check: `GET /api/health`
- Route files: `server/src/routes/*.routes.js` (mounted in `routes/index.js`)
- Many endpoints are **stubs returning 501** — check route files before implementing

### Frontend Structure (/client)
- **Stack**: React 19, React Router v7, Sass (CSS Modules), Create React App

#### Provider & Layout Hierarchy
```
<BrowserRouter>
  <AuthProvider>           ← context/AuthContext.jsx
    <App>                  ← App.jsx (route definitions)
      <AuthLayout>         ← for /login, /register (centered card)
      <MainLayout>         ← for all other pages (Navbar + content + Footer)
```

#### Routing & Access Control
- `<PublicRoute>` — redirects authenticated users to `/`
- `<ProtectedRoute>` — redirects unauthenticated users to `/login`
- `<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>` — redirects unauthorized users to `/access-denied`

#### Styling
- CSS Modules: each component imports `./Component.module.scss`
- Global variables in `client/src/styles/_variables.scss` (colors, spacing, typography)
- Import variables in modules with `@use '../../../styles/variables'`

## Development Notes

### Auth & Security Conventions
- JWT payload: `{ id, roleId, roleName }` — includes both for flexibility
- Backend `authorize()` middleware checks **roleName strings**: `authorize("employee")`
- Frontend role checks use **roleId constants** from `client/src/constants/roles.js`: `ROLES.EMPLOYEE = 1`, `ROLES.CUSTOMER = 2`
- Middleware chain: `authenticate → authorize("role") → handler`
- User budget is **calculated** via `Transaction.sum("amount")`, not a stored field
- Express 5 catches async rejections natively — no need for express-async-errors
- Global error handler is last middleware in `server/src/index.js`
- Error handler sanitizes 500-level errors in production to "Internal Server Error"

### Employee Registration Flow
Registration has a special employee code flow (see `auth.service.js`):
1. If `employeeCode` provided, fetch all unused non-expired codes from DB
2. Loop through codes using `bcrypt.compare` (codes are hashed)
3. If match found → assign "employee" role; otherwise → assign "customer" role
4. Entire operation (create user + mark code used) wrapped in a Sequelize transaction

### AuthContext (client/src/context/AuthContext.jsx)
Currently stubbed with a `FAKE_USER` for development. Provides `user`, `login`, `logout`, and `switchRole` (dev-only toggle between employee/customer).

### Frontend ID Conventions (QA Automation)
- **Every** interactive and important element must have an `id` attribute
- Use **kebab-case**: `id="login-email-input"`, `id="navbar-logo"`
- Page containers: `id="{page-name}-page"` (e.g., `id="login-page"`)
- Buttons: `id="{context}-{action}-btn"` (e.g., `id="navbar-logout-btn"`)
- Nav links: `id="nav-link-{label}"` (e.g., `id="nav-link-home"`)
- Dynamic/listed items: include the entity ID (e.g., `id="book-card-{book.id}"`)
- Reusable components (`Button`, `FormInput`, etc.) accept an optional `id` prop and pass it to the underlying HTML element
- `FormInput` links `<label htmlFor={id}>` to `<input id={id}>` for accessibility

## Learning-Focused Guidance

**IMPORTANT**: This project is for learning purposes. When working with this codebase:

- **TEACH, don't just do**: Explain concepts, patterns, and reasoning behind solutions
- **GUIDE through implementation**: Break down tasks into steps and explain each step
- **ENCOURAGE hands-on practice**: Suggest what the user should try themselves rather than implementing everything automatically
- **EXPLAIN the "why"**: Always explain why certain approaches are better than others
- **ASK guiding questions**: Help the user think through problems rather than providing direct answers immediately
- **SHOW examples**: Demonstrate patterns and best practices with explanations
- **ENCOURAGE experimentation**: Suggest variations and improvements the user could explore

The goal is to help the user learn and understand, not to complete tasks for them.
