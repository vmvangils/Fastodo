
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Highlighter } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor = ({ value, onChange, placeholder, className }: TextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  }, []);

  const restoreCursorPosition = useCallback((position: any) => {
    if (position && editorRef.current) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        
        // Check if the saved nodes still exist in the DOM
        if (editorRef.current.contains(position.startContainer) && 
            editorRef.current.contains(position.endContainer)) {
          range.setStart(position.startContainer, position.startOffset);
          range.setEnd(position.endContainer, position.endOffset);
          
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      } catch (error) {
        // If restoration fails, place cursor at the end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, []);

  const checkFormattingState = useCallback(() => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setIsBoldActive(document.queryCommandState('bold'));
        setIsItalicActive(document.queryCommandState('italic'));
      }
    }
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      checkFormattingState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [checkFormattingState]);

  const applyFormatting = useCallback((command: string, value?: string) => {
    const cursorPosition = saveCursorPosition();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      // Restore cursor position after formatting
      setTimeout(() => {
        restoreCursorPosition(cursorPosition);
        checkFormattingState();
      }, 0);
    }
  }, [onChange, checkFormattingState, saveCursorPosition, restoreCursorPosition]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyFormatting('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormatting('italic');
          break;
      }
    }
  }, [applyFormatting]);

  const handleClick = useCallback(() => {
    setTimeout(() => {
      checkFormattingState();
    }, 10);
  }, [checkFormattingState]);

  // Only update innerHTML if the content actually changed to prevent cursor jumping
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const cursorPosition = saveCursorPosition();
      editorRef.current.innerHTML = value;
      restoreCursorPosition(cursorPosition);
    }
  }, [value, saveCursorPosition, restoreCursorPosition]);

  return (
    <div className="border rounded-md">
      <div className="flex gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting('bold')}
          className={`h-8 w-8 p-0 ${isBoldActive ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting('italic')}
          className={`h-8 w-8 p-0 ${isItalicActive ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting('hiliteColor', '#ffff00')}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onKeyUp={checkFormattingState}
        className={`min-h-[120px] p-3 outline-none ${className}`}
        data-placeholder={placeholder}
        style={{ 
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'plaintext'
        }}
        suppressContentEditableWarning={true}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            direction: ltr;
            text-align: left;
          }
          [contenteditable] {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: plaintext !important;
          }
        `
      }} />
    </div>
  );
};

export default TextEditor;
