import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Board, Column, Task, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface BoardContextProps {
  boards: Board[];
  createBoard: (name: string) => void;
  deleteBoard: (id: string) => void;
  getBoard: (id: string) => Board | undefined;
  createColumn: (boardId: string, title: string) => void;
  editColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  createTask: (boardId: string, columnId: string, title: string, description: string, createdBy: string, priority: Priority, dueDate: string) => void;
  editTask: (boardId: string, columnId: string, taskId: string, title: string, description: string, priority: Priority, dueDate: string) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, sourceColumnId: string, destColumnId: string, taskId: string, newIndex: number) => void;
  reorderTask: (boardId: string, columnId: string, taskId: string, newIndex: number) => void;
  searchTasks: (boardId: string, query: string) => Task[];
  filterTasks: (boardId: string, priority?: Priority, dueDate?: string) => Task[];
}

export const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    const savedBoards = localStorage.getItem('boards');
    return savedBoards ? JSON.parse(savedBoards) : [];
  });

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  const createBoard = (name: string) => {
    const defaultColumns: Column[] = [
      {
        id: uuidv4(),
        title: 'To Do',
        tasks: [],
      },
      {
        id: uuidv4(),
        title: 'In Progress',
        tasks: [],
      },
      {
        id: uuidv4(),
        title: 'Done',
        tasks: [],
      },
    ];

    const newBoard: Board = {
      id: uuidv4(),
      name,
      columns: defaultColumns,
    };
    setBoards([...boards, newBoard]);
  };

  const deleteBoard = (id: string) => {
    setBoards(boards.filter(board => board.id !== id));
  };

  const getBoard = (id: string) => {
    return boards.find(board => board.id === id);
  };

  const createColumn = (boardId: string, title: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
      tasks: [],
    };
    const newBoards = boards.map(board =>
      board.id === boardId ? { ...board, columns: [...board.columns, newColumn] } : board
    );
    setBoards(newBoards);
  };

  const editColumn = (boardId: string, columnId: string, title: string) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(column =>
          column.id === columnId ? { ...column, title } : column
        );
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.filter(column => column.id !== columnId);
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const createTask = (boardId: string, columnId: string, title: string, description: string, createdBy: string, priority: Priority, dueDate: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      createdBy,
      priority,
      dueDate,
      columnId,
    };
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(column => {
          if (column.id === columnId) {
            return { ...column, tasks: [...column.tasks, newTask] };
          }
          return column;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const editTask = (boardId: string, columnId: string, taskId: string, title: string, description: string, priority: Priority, dueDate: string) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(column => {
          if (column.id === columnId) {
            const newTasks = column.tasks.map(task =>
              task.id === taskId ? { ...task, title, description, priority, dueDate } : task
            );
            return { ...column, tasks: newTasks };
          }
          return column;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const deleteTask = (boardId: string, columnId: string, taskId: string) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(column => {
          if (column.id === columnId) {
            const newTasks = column.tasks.filter(task => task.id !== taskId);
            return { ...column, tasks: newTasks };
          }
          return column;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const moveTask = (boardId: string, sourceColumnId: string, destColumnId: string, taskId: string, newIndex: number) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        let taskToMove: Task | undefined;
        const newColumns = board.columns.map(column => {
          if (column.id === sourceColumnId) {
            taskToMove = column.tasks.find(task => task.id === taskId);
            return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
          }
          return column;
        });

        if (taskToMove) {
          const finalColumns = newColumns.map(column => {
            if (column.id === destColumnId) {
              const newTasks = [...column.tasks];
              newTasks.splice(newIndex, 0, { ...taskToMove!, columnId: destColumnId });
              return { ...column, tasks: newTasks };
            }
            return column;
          });
          return { ...board, columns: finalColumns };
        }
      }
      return board;
    });
    setBoards(newBoards);
  };

  const reorderTask = (boardId: string, columnId: string, taskId: string, newIndex: number) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(column => {
          if (column.id === columnId) {
            const taskToMove = column.tasks.find(task => task.id === taskId);
            if (taskToMove) {
              const remainingTasks = column.tasks.filter(task => task.id !== taskId);
              const newTasks = [...remainingTasks];
              newTasks.splice(newIndex, 0, taskToMove);
              return { ...column, tasks: newTasks };
            }
          }
          return column;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const searchTasks = (boardId: string, query: string): Task[] => {
    const board = getBoard(boardId);
    if (!board) return [];
    const lowerCaseQuery = query.toLowerCase();
    return board.columns.flatMap(column =>
      column.tasks.filter(
        task =>
          task.title.toLowerCase().includes(lowerCaseQuery) ||
          task.description.toLowerCase().includes(lowerCaseQuery)
      )
    );
  };

  const filterTasks = (boardId: string, priority?: Priority, dueDate?: string): Task[] => {
    const board = getBoard(boardId);
    if (!board) return [];
    return board.columns.flatMap(column =>
      column.tasks.filter(task => {
        const priorityMatch = priority ? task.priority === priority : true;
        const dueDateMatch = dueDate ? task.dueDate === dueDate : true;
        return priorityMatch && dueDateMatch;
      })
    );
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        createBoard,
        deleteBoard,
        getBoard,
        createColumn,
        editColumn,
        deleteColumn,
        createTask,
        editTask,
        deleteTask,
        moveTask,
        reorderTask,
        searchTasks,
        filterTasks,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
