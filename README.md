
# Vasco van Gils

**This is Fastodo, a task management application built with React and Supabase. This app helps users organize their tasks efficiently with folders, priorities, due dates and more.**

## How it's made:
**Tech used:**

React.js for the frontend, written in TypeScript. Supabase is used for the backend and authentication. The UI is built with Tailwind CSS and shadcn/ui components.

## Optimizations:

Implemented folder organization for better task management

Added filtering and sorting capabilities for improved task discovery

Improved task prioritization with visual indicators

## Lessons learned:

I learned how to integrate Supabase for authentication and database functionality. I also learned how to implement proper state management in React with context. The project helped me understand Row Level Security (RLS) in database systems and how to structure a React application with reusable components.

## Features:

- User authentication with email and password
- Create, update, and delete tasks
- Organize tasks in custom folders
- Filter tasks by completion status
- Sort tasks by due date, priority, or name
- Responsive design for any device
- Dark/light mode toggle

## Prerequisites:

Before running the project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Supabase account for backend services

## Installation Steps:

**Database Setup:**
  - Create a Supabase account and project
  - Run the SQL scripts to create necessary tables and policies

**Project Setup:**
  - Clone the repository
  - Navigate to the project directory
  - Create a `.env` file with your Supabase credentials

## How to run the project?

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

