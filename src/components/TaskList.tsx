
import { useState } from 'react';
import { Task as TaskType } from '@/types/types';
import { useTodo } from '@/context/TodoContext';
import { TaskItem } from './TaskItem';
import { CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks: TaskType[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const { reorderTasks } = useTodo();
  const [draggedTask, setDraggedTask] = useState<TaskType | null>(null);

  const handleDragStart = (e: React.DragEvent, task: TaskType) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTask: TaskType) => {
    e.preventDefault();
    if (draggedTask && draggedTask.id !== targetTask.id) {
      const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
      const targetIndex = tasks.findIndex(t => t.id === targetTask.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        reorderTasks(draggedIndex, targetIndex);
      }
    }
    setDraggedTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-fade-in">
        <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-handwriting">No tasks found</p>
        <p className="text-sm">Add a task to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default TaskList;
