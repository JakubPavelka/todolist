import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  updateTodo,
  clearTaskToEdit,
  creatingTodoReducerT,
} from "../store/features/todoSlice";

import "./EditInputs.css";

const EditInputs = () => {
  const dispatch = useAppDispatch();
  const taskToEdit = useAppSelector((state) => state.todo.taskToEdit);
  const todoState = useAppSelector((state) => state.todo.todos);

  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      setDescription(taskToEdit.description || "");
      setDate(taskToEdit.date);
    }
  }, [taskToEdit]);

  const handleUpdate = () => {
    if (!taskToEdit) {
      return;
    }

    dispatch(
      updateTodo({
        id: taskToEdit.id,
        todo,
        description,
        date,
      })
    );

    if (todoState.length === 0) {
      dispatch(creatingTodoReducerT());
    }
  };

  const handleCancel = () => {
    dispatch(clearTaskToEdit());

    if (todoState.length === 0) {
      dispatch(creatingTodoReducerT());
    }
  };

  if (!taskToEdit) {
    return null;
  }

  return (
    <form className="inputs">
      <h2>Edit your todo</h2>
      <div className="inputs-name-date">
        <div className="inputs-label">
          <label htmlFor="name-input-edit">Todo name</label>
          <input
            type="text"
            className="name-input"
            value={todo}
            id="name-input-edit"
            name="name-input-edit"
            onChange={(e) => setTodo(e.target.value)}
          />
        </div>
        <div className="inputs-label">
          <label htmlFor="date-edit">Date</label>
          <input
            type="date"
            className="date-input"
            id="date-edit"
            name="date-edit"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="inputs-label-full">
        <label htmlFor="description-edit">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description-edit"
          name="description-edit"
          spellCheck={false}
        />
      </div>
      <div className="inputs-buttons">
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditInputs;
