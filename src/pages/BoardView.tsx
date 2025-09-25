import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';
import ConfirmModal from '../components/ConfirmModal';

const BoardView: React.FC = () => {
  const context = useContext(BoardContext);
  const [newBoardName, setNewBoardName] = useState('');
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

  if (!context) {
    return <div>Loading...</div>;
  }

  const { boards, createBoard, deleteBoard } = context;

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  const handleDeleteBoard = (boardId: string, boardName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Board',
      message: `Are you sure you want to delete the board "${boardName}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteBoard(boardId);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  return (
    <div className="p-2 sm:p-4 bg-light-yellow min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-olive-green">Task Boards</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="border p-2 flex-1"
          placeholder="New board name"
        />
        <button onClick={handleCreateBoard} className="bg-dark-yellow text-white p-2 rounded">
          Create Board
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {boards.map((board) => (
          <div key={board.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-olive-green">{board.name}</h3>
              <div className="flex gap-2">
                <Link 
                  to={`/board/${board.id}`} 
                  className="bg-dark-yellow text-white px-3 py-1 rounded text-sm"
                >
                  View
                </Link>
                <button 
                  onClick={() => handleDeleteBoard(board.id, board.name)}
                  className="bg-dark-red text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-dark-yellow">
              <th className="border p-2 text-left text-white">Board Name</th>
              <th className="border p-2 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.id}>
                <td className="border p-2">{board.name}</td>
                <td className="border p-2">
                  <Link to={`/board/${board.id}`} className="text-dark-yellow mr-4">
                    View
                  </Link>
                  <button 
                    onClick={() => handleDeleteBoard(board.id, board.name)}
                    className="text-dark-red hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
    </div>
  );
};

export default BoardView;
