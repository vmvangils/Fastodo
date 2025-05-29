
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const shortcuts = [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Ctrl + B', description: 'Bold text (in editor)' },
    { key: 'Ctrl + I', description: 'Italic text (in editor)' },
    { key: 'Ctrl + U', description: 'Underline text (in editor)' },
    { key: 'Escape', description: 'Close modal or shortcuts' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Press <Badge variant="outline" className="font-mono">?</Badge> anytime to show this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
