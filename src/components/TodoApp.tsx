
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import FolderItem from '@/components/Folder';
import ThemeToggle from '@/components/ThemeToggle';
import { useTodoData } from '@/hooks/useTodoData';
import { useTodo } from '@/context/TodoContext';
import { format } from 'date-fns';
import { 
  Plus, 
  FolderPlus,
  SunMoon, 
  CalendarDays,
  ArrowDownUp,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TodoApp = () => {
  const { addFolder } = useTodo();
  const [selectedFolder, setSelectedFolder] = useState<string>('default');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    filteredTasks, 
    folders, 
    sortBy, 
    setSortBy,
    filterCompleted, 
    setFilterCompleted 
  } = useTodoData(selectedFolder);
  
  // Filter tasks based on search query
  const searchedTasks = searchQuery
    ? filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTasks;
  
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName);
      setNewFolderName('');
      setFolderModalOpen(false);
    }
  };
  
  const currentFolder = folders.find(folder => folder.id === selectedFolder);
  const today = new Date();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b py-4 px-6 sticky top-0 bg-background z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <SunMoon className="h-6 w-6 text-primary mr-2" />
            <h1 className="font-handwriting text-3xl">Fastodo</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="font-handwriting text-xl mr-2">
              {format(today, 'MMM d')}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-handwriting text-xl">Folders</h2>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => setFolderModalOpen(true)}
            >
              <FolderPlus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-1 max-h-[300px] overflow-auto pr-2">
            {folders.map((folder) => (
              <FolderItem 
                key={folder.id} 
                folder={folder} 
                isActive={selectedFolder === folder.id}
                onClick={() => setSelectedFolder(folder.id)}
              />
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h2 className="font-handwriting text-xl">Filter</h2>
            <Card className="p-3">
              <div className="space-y-2">
                <Button 
                  variant={filterCompleted === null ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterCompleted(null)}
                >
                  All
                </Button>
                <Button 
                  variant={filterCompleted === false ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterCompleted(false)}
                >
                  Active
                </Button>
                <Button 
                  variant={filterCompleted === true ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterCompleted(true)}
                >
                  Completed
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-handwriting text-3xl">
                {currentFolder ? currentFolder.name : 'Tasks'}
              </h1>
              <p className="text-sm text-muted-foreground">
                What's your plan for today?
              </p>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Input 
                placeholder="Search tasks..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full sm:w-auto"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title="Sort">
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setSortBy(null)}
                    className={!sortBy ? "bg-accent" : ""}
                  >
                    Default
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('dueDate')}
                    className={sortBy === 'dueDate' ? "bg-accent" : ""}
                  >
                    By Date
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('priority')}
                    className={sortBy === 'priority' ? "bg-accent" : ""}
                  >
                    By Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('title')}
                    className={sortBy === 'title' ? "bg-accent" : ""}
                  >
                    By Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button onClick={() => setTaskModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <TaskList tasks={searchedTasks} />
          </div>
        </div>
      </main>
      
      {/* Add Task Modal */}
      {taskModalOpen && (
        <TaskModal 
          isOpen={taskModalOpen} 
          onClose={() => setTaskModalOpen(false)} 
        />
      )}
      
      {/* Add Folder Modal */}
      <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder} 
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="border-t py-4 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Fastodo • Organize your day with ease</p>
        </div>
      </footer>
    </div>
  );
};

export default TodoApp;
