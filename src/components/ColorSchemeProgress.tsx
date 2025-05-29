
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useTodo } from '@/context/TodoContext';
import { useNotes } from '@/context/NotesContext';

interface ColorSchemeProgressProps {
  folderId: string;
}

const ColorSchemeProgress = ({ folderId }: ColorSchemeProgressProps) => {
  const { getTasksByFolder } = useTodo();
  const { notes } = useNotes();
  
  const tasks = getTasksByFolder(folderId);
  const folderNotes = notes.filter(note => note.folderId === folderId);
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getProgressColor = (progress: number) => {
    if (progress < 33) return 'bg-red-500';
    if (progress < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Progress</h3>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Tasks:</span>
          <div className="font-medium">{completedTasks}/{totalTasks}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Notes:</span>
          <div className="font-medium">{folderNotes.length}</div>
        </div>
      </div>
    </Card>
  );
};

export default ColorSchemeProgress;
