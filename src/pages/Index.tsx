
import { TodoProvider } from "@/context/TodoContext";
import TodoApp from "@/components/TodoApp";

const Index = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default Index;
