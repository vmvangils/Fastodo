
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Note } from '@/types/types';
import { useNotes } from '@/context/NotesContext';
import { Edit, Trash, FileText } from 'lucide-react';
import { format } from 'date-fns';
import NoteModal from './NoteModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotesListProps {
  notes: Note[];
}

const NotesList = ({ notes }: NotesListProps) => {
  const { deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const handleDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg">No notes yet</p>
        <p className="text-sm">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => {
          return (
            <Card key={note.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold flex-1 truncate font-handwriting">
                  {note.title}
                </h3>
                
                <div className="flex space-x-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setEditingNote(note)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setNoteToDelete(note);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {note.content && (
                <div 
                  className="text-sm text-muted-foreground mb-3 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                  style={{ maxHeight: '4.5em', overflow: 'hidden' }}
                />
              )}
              
              <div className="text-xs text-muted-foreground">
                Updated {format(note.updatedAt, 'MMM d, yyyy')}
              </div>
            </Card>
          );
        })}
      </div>

      {editingNote && (
        <NoteModal
          isOpen={true}
          onClose={() => setEditingNote(null)}
          note={editingNote}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotesList;
