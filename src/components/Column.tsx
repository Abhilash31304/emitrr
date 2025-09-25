import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
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
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        setSortableNodeRef(node);
        setDroppableNodeRef(node);
      }}
      style={style}
      className="bg-white p-2 rounded w-64 mr-4 flex-shrink-0"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-olive-green" {...attributes} {...listeners}>{column.title}</h3>
        <div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditColumn();
            }} 
            className="text-xs p-1 text-dark-yellow"
          >
            Edit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn();
            }} 
            className="text-xs p-1 text-dark-yellow"
          >
            Delete
          </button>
        </div>
      </div>
      <button onClick={onAddTask} className="w-full mb-2 bg-dark-yellow text-white p-2 rounded">
        Add Task
      </button>
      <SortableContext items={tasks.map(t => t.id)}>
        <div>
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
    </div>
  );
};

export default Column;
