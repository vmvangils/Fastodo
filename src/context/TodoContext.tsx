import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, Folder, Priority } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface TodoContextType {
  tasks: Task[];
  folders: Folder[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  addFolder: (name: string, color?: string) => Promise<void>;
  updateFolder: (id: string, name: string, color?: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  getTasksByFolder: (folderId: string) => Task[];
  loading: boolean;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch data when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setFolders([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch folders
        const { data: folderData, error: folderError } = await supabase
          .from('folders')
          .select('*')
          .order('created_at', { ascending: true });

        if (folderError) throw folderError;

        // Create default folders if none exist
        if (folderData.length === 0) {
          const defaultFolders = [
            { id: 'default', name: 'My Tasks' },
            { id: 'work', name: 'Work' },
            { id: 'personal', name: 'Personal' },
          ];

          for (const folder of defaultFolders) {
            await supabase.from('folders').insert({
              name: folder.name,
              user_id: user.id,
            });
          }

          // Fetch folders again after creating defaults
          const { data: refreshedFolders } = await supabase
            .from('folders')
            .select('*')
            .order('created_at', { ascending: true });

          if (refreshedFolders) {
            setFolders(refreshedFolders.map(f => ({
              id: f.id,
              name: f.name,
              color: f.color || undefined,
            })));
          }
        } else {
          // Use fetched folders
          setFolders(folderData.map(f => ({
            id: f.id,
            name: f.name,
            color: f.color || undefined,
          })));
        }

        // Fetch tasks
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (taskError) throw taskError;

        // Create a welcome task if no tasks exist
        if (taskData.length === 0 && folders.length > 0) {
          const firstFolderId = folders[0]?.id || 'default';
          
          await supabase.from('tasks').insert({
            title: 'Welcome to Fastodo!',
            description: 'This is your first task. Try marking it as complete!',
            completed: false,
            due_date: new Date().toISOString(),
            priority: 'medium',
            folder_id: firstFolderId,
            user_id: user.id,
          });

          // Fetch tasks again after creating welcome task
          const { data: refreshedTasks } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

          if (refreshedTasks) {
            setTasks(refreshedTasks.map(t => ({
              id: t.id,
              title: t.title,
              description: t.description || '',
              completed: t.completed || false,
              dueDate: t.due_date ? new Date(t.due_date) : null,
              priority: (t.priority as Priority) || 'medium',
              folderId: t.folder_id,
              createdAt: new Date(t.created_at),
            })));
          }
        } else {
          // Use fetched tasks
          setTasks(taskData.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            completed: t.completed || false,
            dueDate: t.due_date ? new Date(t.due_date) : null,
            priority: (t.priority as Priority) || 'medium',
            folderId: t.folder_id,
            createdAt: new Date(t.created_at),
          })));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load your tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          completed: task.completed,
          due_date: task.dueDate?.toISOString(),
          priority: task.priority,
          folder_id: task.folderId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        completed: data.completed || false,
        dueDate: data.due_date ? new Date(data.due_date) : null,
        priority: (data.priority as Priority) || 'medium',
        folderId: data.folder_id,
        createdAt: new Date(data.created_at),
      };

      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task added successfully');
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    if (!user) return;

    try {
      const updates: any = {};
      if (updatedTask.title !== undefined) updates.title = updatedTask.title;
      if (updatedTask.description !== undefined) updates.description = updatedTask.description;
      if (updatedTask.completed !== undefined) updates.completed = updatedTask.completed;
      if (updatedTask.dueDate !== undefined) updates.due_date = updatedTask.dueDate?.toISOString();
      if (updatedTask.priority !== undefined) updates.priority = updatedTask.priority;
      if (updatedTask.folderId !== undefined) updates.folder_id = updatedTask.folderId;

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      );
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const toggleComplete = async (id: string) => {
    if (!user) return;

    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error: any) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const archiveTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task archived successfully');
    } catch (error: any) {
      console.error('Error archiving task:', error);
      toast.error('Failed to archive task');
    }
  };

  const reorderTasks = (fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      const [removed] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, removed);
      return newTasks;
    });
  };

  const addFolder = async (name: string, color?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name,
          color,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newFolder: Folder = {
        id: data.id,
        name: data.name,
        color: data.color || undefined,
      };

      setFolders((prev) => [...prev, newFolder]);
      toast.success('Folder created successfully');
    } catch (error: any) {
      console.error('Error adding folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const updateFolder = async (id: string, name: string, color?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('folders')
        .update({ name, color })
        .eq('id', id);

      if (error) throw error;

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === id ? { ...folder, name, color } : folder
        )
      );
      toast.success('Folder updated successfully');
    } catch (error: any) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  const deleteFolder = async (id: string) => {
    if (!user || id === 'default') return;

    try {
      // Get the default folder
      const defaultFolder = folders.find(f => f.name === 'My Tasks') || folders[0];
      
      if (!defaultFolder) {
        toast.error('Cannot delete folder: No default folder exists');
        return;
      }

      // Update tasks to move them to default folder
      const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({ folder_id: defaultFolder.id })
        .eq('folder_id', id);

      if (taskUpdateError) throw taskUpdateError;

      // Delete the folder
      const { error: folderDeleteError } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (folderDeleteError) throw folderDeleteError;

      // Update state
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
      setTasks((prev) =>
        prev.map((task) =>
          task.folderId === id ? { ...task, folderId: defaultFolder.id } : task
        )
      );
      
      toast.success('Folder deleted successfully');
    } catch (error: any) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
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
        archiveTask,
        reorderTasks,
        addFolder,
        updateFolder,
        deleteFolder,
        getTasksByFolder,
        loading,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
