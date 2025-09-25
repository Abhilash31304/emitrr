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
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors: { [key: string]: string } = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow"
    >
      <div className="flex justify-between items-center">
        <h4 className="font-bold">{task.title}</h4>
        <span className={`px-2 py-1 text-xs text-white rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm">{task.description}</p>
      <div className="text-xs text-gray-500 mt-2">
        <p>Created by: {task.createdBy}</p>
        <p>Due: {task.dueDate}</p>
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={onEdit} className="text-xs bg-gray-200 px-2 py-1 rounded mr-2">Edit</button>
        <button onClick={onDelete} className="text-xs bg-red-200 px-2 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
