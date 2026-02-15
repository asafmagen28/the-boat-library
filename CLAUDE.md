# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Server (Node.js + Express + JavaScript)
```bash
cd server
npm run dev          # Start development server with nodemon
npm start           # Run production build
```

### Client (React + JavaScript)
```bash
cd client
npm start           # Start development server (port 3000)
npm run build       # Build for production
npm test           # Run Jest tests
```

## Architecture Overview

This is a full-stack library management system with a React frontend and Express backend.

### Backend Structure (/server)
- **Technology Stack**: Express.js, JavaScript, Sequelize ORM, PostgreSQL
- **Database**: PostgreSQL with Sequelize ORM for models and migrations
- **Authentication**: bcryptjs for password hashing (User model includes password hashing hooks)
- **Port**: 3001 (configurable via PORT environment variable)

### Database Schema
The system follows a comprehensive library management ERD defined in `ERD.mmd`:
- **Core Entities**: Authors, Books, Copies (physical book instances), Users, Loans
- **Supporting Entities**: Roles (user permissions), Status (copy availability), Transactions, Employee Codes
- **Key Relationships**:
  - Authors write Books, Books have multiple Copies
  - Users borrow Copies through Loans
  - Transactions track financial operations linked to Loans
  - Users have Roles, Copies have Status

### Model Relationships (server/src/models/index.js)
- Complex many-to-many and one-to-many associations fully configured
- Soft deletion enabled for Users, Books, Authors (paranoid: true)
- Password hashing and comparison methods in User model
- Foreign key constraints and indexes defined

### Frontend Structure (/client)
- **Technology Stack**: React 19, JavaScript, Sass, Create React App
- **Testing**: Jest with React Testing Library
- **Port**: 3000

### Environment Configuration
- Server uses dotenv for environment variables
- Database configuration in `server/src/config/database.js`
- Default database: PostgreSQL on localhost:5432

### API Structure
- Base API route: `/api`
- Health check endpoint: `GET /api/health`
- Route files: `server/src/routes/*.routes.js` (mounted in `routes/index.js`)
- Controllers: `server/src/controllers/*.controller.js`
- Middlewares: `server/src/middlewares/` (authenticate, authorize, errorHandler)

## Development Notes

- Models are auto-synced with database on server start
- Default scope excludes password field from User queries for security
- Database connection is authenticated before server starts
- Both frontend and backend use JavaScript with ES6+ modules and features

### Auth & Security Conventions
- JWT payload: `{ id, roleId, roleName }` — roleName avoids DB lookup per request
- Middleware chain for protected routes: `authenticate → authorize("role") → handler`
- Role names: `"employee"` and `"customer"` (matching Role.roleName in DB)
- User budget is calculated via `Transaction.sum("amount")`, not a stored field
- Signed amounts: deposits are positive, charges are negative
- Express 5 catches async rejections natively — no need for express-async-errors
- Global error handler is last middleware in `server/src/index.js`

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