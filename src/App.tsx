import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import BoardView from './pages/BoardView';
import BoardDetailPage from './pages/BoardDetailView';
import './App.css';

function App() {
  return (
    <BoardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/board/:id" element={<BoardDetailPage />} />
        </Routes>
      </Router>
    </BoardProvider>
  );
}

export default App;
