import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';
import { Board, Task, Priority } from '../types';

const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(BoardContext);
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterDueDate, setFilterDueDate] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentColumnId, setCurrentColumnId] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    defaultValue: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    defaultValue: '',
    onConfirm: () => {}
  });

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
    setPromptModal({
      isOpen: true,
      title: 'Create Column',
      message: 'Enter column title:',
      defaultValue: '',
      onConfirm: (title: string) => {
        if (title.trim()) {
          createColumn(board.id, title.trim());
        }
        setPromptModal({ ...promptModal, isOpen: false });
      }
    });
  };

  const handleEditColumn = (columnId: string) => {
    const column = board.columns.find(c => c.id === columnId);
    if (column) {
      setPromptModal({
        isOpen: true,
        title: 'Edit Column',
        message: 'Enter new column title:',
        defaultValue: column.title,
        onConfirm: (newTitle: string) => {
          if (newTitle.trim()) {
            editColumn(board.id, columnId, newTitle.trim());
          }
          setPromptModal({ ...promptModal, isOpen: false });
        }
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = board.columns.find(c => c.id === columnId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Column',
      message: `Are you sure you want to delete the column "${column?.title}"? All tasks in this column will be lost.`,
      onConfirm: () => {
        deleteColumn(board.id, columnId);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleCreateTask = (columnId: string) => {
    setEditingTask(undefined);
    setCurrentColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentColumnId(task.columnId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (title: string, description: string, createdBy: string, priority: Priority, dueDate: string) => {
    if (editingTask) {
      editTask(board.id, editingTask.columnId, editingTask.id, title, description, priority, dueDate);
    } else {
      createTask(board.id, currentColumnId, title, description, createdBy, priority, dueDate);
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
    setCurrentColumnId('');
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const column = board.columns.find(c => c.id === columnId);
    const task = column?.tasks.find(t => t.id === taskId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete the task "${task?.title}"?`,
      onConfirm: () => {
        deleteTask(board.id, columnId, taskId);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
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
    <div className="p-2 sm:p-4 bg-light-yellow min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
        <button 
          onClick={() => navigate('/')}
          className="bg-olive-green text-white px-3 py-2 rounded text-sm hover:bg-green-600 self-start"
        >
          ← Back to Boards
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-olive-green truncate">{board.name}</h1>
      </div>
      
      {/* Mobile Filters */}
      <div className="mb-4 block sm:hidden space-y-2">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
            className="border p-2 flex-1"
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
            min={new Date().toISOString().split('T')[0]}
            className="border p-2 flex-1"
          />
        </div>
        <button onClick={handleCreateColumn} className="bg-dark-yellow text-white p-2 rounded w-full">
          Add Column
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="mb-4 hidden sm:flex sm:space-x-4">
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
          min={new Date().toISOString().split('T')[0]}
          className="border p-2"
        />
        <button onClick={handleCreateColumn} className="bg-dark-yellow text-white p-2 rounded">
          Add Column
        </button>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
          {/* Mobile: Stacked columns */}
          <div className="block sm:hidden space-y-4">
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
          
          {/* Desktop: Horizontal columns */}
          <div className="hidden sm:flex overflow-x-auto pb-4 gap-4">
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
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="bg-dark-red"
      />
      
      <PromptModal
        isOpen={promptModal.isOpen}
        title={promptModal.title}
        message={promptModal.message}
        defaultValue={promptModal.defaultValue}
        onConfirm={promptModal.onConfirm}
        onCancel={() => setPromptModal({ ...promptModal, isOpen: false })}
      />
    </div>
  );
};

export default BoardDetailPage;
