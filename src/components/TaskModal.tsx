import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, createdBy: string, priority: Priority, dueDate: string) => void;
  task?: Task;
  title: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, title }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  // Update form when task changes
  React.useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setDescription(task.description);
      setCreatedBy(task.createdBy);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    } else {
      // Reset form for new task
      setTaskTitle('');
      setDescription('');
      setCreatedBy('');
      setPriority('medium');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onSave(taskTitle.trim(), description.trim(), createdBy.trim() || task?.createdBy || 'User', priority, dueDate);
      onClose();
      // Reset form
      setTaskTitle('');
      setDescription('');
      setCreatedBy('');
      setPriority('medium');
      setDueDate('');
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setTaskTitle('');
    setDescription('');
    setCreatedBy('');
    setPriority('medium');
    setDueDate('');
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4 text-olive-green">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded h-20"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Created By</label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Your name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border p-2 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dark-yellow text-white rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;