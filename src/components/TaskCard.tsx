import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors: { [key: string]: string } = {
    high: 'bg-dark-red',
    medium: 'bg-dark-yellow',
    low: 'bg-olive-green',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-2 mb-2 rounded shadow"
    >
      <div 
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-olive-green">{task.title}</h4>
          <span className={`px-2 py-1 text-xs text-white rounded ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-sm">{task.description}</p>
        <div className="text-xs text-gray-500 mt-2">
          <p>Created by: {task.createdBy}</p>
          <p>Due: {task.dueDate}</p>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }} 
          className="text-xs bg-dark-yellow text-white px-2 py-1 rounded mr-2"
        >
          Edit
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          className="text-xs bg-dark-red text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
