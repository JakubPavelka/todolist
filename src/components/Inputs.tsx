import "./Inputs.css";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useRef } from "react";
import { addTodo, existingTodoReducer } from "../store/features/todoSlice";
import SubmittedTodo from "./SubmittedTodo";
import { creatingTodoReducer } from "../store/features/todoSlice";

const Inputs = () => {
  const dispatch = useAppDispatch();

  const creatingTodo = useAppSelector((state) => state.todo.creatingTodo);
  const todoNameRef = useRef<HTMLInputElement>(null);
  const todoDateRef = useRef<HTMLInputElement>(null);
  const todoDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredName = todoNameRef.current!.value;
    const enteredDate = todoDateRef.current!.value;
    const enteredDesc = todoDescriptionRef.current!.value;

    if (enteredName.trim().length === 0) {
      console.log("Problem with inputs");
      return;
    }

    dispatch(
      addTodo({
        todo: enteredName,
        description: enteredDesc,
        date: enteredDate,
      })
    );

    dispatch(creatingTodoReducer());
    dispatch(existingTodoReducer());
  };

  return (
    <>
      {creatingTodo ? (
        <form className="inputs" onSubmit={submitHandler}>
          <h2>Add new todo</h2>
          <div className="inputs-name-date">
            <div className="inputs-label">
              <label htmlFor="name-input">Todo name</label>
              <input
                className="name-input"
                name="name-input"
                id="name-input"
                ref={todoNameRef}
                required
              />
            </div>
            <div className="inputs-label">
              <label htmlFor="date-input">Todo date</label>
              <input
                className="date-input"
                type="date"
                name="date-input"
                id="date-input"
                ref={todoDateRef}
                required
              />
            </div>
          </div>
          <div className="inputs-label-full">
            <label htmlFor="additional-text">Description</label>
            <textarea
              name="additional-text"
              id="additional-text"
              ref={todoDescriptionRef}
              spellCheck={false}
            ></textarea>
          </div>

          <div className="inputs-buttons">
            <Button type="submit">Submit</Button>
            <Button type="reset">Reset</Button>
          </div>
        </form>
      ) : (
        <SubmittedTodo />
      )}
    </>
  );
};

export default Inputs;
