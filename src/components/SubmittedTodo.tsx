import "./SubmittedTodo.css";
import { useAppSelector, useAppDispatch } from "../store/store";
import { format } from "date-fns";
import {
  creatingTodoReducerT,
  removeAllFrom,
  setTaskToEdit,
  removeTodo,
  completedTodo,
  sidebarReducer,
} from "../store/features/todoSlice";
import { useCallback } from "react";

import { BsCheckLg, BsXLg } from "react-icons/bs";

const SubmittedTodo = () => {
  const todoState = useAppSelector((state) => state.todo.todos);
  const dispatch = useAppDispatch();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd.MM.yyyy");
  };

  const createHandle = () => {
    dispatch(creatingTodoReducerT());
  };

  const deleteAllHandle = () => {
    dispatch(removeAllFrom({ from: "todos" }));
  };

  const handleEdit = useCallback(
    (id: string) => {
      dispatch(setTaskToEdit({ id }));

      dispatch(creatingTodoReducerT());

      if (window.innerWidth <= 760) {
        dispatch(sidebarReducer());
      }
    },
    [dispatch]
  );

  const deleteTodoHandle = useCallback(
    (id: string) => {
      dispatch(removeTodo({ id }));
    },
    [dispatch]
  );

  const moveTodoHandle = useCallback(
    (id: string) => {
      dispatch(completedTodo({ id }));
    },
    [dispatch]
  );

  return (
    <section className="submitted-todo">
      <h2>Your todo list</h2>
      <div className="submitted-btns-warpper">
        <button onClick={createHandle} className="submitted-btn">
          Create new
        </button>
        <button onClick={deleteAllHandle} className="submitted-btn">
          Delete all
        </button>
      </div>
      <div>
        {todoState.map((todo) => (
          <aside className="submitted-todo-todo" key={todo.id}>
            <div className="submitted-list-flex">
              <p className="submitted-name">{todo.todo}</p>
              <p>{formatDate(todo.date)}</p>
              {todo.description && <p className="desc">{todo.description}</p>}
              <div className="icons-edit">
                <BsCheckLg
                  onClick={() => moveTodoHandle(todo.id)}
                  className="submitted-check"
                />
                <BsXLg
                  onClick={() => deleteTodoHandle(todo.id)}
                  className="submitted-cross"
                />
                <span onClick={() => handleEdit(todo.id)}>Edit</span>
              </div>
            </div>
          </aside>
        ))}
      </div>
    </section>
  );
};

export default SubmittedTodo;
