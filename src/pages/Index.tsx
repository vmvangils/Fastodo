
import { TodoProvider } from "@/context/TodoContext";
import { NotesProvider } from "@/context/NotesContext";
import TodoApp from "@/components/TodoApp";

const Index = () => {
  return (
    <TodoProvider>
      <NotesProvider>
        <TodoApp />
      </NotesProvider>
    </TodoProvider>
  );
};

export default Index;
