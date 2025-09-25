import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';

const BoardView: React.FC = () => {
  const context = useContext(BoardContext);
  const [newBoardName, setNewBoardName] = useState('');

  if (!context) {
    return <div>Loading...</div>;
  }

  const { boards, createBoard } = context;

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Boards</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="New board name"
        />
        <button onClick={handleCreateBoard} className="bg-blue-500 text-white p-2 rounded">
          Create Board
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Board Name</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.id}>
              <td className="border p-2">{board.name}</td>
              <td className="border p-2">
                <Link to={`/board/${board.id}`} className="text-blue-500">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardView;
