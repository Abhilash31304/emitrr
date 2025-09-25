import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from '../components/Column';
import { Board, Task, Priority } from '../types';

const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const context = useContext(BoardContext);
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterDueDate, setFilterDueDate] = useState('');

  useEffect(() => {
    if (context && id) {
      const currentBoard = context.getBoard(id);
      setBoard(currentBoard);
    }
  }, [context, id]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!context || !board) {
    return <div>Loading...</div>;
  }

  const {
    createColumn,
    editColumn,
    deleteColumn,
    createTask,
    editTask,
    deleteTask,
    moveTask,
    reorderTask,
  } = context;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeIsTask = active.data.current?.type === 'Task';
    const overIsTask = over.data.current?.type === 'Task';
    const overIsColumn = over.data.current?.type === 'Column';

    if (activeIsTask) {
      const activeTask = board.columns.flatMap(c => c.tasks).find(t => t.id === activeId);
      if (!activeTask) return;

      if (overIsColumn) {
        // Move task to a different column
        moveTask(board.id, activeTask.columnId, overId, activeId, 0);
      } else if (overIsTask) {
        // Reorder task within the same column or move to a different column
        const overTask = board.columns.flatMap(c => c.tasks).find(t => t.id === overId);
        if (!overTask) return;

        if (activeTask.columnId === overTask.columnId) {
          // Reorder task in the same column
          const newIndex = board.columns.find(c => c.id === activeTask.columnId)!.tasks.findIndex(t => t.id === overId);
          reorderTask(board.id, activeTask.columnId, activeId, newIndex);
        } else {
          // Move task to a different column
          const newIndex = board.columns.find(c => c.id === overTask.columnId)!.tasks.findIndex(t => t.id === overId);
          moveTask(board.id, activeTask.columnId, overTask.columnId, activeId, newIndex);
        }
      }
    } else {
      // Reorder columns functionality can be added later
      console.log('Column reordering not implemented yet');
    }
  };

  const handleCreateColumn = () => {
    const title = prompt('Enter column title:');
    if (title) {
      createColumn(board.id, title);
    }
  };

  const handleEditColumn = (columnId: string) => {
    const column = board.columns.find(c => c.id === columnId);
    if (column) {
      const newTitle = prompt('Enter new column title:', column.title);
      if (newTitle) {
        editColumn(board.id, columnId, newTitle);
      }
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      deleteColumn(board.id, columnId);
    }
  };

  const handleCreateTask = (columnId: string) => {
    const title = prompt('Enter task title:');
    if (title) {
      const description = prompt('Enter task description:') || '';
      const createdBy = prompt('Enter your name:') || 'User';
      const priority = prompt('Enter priority (high, medium, low):', 'medium') as Priority;
      const dueDate = prompt('Enter due date (YYYY-MM-DD):') || '';
      createTask(board.id, columnId, title, description, createdBy, priority, dueDate);
    }
  };

  const handleEditTask = (task: Task) => {
    const newTitle = prompt('Enter new task title:', task.title);
    if (newTitle) {
      const newDescription = prompt('Enter new task description:', task.description) || '';
      const newPriority = prompt('Enter new priority (high, medium, low):', task.priority) as Priority;
      const newDueDate = prompt('Enter new due date (YYYY-MM-DD):', task.dueDate) || '';
      editTask(board.id, task.columnId, task.id, newTitle, newDescription, newPriority, newDueDate);
    }
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(board.id, columnId, taskId);
    }
  };

  const filteredTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      const searchMatch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const priorityMatch = filterPriority ? task.priority === filterPriority : true;
      const dueDateMatch = filterDueDate ? task.dueDate === filterDueDate : true;
      return searchMatch && priorityMatch && dueDateMatch;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
          className="border p-2"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={filterDueDate}
          onChange={(e) => setFilterDueDate(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleCreateColumn} className="bg-blue-500 text-white p-2 rounded">
          Add Column
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex">
            {board.columns.map(column => (
              <Column
                key={column.id}
                column={column}
                tasks={filteredTasks(column.tasks)}
                onAddTask={() => handleCreateTask(column.id)}
                onEditColumn={() => handleEditColumn(column.id)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={(taskId) => handleDeleteTask(column.id, taskId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BoardDetailPage;
