
import { useState } from 'react';
import { Task as TaskType } from '@/types/types';
import { useTodo } from '@/context/TodoContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import TaskModal from '@/components/TaskModal';
import { Edit, Trash, Archive, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface TaskItemProps {
  task: TaskType;
  onDragStart: (e: React.DragEvent, task: TaskType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetTask: TaskType) => void;
}

export const TaskItem = ({ task, onDragStart, onDragOver, onDrop }: TaskItemProps) => {
  const { toggleComplete, deleteTask, archiveTask } = useTodo();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleDeleteTask = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    await toggleComplete(task.id);
    setTimeout(() => setIsCompleting(false), 300);
  };

  const handleArchive = () => {
    archiveTask(task.id);
  };
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-todo-high';
      case 'medium':
        return 'bg-todo-medium';
      case 'low':
        return 'bg-todo-low';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <>
      <Card 
        className={cn(
          "mb-2 task-item border-l-4 transition-all duration-200 hover:shadow-md",
          task.completed ? "opacity-60 animate-fade-in" : "",
          isCompleting ? "animate-scale-in" : "",
          `border-l-todo-${task.priority}`,
          "cursor-move"
        )}
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, task)}
      >
        <CardContent className="p-3">
          <div className="flex items-start">
            <GripVertical className="h-4 w-4 text-muted-foreground mr-2 mt-1 cursor-grab" />
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            
            <div className="ml-2 flex-1">
              <div className="flex justify-between">
                <div className={cn(
                  "font-handwriting text-lg transition-all duration-200",
                  task.completed ? 'line-through animate-fade-in' : ''
                )}>
                  <span className={`priority-indicator ${getPriorityColor()}`}></span>
                  {task.title}
                </div>
                
                <div className="flex space-x-1">
                  {task.completed && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={handleArchive}
                      title="Archive task"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mt-2">
                {task.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </Badge>
                )}
                
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isEditModalOpen && (
        <TaskModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          taskToEdit={task}
        />
      )}
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
