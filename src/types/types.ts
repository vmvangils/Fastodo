
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date | null;
  priority: Priority;
  folderId: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}
