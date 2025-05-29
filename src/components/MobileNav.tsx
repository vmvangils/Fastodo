
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Plus } from 'lucide-react';
import FolderItem from '@/components/Folder';
import { useTodo } from '@/context/TodoContext';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface MobileNavProps {
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
  filterCompleted: boolean | null;
  setFilterCompleted: (filter: boolean | null) => void;
  onAddTask: () => void;
  onAddNote: () => void;
  activeTab: 'tasks' | 'notes';
}

const MobileNav = ({ 
  selectedFolder, 
  setSelectedFolder, 
  filterCompleted, 
  setFilterCompleted,
  onAddTask,
  onAddNote,
  activeTab
}: MobileNavProps) => {
  const { folders } = useTodo();
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 pr-4">
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-handwriting text-2xl">Folders</h2>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-auto">
            {folders.map((folder) => (
              <div key={folder.id} onClick={() => setOpen(false)}>
                <FolderItem 
                  folder={folder} 
                  isActive={selectedFolder === folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                />
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-handwriting text-xl">Filter</h3>
            <Card className="p-3">
              <div className="space-y-2">
                <Button 
                  variant={filterCompleted === null ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterCompleted(null);
                    setOpen(false);
                  }}
                >
                  All
                </Button>
                <Button 
                  variant={filterCompleted === false ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterCompleted(false);
                    setOpen(false);
                  }}
                >
                  Active
                </Button>
                <Button 
                  variant={filterCompleted === true ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setFilterCompleted(true);
                    setOpen(false);
                  }}
                >
                  Completed
                </Button>
              </div>
            </Card>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button 
              onClick={() => {
                onAddTask();
                setOpen(false);
              }}
              className="w-full"
              disabled={activeTab !== 'tasks'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button 
              onClick={() => {
                onAddNote();
                setOpen(false);
              }}
              className="w-full"
              variant="secondary"
              disabled={activeTab !== 'notes'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
