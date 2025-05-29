
import { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Task, Priority } from '@/types/types';

export const useTodoData = (folderId?: string) => {
  const { tasks, folders, getTasksByFolder } = useTodo();
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | null>(null);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  
  let filteredTasks = folderId ? getTasksByFolder(folderId) : tasks;
  
  if (filterCompleted !== null) {
    filteredTasks = filteredTasks.filter(task => {
      return task.completed === filterCompleted;
    });
  }
  
  if (sortBy) {
    filteredTasks = [...filteredTasks].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 0, medium: 1, low: 2 };
        return priorityWeight[a.priority as Priority] - priorityWeight[b.priority as Priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
  
  return {
    filteredTasks,
    folders,
    sortBy,
    setSortBy,
    filterCompleted,
    setFilterCompleted
  };
};
