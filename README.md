# BIG — Business Opportunity Intelligence

A full-stack web app with login and location-based business opportunity analysis.

## Stack
- **Backend:** Node.js + Express + JWT auth
- **Frontend:** React (Create React App) + CSS Modules

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Start backend (port 4000)
cd backend && npm start

# 3. Start frontend (port 3000) in a new terminal
cd frontend && npm start
```

## Demo Account
- Email: `demo@big.com`
- Password: `demo1234`

## Features
- JWT login / register
- Cascading dropdowns: State → City → ZIP Code → Sector
- Business opportunity card with score, financials, competitors, and verdict
- Covers 14 states, 30+ cities, 16 industry sectors
