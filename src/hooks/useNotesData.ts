
import { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import { Note } from '@/types/types';

export const useNotesData = (folderId?: string) => {
  const { notes, getNotesByFolder } = useNotes();
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title' | null>(null);
  
  let filteredNotes = folderId ? getNotesByFolder(folderId) : notes;
  
  // Apply sorting
  if (sortBy) {
    filteredNotes = [...filteredNotes].sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
  
  return {
    filteredNotes,
    sortBy,
    setSortBy
  };
};
