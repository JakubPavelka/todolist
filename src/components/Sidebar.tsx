import "./Sidebar.css";
import {
  BsArrowBarLeft,
  BsCheckLg,
  BsXLg,
  BsArrowClockwise,
} from "react-icons/bs";
import React, { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../store/store";
import {
  removeTodo,
  completedTodo,
  removeAllFrom,
  removeTodoDeleted,
  removeTodoCompleted,
  moveTodoBack,
  setTaskToEdit,
  setFilter,
  Todo,
  creatingTodoReducerT,
  sidebarReducer,
  sidebarClose,
} from "../store/features/todoSlice";
import SidebarDownBtns from "./SidebarDownBtns";
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd.MM.yyyy");
};

const Sidebar: React.FC = () => {
  const todoState = useAppSelector((state) => state.todo.todos);
  const todoDeletedState = useAppSelector((state) => state.todo.deleted);
  const todoCompletedState = useAppSelector((state) => state.todo.completed);
  const filter = useAppSelector((state) => state.todo.filter);
  const sidebarOpen = useAppSelector((state) => state.todo.sidebarOpen);
  const dispatch = useAppDispatch();

  const toggleSidebar = useCallback((): void => {
    dispatch(sidebarReducer());
  }, []);

  const sidebarStyles = !sidebarOpen ? "closed" : "";

  const filteredTodos = useCallback(() => {
    switch (filter) {
      case "deleted":
        return todoDeletedState;
      case "completed":
        return todoCompletedState;
      case "all":
      default:
        return todoState;
    }
  }, [filter, todoState, todoDeletedState, todoCompletedState]);

  const showDeleteAllButton = useCallback(() => {
    if (filter === "all" && todoState.length > 0) {
      return (
        <p
          className="delete-all-btn"
          onClick={() => {
            dispatch(removeAllFrom({ from: "todos" }));
          }}
        >
          delete all
        </p>
      );
    } else if (filter === "deleted" && todoDeletedState.length > 0) {
      return (
        <p
          className="delete-all-btn"
          onClick={() => dispatch(removeAllFrom({ from: "deleted" }))}
        >
          delete all
        </p>
      );
    } else if (filter === "completed" && todoCompletedState.length > 0) {
      return (
        <p
          className="delete-all-btn"
          onClick={() => dispatch(removeAllFrom({ from: "completed" }))}
        >
          delete all
        </p>
      );
    }
    return null;
  }, [filter, todoState, todoDeletedState, todoCompletedState, dispatch]);

  const removeTodos = useCallback(
    (id: string) => {
      if (filter === "all") {
        return <BsXLg onClick={() => dispatch(removeTodo({ id }))} />;
      } else if (filter === "deleted") {
        return <BsXLg onClick={() => dispatch(removeTodoDeleted({ id }))} />;
      } else if (filter === "completed") {
        return <BsXLg onClick={() => dispatch(removeTodoCompleted({ id }))} />;
      }
      return null;
    },
    [filter, dispatch]
  );

  const moveBackTodo = useCallback(
    (id: string) => {
      if (filter === "deleted") {
        dispatch(moveTodoBack({ id, from: "deleted" }));
      } else if (filter === "completed") {
        dispatch(moveTodoBack({ id, from: "completed" }));
      }
    },
    [filter, dispatch]
  );

  const handleEdit = useCallback(
    (id: string) => {
      dispatch(setTaskToEdit({ id }));
      dispatch(creatingTodoReducerT());

      if (window.innerWidth <= 760) {
        dispatch(sidebarClose());
      }
    },
    [dispatch]
  );

  const noTodoText = (): JSX.Element => {
    if (filter === "all") {
      return <li className="notodo-text">No todos..</li>;
    } else if (filter === "completed") {
      return <li className="notodo-text">No completed todos..</li>;
    } else {
      return <li className="notodo-text">No deleted todos..</li>;
    }
  };

  return (
    <section id="sidebar" className={sidebarStyles}>
      <div className="tasks-and-icon">
        <h2 className={sidebarOpen ? "" : "hidden"}>TODO</h2>
        <BsArrowBarLeft
          className={`sidebar-arrow ${sidebarStyles} `}
          onClick={toggleSidebar}
        />
      </div>
      <div className={`closing-wrapper ${sidebarStyles}`}>
        <ul>
          {filteredTodos().length === 0
            ? noTodoText()
            : filteredTodos().map((state) => (
                <li className="sidebar-todo" key={state.id}>
                  {state.todo}
                  <div className="sidebar-edit-delete">
                    {filter === "all" && (
                      <>
                        <p onClick={() => handleEdit(state.id)}>edit</p>
                        <BsCheckLg
                          onClick={() =>
                            dispatch(completedTodo({ id: state.id }))
                          }
                        />
                      </>
                    )}
                    {filter === "deleted" || filter === "completed" ? (
                      <BsArrowClockwise
                        onClick={() => moveBackTodo(state.id)}
                      />
                    ) : null}
                    {removeTodos(state.id)}
                    {"date" in state && (
                      <p>{formatDate((state as Todo).date)}</p>
                    )}
                  </div>
                </li>
              ))}
        </ul>
        {showDeleteAllButton()}

        <SidebarDownBtns
          onFilterChange={(newFilter) => dispatch(setFilter(newFilter))}
          activeFilter={filter}
        />
      </div>
    </section>
  );
};

export default Sidebar;
