# Emitrr - Kanban Task Management Board

A modern, responsive Kanban board application built with React, TypeScript, and Tailwind CSS. This application allows users to create multiple boards, organize tasks across customizable columns, and manage their workflow efficiently with drag-and-drop functionality.

## Features

- **Multi-Board Management**: Create, edit, and delete multiple Kanban boards
- **Drag & Drop**: Intuitive drag-and-drop functionality for tasks and columns
- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Search & Filter**: Search tasks by title/description and filter by priority or due date
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Automatic data persistence using browser's local storage
- **Priority System**: Organize tasks with Low, Medium, and High priority levels
- **Custom Columns**: Add, edit, and delete columns to match your workflow

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS with custom color scheme
- **Drag & Drop**: @dnd-kit library for smooth interactions
- **Routing**: React Router DOM for navigation
- **State Management**: React Context API
- **Build Tool**: Create React App
- **Icons**: Lucide React for consistent iconography

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher)

You can check your versions by running:
```bash
node --version
npm --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Abhilash31304/emitrr.git
cd emitrr
```

### 2. Install Dependencies

Using npm:

npm install

### 3. Start the Development Server

Using npm:

npm start

The application will open automatically in your default browser at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
emitrr/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App favicon
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Column.tsx      # Kanban column component
│   │   ├── TaskCard.tsx    # Individual task card
│   │   ├── TaskModal.tsx   # Task creation/editing modal
│   │   ├── PromptModal.tsx # Generic input modal
│   │   └── ConfirmModal.tsx# Confirmation dialog
│   ├── context/
│   │   └── BoardContext.tsx# Global state management
│   ├── pages/
│   │   ├── BoardView.tsx   # Main board list page
│   │   └── BoardDetailView.tsx # Individual board page
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # App entry point
│   └── index.css           # Global styles and Tailwind imports
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## How to Use

### Creating Your First Board

1. On the homepage, enter a board name in the input field
2. Click "Create Board" to create your first Kanban board
3. Click on the board name to open the board detail view

### Managing Tasks

1. **Create Task**: Click the "+" button in any column to add a new task
2. **Edit Task**: Click on any task card to edit its details
3. **Move Tasks**: Drag and drop tasks between columns or reorder within a column
4. **Delete Task**: Click the delete button on any task card

### Managing Columns

1. **Add Column**: Click "Add Column" at the bottom of the board
2. **Edit Column**: Click the edit button next to the column title
3. **Delete Column**: Click the delete button next to the column title

### Search and Filter

- Use the search bar to find tasks by title or description
- Filter tasks by priority level (Low, Medium, High)
- Filter tasks by due date



## Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience with drag & drop
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Compact view with essential functionality


## Deployment

This project is deployed on vercel: https://emitrr-lake.vercel.app/
