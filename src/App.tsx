import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import BoardView from './pages/BoardView';
import BoardDetailPage from './pages/BoardDetailView';

/**
 * Main App component that sets up routing and global state management
 * 
 * The app has two main routes:
 * - "/" - Shows the list of all boards
 * - "/board/:id" - Shows the detailed view of a specific board
 * 
 * All components are wrapped with BoardProvider to access global board state
 */
function App() {
  return (
    <BoardProvider>
      <Router>
        <Routes>
          {/* Home page showing all boards */}
          <Route path="/" element={<BoardView />} />
          {/* Individual board detail page with drag-and-drop functionality */}
          <Route path="/board/:id" element={<BoardDetailPage />} />
        </Routes>
      </Router>
    </BoardProvider>
  );
}

export default App;
