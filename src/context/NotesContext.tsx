
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Note } from '@/types/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesByFolder: (folderId: string) => Note[];
  loading: boolean;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider = ({ children }: NotesProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        setNotes(data.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content || '',
          folderId: n.folder_id,
          createdAt: new Date(n.created_at),
          updatedAt: new Date(n.updated_at),
        })));
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: note.title,
          content: note.content,
          folder_id: note.folderId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        folderId: data.folder_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setNotes((prev) => [newNote, ...prev]);
      toast.success('Note created successfully');
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Failed to create note');
    }
  };

  const updateNote = async (id: string, updatedNote: Partial<Note>) => {
    if (!user) return;

    try {
      const updates: any = {};
      if (updatedNote.title !== undefined) updates.title = updatedNote.title;
      if (updatedNote.content !== undefined) updates.content = updatedNote.content;
      if (updatedNote.folderId !== undefined) updates.folder_id = updatedNote.folderId;
      updates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updatedNote, updatedAt: new Date() } : note))
      );
      toast.success('Note updated successfully');
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const getNotesByFolder = (folderId: string) => {
    return notes.filter((note) => note.folderId === folderId);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNotesByFolder,
        loading,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
