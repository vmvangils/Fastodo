import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import NotesList from '@/components/NotesList';
import NoteModal from '@/components/NoteModal';
import FolderItem from '@/components/Folder';
import ThemeToggle from '@/components/ThemeToggle';
import ColorSchemeProgress from '@/components/ColorSchemeProgress';
import MobileNav from '@/components/MobileNav';
import { useTodoData } from '@/hooks/useTodoData';
import { useNotesData } from '@/hooks/useNotesData';
import { useTodo } from '@/context/TodoContext';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { 
  Plus, 
  FolderPlus,
  SunMoon, 
  LogOut,
  ArrowDownUp,
  FileText,
  CheckSquare,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

const TodoApp = () => {
  const { addFolder, loading: todoLoading } = useTodo();
  const { loading: notesLoading } = useNotes();
  const { user, signOut } = useAuth();
  const [selectedFolder, setSelectedFolder] = useState<string>('default');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');
  
  const { 
    filteredTasks, 
    folders, 
    sortBy: taskSortBy, 
    setSortBy: setTaskSortBy,
    filterCompleted, 
    setFilterCompleted 
  } = useTodoData(selectedFolder);

  const {
    filteredNotes,
    sortBy: noteSortBy,
    setSortBy: setNoteSortBy
  } = useNotesData(selectedFolder);
  
  // Filter tasks/notes based on search query
  const searchedTasks = searchQuery
    ? filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTasks;

  const searchedNotes = searchQuery
    ? filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredNotes;
  
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
      <header className="border-b py-3 md:py-5 px-4 md:px-8 sticky top-0 bg-background z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <MobileNav 
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              filterCompleted={filterCompleted}
              setFilterCompleted={setFilterCompleted}
              onAddTask={() => setTaskModalOpen(true)}
              onAddNote={() => setNoteModalOpen(true)}
              activeTab={activeTab}
            />
            <SunMoon className="h-6 md:h-7 w-6 md:w-7 text-primary mr-2 md:mr-3" />
            <h1 className="font-handwriting text-2xl md:text-4xl">Fastodo</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            {user && (
              <div className="text-xs md:text-sm mr-1 md:mr-3 hidden sm:block">
                {user.email}
              </div>
            )}
            <div className="font-handwriting text-lg md:text-2xl mr-1 md:mr-3">
              {format(today, 'MMM d')}
            </div>
            <ThemeToggle />
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={signOut} 
                title="Sign out"
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-4 md:gap-8 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-handwriting text-2xl">Folders</h2>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-9 w-9 p-0"
              onClick={() => setFolderModalOpen(true)}
            >
              <FolderPlus className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[350px] overflow-auto pr-2">
            {folders.map((folder) => (
              <FolderItem 
                key={folder.id} 
                folder={folder} 
                isActive={selectedFolder === folder.id}
                onClick={() => setSelectedFolder(folder.id)}
              />
            ))}
          </div>
          
          <Separator className="my-5" />
          
          <ColorSchemeProgress folderId={selectedFolder} />
          
          <Separator className="my-5" />
          
          <div className="space-y-3">
            <h2 className="font-handwriting text-2xl">Filter</h2>
            <Card className="p-4">
              <div className="space-y-3">
                <Button 
                  variant={filterCompleted === null ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-base py-5"
                  onClick={() => setFilterCompleted(null)}
                >
                  All
                </Button>
                <Button 
                  variant={filterCompleted === false ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-base py-5"
                  onClick={() => setFilterCompleted(false)}
                >
                  Active
                </Button>
                <Button 
                  variant={filterCompleted === true ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-base py-5"
                  onClick={() => setFilterCompleted(true)}
                >
                  Completed
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow space-y-4 md:space-y-6 min-h-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
            <div>
              <h1 className="font-handwriting text-2xl md:text-4xl">
                {currentFolder ? currentFolder.name : 'Tasks'}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                What's your plan for today?
              </p>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto">
              <Input 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full sm:w-auto text-sm md:text-base py-4 md:py-6"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title="Sort" className="h-10 w-10 md:h-12 md:w-12">
                    <ArrowDownUp className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {activeTab === 'tasks' ? (
                    <>
                      <DropdownMenuItem 
                        onClick={() => setTaskSortBy(null)}
                        className={!taskSortBy ? "bg-accent" : ""}
                      >
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTaskSortBy('dueDate')}
                        className={taskSortBy === 'dueDate' ? "bg-accent" : ""}
                      >
                        By Date
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTaskSortBy('priority')}
                        className={taskSortBy === 'priority' ? "bg-accent" : ""}
                      >
                        By Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTaskSortBy('title')}
                        className={taskSortBy === 'title' ? "bg-accent" : ""}
                      >
                        By Name
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem 
                        onClick={() => setNoteSortBy(null)}
                        className={!noteSortBy ? "bg-accent" : ""}
                      >
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setNoteSortBy('updated')}
                        className={noteSortBy === 'updated' ? "bg-accent" : ""}
                      >
                        By Updated
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setNoteSortBy('created')}
                        className={noteSortBy === 'created' ? "bg-accent" : ""}
                      >
                        By Created
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setNoteSortBy('title')}
                        className={noteSortBy === 'title' ? "bg-accent" : ""}
                      >
                        By Name
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tasks' | 'notes')}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <TabsList className="grid w-full sm:w-fit grid-cols-2">
                <TabsTrigger value="tasks" className="flex items-center gap-2 text-xs md:text-sm">
                  <CheckSquare className="h-3 w-3 md:h-4 md:w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2 text-xs md:text-sm">
                  <FileText className="h-3 w-3 md:h-4 md:w-4" />
                  Notes
                </TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={() => activeTab === 'tasks' ? setTaskModalOpen(true) : setNoteModalOpen(true)}
                className="text-sm md:text-base py-4 md:py-6 px-4 md:px-6 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Add {activeTab === 'tasks' ? 'Task' : 'Note'}
              </Button>
            </div>
            
            <TabsContent value="tasks" className="mt-4 md:mt-6 flex-grow">
              <div className="bg-card rounded-lg p-3 md:p-6 shadow-sm h-full">
                {todoLoading ? (
                  <div className="text-center py-10 text-muted-foreground">
                    Loading your tasks...
                  </div>
                ) : (
                  <TaskList tasks={searchedTasks} />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4 md:mt-6 flex-grow">
              <div className="bg-card rounded-lg p-3 md:p-6 shadow-sm h-full">
                {notesLoading ? (
                  <div className="text-center py-10 text-muted-foreground">
                    Loading your notes...
                  </div>
                ) : (
                  <NotesList notes={searchedNotes} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Add Task Modal */}
      {taskModalOpen && (
        <TaskModal 
          isOpen={taskModalOpen} 
          onClose={() => setTaskModalOpen(false)} 
        />
      )}
      
      {/* Add Note Modal */}
      {noteModalOpen && (
        <NoteModal 
          isOpen={noteModalOpen} 
          onClose={() => setNoteModalOpen(false)}
          defaultFolderId={selectedFolder}
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
      
      <KeyboardShortcuts />
      
      <footer className="border-t py-3 md:py-4 px-4 md:px-8">
        <div className="container mx-auto text-center text-xs md:text-sm text-muted-foreground">
          <p>Fastodo - made by Vasco van Gils</p>
        </div>
      </footer>
    </div>
  );
};

export default TodoApp;
