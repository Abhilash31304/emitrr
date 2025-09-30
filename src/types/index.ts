/**
 * Type definitions for the Kanban Board application
 * These interfaces define the data structure used throughout the app
 */

/**
 * Priority levels for tasks
 * Used for visual coding and filtering tasks
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * Task interface - Represents an individual task card
 * Contains all necessary information for task management
 */
export interface Task {
  id: string;          // Unique identifier (UUID)
  title: string;       // Task title/name
  description: string; // Detailed description of the task
  createdBy: string;   // Name of person who created the task
  priority: Priority;  // Priority level (high/medium/low)
  dueDate: string;     // Due date in string format
  columnId: string;    // ID of the column this task belongs to
}

/**
 * Column interface - Represents a Kanban column (e.g., "To Do", "In Progress")
 * Contains tasks and column metadata
 */
export interface Column {
  id: string;      // Unique identifier (UUID)
  title: string;   // Column title/name
  tasks: Task[];   // Array of tasks in this column
}

/**
 * Board interface - Represents a complete Kanban board
 * Contains columns and board metadata
 */
export interface Board {
  id: string;        // Unique identifier (UUID)
  name: string;      // Board name/title
  columns: Column[]; // Array of columns in this board
}
