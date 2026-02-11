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
- Router structure prepared for modular route expansion

## Development Notes

- Models are auto-synced with database on server start
- Default scope excludes password field from User queries for security
- Database connection is authenticated before server starts
- Both frontend and backend use JavaScript with ES6+ modules and features