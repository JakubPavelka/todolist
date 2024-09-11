import Inputs from "./Inputs";
import "./Todo.css";
import { useAppSelector } from "../store/store";
import EditInputs from "./EditInputs";

const Todo: React.FC = () => {
  const todoState = useAppSelector((state) => state.todo);
  const creatingTodo = useAppSelector((state) => state.todo.creatingTodo);

  return (
    <main id="todo">
      <div
        className={`todo-block${
          todoState.todos.length > 0 && !creatingTodo ? "-list" : ""
        }`}
      >
        {todoState.taskToEdit ? <EditInputs /> : <Inputs />}
      </div>
    </main>
  );
};

export default Todo;
