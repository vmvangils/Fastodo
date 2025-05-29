
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder as FolderType } from '@/types/types';
import { Folder as FolderIcon, Edit, Trash } from 'lucide-react';
import { useTodo } from '@/context/TodoContext';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FolderProps {
  folder: FolderType;
  isActive: boolean;
  onClick: () => void;
}

const FolderItem = ({ folder, isActive, onClick }: FolderProps) => {
  const { updateFolder, deleteFolder } = useTodo();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);
  
  const handleDelete = () => {
    deleteFolder(folder.id);
    setDeleteDialogOpen(false);
  };
  
  const handleEdit = () => {
    updateFolder(folder.id, folderName);
    setEditDialogOpen(false);
  };
  
  // Don't allow deleting the default folder
  const canDelete = folder.id !== 'default';
  
  return (
    <>
      <Card 
        className={`flex items-center justify-between p-2 mb-1 cursor-pointer transition-colors ${
          isActive ? 'bg-secondary' : 'bg-card hover:bg-secondary/50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <FolderIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              setEditDialogOpen(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          {canDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash className="h-3 w-3" />
            </Button>
          )}
        </div>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the folder "{folder.name}" and move all its tasks to the default folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!folderName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FolderItem;
