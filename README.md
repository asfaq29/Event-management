# Event Management Dashboard

A complete React + TypeScript frontend for managing events with authentication and CRUD operations.

## Features

- 🔐 JWT Authentication with login/logout
- 📅 Create, Read, Update, Delete events
- 🔍 Search events by title or organizer
- 📄 Pagination support
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔧 Full TypeScript support

## Tech Stack

- React 19 + TypeScript
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
# Create .env file with:
VITE_API_URL=http://localhost:3000/api
```

3. Start development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── api/
│   └── api.ts                # API configuration and endpoints with TypeScript types
├── components/
│   ├── ProtectedRoute.tsx    # Authentication guard
│   └── EventForm.tsx         # Reusable event form
├── pages/
│   ├── Login.tsx             # Login page
│   └── Dashboard.tsx         # Main dashboard
├── App.tsx                   # Main app component with routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles with Tailwind
```

## API Endpoints

The app expects the following API endpoints:

- `POST /auth/login` - User authentication
- `GET /events?page=&limit=&search=` - Get events with pagination and search
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

## Usage

1. **Login**: Enter your credentials on the login page
2. **Dashboard**: View all events in a table format
3. **Search**: Use the search bar to filter events
4. **Add Event**: Click "Add Event" to create a new event
5. **Edit Event**: Click "Edit" on any event row
6. **Delete Event**: Click "Delete" and confirm
7. **Pagination**: Navigate through pages using the pagination controls
8. **Logout**: Click "Logout" to sign out

## Authentication

- JWT tokens are stored in localStorage
- Protected routes automatically redirect to login if not authenticated
- 401 errors automatically clear tokens and redirect to login

## TypeScript

This project is fully typed with TypeScript:

- All components have proper type definitions
- API responses are typed
- Form data is typed
- Event handlers are properly typed
