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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-olive-green">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border p-2 rounded text-base"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded h-20 resize-none text-base"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Created By</label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="w-full border p-2 rounded text-base"
              placeholder="Your name"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border p-2 rounded text-base"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
                className="w-full border p-2 rounded text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-dark-yellow text-white rounded hover:bg-yellow-600 order-1 sm:order-2"
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