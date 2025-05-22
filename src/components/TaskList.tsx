
import { useState } from 'react';
import { Task as TaskType } from '@/types/types';
import { useTodo } from '@/context/TodoContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import TaskModal from '@/components/TaskModal';
import { Edit, Trash } from 'lucide-react';
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

interface TaskProps {
  task: TaskType;
}

export const Task = ({ task }: TaskProps) => {
  const { toggleComplete, deleteTask } = useTodo();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDeleteTask = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
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
      <Card className={cn(
        "mb-2 task-item border-l-4",
        task.completed ? "opacity-60" : "",
        `border-l-todo-${task.priority}`
      )}>
        <CardContent className="p-3">
          <div className="flex items-start">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => toggleComplete(task.id)}
              className="mt-1"
            />
            
            <div className="ml-2 flex-1">
              <div className="flex justify-between">
                <div className={`font-handwriting text-lg ${task.completed ? 'line-through' : ''}`}>
                  <span className={`priority-indicator ${getPriorityColor()}`}></span>
                  {task.title}
                </div>
                
                <div className="flex space-x-1">
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
                  className={`text-xs ${task.priority === 'high' ? 'animate-pulse' : ''}`}
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

interface TaskListProps {
  tasks: TaskType[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-handwriting text-lg">
        No tasks found. Add a task to get started!
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
