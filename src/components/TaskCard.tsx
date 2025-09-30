import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * TaskCard component - Renders an individual task with drag-and-drop functionality
 * Features:
 * - Draggable using @dnd-kit/sortable
 * - Priority color coding
 * - Edit and delete actions
 * - Responsive design for mobile and desktop
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // useSortable hook provides drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  });

  // Apply drag transform styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Color mapping for different priority levels
  const priorityColors: { [key: string]: string } = {
    high: 'bg-dark-red',
    medium: 'bg-dark-yellow',
    low: 'bg-olive-green',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded shadow border border-gray-200"
    >
      <div 
        {...attributes}
        {...listeners}
        className="cursor-move touch-manipulation"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h4 className="font-bold text-olive-green text-sm leading-tight">{task.title}</h4>
          <span className={`px-2 py-1 text-xs text-white rounded self-start ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-2 line-clamp-3">{task.description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p className="truncate">Created by: {task.createdBy}</p>
          <p>Due: {task.dueDate}</p>
        </div>
      </div>
      <div className="flex justify-end mt-3 gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }} 
          className="text-xs bg-dark-yellow text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
        >
          Edit
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          className="text-xs bg-dark-red text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
