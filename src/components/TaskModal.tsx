
import { useEffect, useState } from 'react';
import { Task, Priority } from '@/types/types';
import { useTodo } from '@/context/TodoContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task;
}

const TaskModal = ({ isOpen, onClose, taskToEdit }: TaskModalProps) => {
  const { addTask, updateTask, folders } = useTodo();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [folderId, setFolderId] = useState('');
  
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setFolderId(taskToEdit.folderId);
    } else {
      // Default values for new task
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority('medium');
      setFolderId(folders[0]?.id || '');
    }
  }, [taskToEdit, folders]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      folderId: folderId || folders[0]?.id || '',
      completed: taskToEdit?.completed || false,
    };
    
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-2xl">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate || undefined}
                    onSelect={setDueDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Select
                value={folderId}
                onValueChange={setFolderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-todo-low mr-2"></div>
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-todo-medium mr-2"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-todo-high mr-2"></div>
                    High
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {taskToEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
