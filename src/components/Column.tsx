import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onAddTask, onEditColumn, onDeleteColumn, onEditTask, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 p-2 rounded w-64 mr-4 flex-shrink-0"
    >
      <div className="flex justify-between items-center mb-2" {...attributes} {...listeners}>
        <h3 className="font-bold">{column.title}</h3>
        <div>
          <button onClick={onEditColumn} className="text-xs p-1">Edit</button>
          <button onClick={onDeleteColumn} className="text-xs p-1">Delete</button>
        </div>
      </div>
      <SortableContext items={tasks.map(t => t.id)}>
        <div className="min-h-[100px]">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      </SortableContext>
      <button onClick={onAddTask} className="w-full mt-2 bg-gray-200 p-2 rounded">
        Add Task
      </button>
    </div>
  );
};

export default Column;
