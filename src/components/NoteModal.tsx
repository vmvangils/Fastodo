
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Note } from '@/types/types';
import { useNotes } from '@/context/NotesContext';
import { useTodo } from '@/context/TodoContext';
import EnhancedTextEditor from './EnhancedTextEditor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
  defaultFolderId?: string;
}

const NoteModal = ({ isOpen, onClose, note, defaultFolderId }: NoteModalProps) => {
  const { addNote, updateNote } = useNotes();
  const { folders } = useTodo();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState(defaultFolderId || folders[0]?.id || '');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setFolderId(note.folderId);
    } else {
      setTitle('');
      setContent('');
      setFolderId(defaultFolderId || folders[0]?.id || '');
    }
  }, [note, defaultFolderId, folders]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const noteData = {
      title,
      content,
      folderId,
    };

    if (note) {
      await updateNote(note.id, noteData);
    } else {
      await addNote(noteData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create New Note'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
          </div>

          <div>
            <Label htmlFor="folder">Folder</Label>
            <Select value={folderId} onValueChange={setFolderId}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <EnhancedTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your note content here... Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, or use the toolbar buttons."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {note ? 'Update Note' : 'Create Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
