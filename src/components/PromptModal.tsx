import React, { useState } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  title,
  message,
  placeholder = '',
  defaultValue = '',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  const [value, setValue] = useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, isOpen]);

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4 text-olive-green">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border p-2 rounded mb-6"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              handleConfirm();
            }
          }}
        />
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-dark-yellow text-white rounded hover:bg-yellow-600"
            disabled={!value.trim()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;