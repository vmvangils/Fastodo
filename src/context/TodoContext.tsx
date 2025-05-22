
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Folder, Priority } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

interface TodoContextType {
  tasks: Task[];
  folders: Folder[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  addFolder: (name: string, color?: string) => void;
  updateFolder: (id: string, name: string, color?: string) => void;
  deleteFolder: (id: string) => void;
  getTasksByFolder: (folderId: string) => Task[];
}

const TodoContext = createContext<TodoContextType | null>(null);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Welcome to Fastodo!',
      description: 'This is your first task. Try marking it as complete!',
      completed: false,
      dueDate: new Date(),
      priority: 'medium',
      folderId: 'default',
      createdAt: new Date(),
    },
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default', name: 'My Tasks' },
    { id: 'work', name: 'Work' },
    { id: 'personal', name: 'Personal' },
  ]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addFolder = (name: string, color?: string) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      color,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const updateFolder = (id: string, name: string, color?: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name, color } : folder
      )
    );
  };

  const deleteFolder = (id: string) => {
    // Don't delete if it's the default folder
    if (id === 'default') return;
    
    // Delete the folder
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    
    // Move tasks from the deleted folder to default
    setTasks((prev) =>
      prev.map((task) =>
        task.folderId === id ? { ...task, folderId: 'default' } : task
      )
    );
  };

  const getTasksByFolder = (folderId: string) => {
    return tasks.filter((task) => task.folderId === folderId);
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        folders,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        addFolder,
        updateFolder,
        deleteFolder,
        getTasksByFolder,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
