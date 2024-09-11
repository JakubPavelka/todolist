import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Todo from "../../components/Todo";

const generateUniqueId = () =>
  `todo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const todosLoc =
  localStorage.getItem("todosLocal") === null
    ? []
    : JSON.parse(localStorage.getItem("todosLocal") as string);
const deletedLoc =
  localStorage.getItem("deletedLocal") === null
    ? []
    : JSON.parse(localStorage.getItem("deletedLocal") as string);
const completedLoc =
  localStorage.getItem("completedLocal") === null
    ? []
    : JSON.parse(localStorage.getItem("completedLocal") as string);

type idTodo = {
  id: string;
  todo: string;
};

export interface Todo extends idTodo {
  description?: string;
  date: string;
}
interface TodoDeleted extends idTodo {}
interface TodoCompleted extends idTodo {}

interface TodoState {
  todos: Todo[];
  deleted: TodoDeleted[];
  completed: TodoCompleted[];
  filter: "all" | "completed" | "deleted";
  taskToEdit: Todo | null;
  existingTodo: boolean;
  creatingTodo: boolean;
  sidebarOpen: boolean;
}

type ValidLists = Omit<
  TodoState,
  "filter" | "taskToEdit" | "existingTodo" | "creatingTodo" | "sidebarOpen"
>;

const initialState: TodoState = {
  todos: todosLoc,
  deleted: deletedLoc,
  completed: completedLoc,
  filter: "all",
  taskToEdit: null,
  existingTodo: todosLoc.length > 0,
  creatingTodo: todosLoc.length === 0,
  sidebarOpen: true,
};

const setAllTodosStatesLocal = (
  todos: Todo[],
  deleted: TodoDeleted[],
  completed: TodoCompleted[]
) => {
  localStorage.setItem("todosLocal", JSON.stringify(todos));
  localStorage.setItem("deletedLocal", JSON.stringify(deleted));
  localStorage.setItem("completedLocal", JSON.stringify(completed));
};

export const TodoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{
        todo: string;
        description?: string;
        date: string;
      }>
    ) => {
      state.todos.push({
        id: generateUniqueId(),
        todo: action.payload.todo,
        description: action.payload.description,
        date: action.payload.date,
      });

      state.creatingTodo = false;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    setTaskToEdit: (state, action: PayloadAction<{ id: string }>) => {
      const task = state.todos.find((task) => task.id === action.payload.id);
      if (task) {
        state.taskToEdit = task;
      }

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    clearTaskToEdit: (state) => {
      state.taskToEdit = null;

      state.creatingTodo = false;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    updateTodo: (
      state,
      action: PayloadAction<{
        id: string;
        todo: string;
        description?: string;
        date: string;
      }>
    ) => {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index !== -1) {
        state.todos[index] = {
          ...state.todos[index],
          todo: action.payload.todo,
          description: action.payload.description,
          date: action.payload.date,
        };
      }
      state.taskToEdit = null;

      state.creatingTodo = false;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    completedTodo: (state, action: PayloadAction<{ id: string }>) => {
      const todoToComplete = state.todos.find(
        (todo) => todo.id === action.payload.id
      );

      if (todoToComplete) {
        state.completed.push(todoToComplete);

        state.todos = state.todos.filter(
          (todo) => todo.id !== action.payload.id
        );
      }

      if (state.todos.length === 0) {
        state.creatingTodo = true;
      }

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    removeTodo: (state, action: PayloadAction<{ id: string }>) => {
      const todoToRemove = state.todos.find(
        (todo) => todo.id === action.payload.id
      );

      if (todoToRemove) {
        state.deleted.push(todoToRemove);

        state.todos = state.todos.filter(
          (todo) => todo.id !== action.payload.id
        );
      }

      if (state.todos.length === 0) {
        state.creatingTodo = true;
      }

      state.creatingTodo = state.todos.length === 0;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    removeTodoDeleted: (state, action: PayloadAction<{ id: string }>) => {
      const todoToRemoveDeleted = state.deleted.find(
        (todo) => todo.id === action.payload.id
      );

      if (todoToRemoveDeleted) {
        state.deleted = state.deleted.filter(
          (todo) => todo.id !== action.payload.id
        );
      }

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    removeTodoCompleted: (state, action: PayloadAction<{ id: string }>) => {
      const todoToRemoveCompleted = state.completed.find(
        (todo) => todo.id === action.payload.id
      );

      if (todoToRemoveCompleted) {
        state.completed = state.completed.filter(
          (todo) => todo.id !== action.payload.id
        );
      }

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    removeAllFrom: (
      state,
      action: PayloadAction<{ from: keyof ValidLists }>
    ) => {
      const sourceList = state[action.payload.from];

      if (action.payload.from === "todos") {
        state.deleted.push(...sourceList);
      }

      if (state.todos.length !== 0) {
        state.creatingTodo = true;
      }

      state[action.payload.from] = [];

      state.creatingTodo = state.todos.length === 0;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    moveTodoBack: (
      state,
      action: PayloadAction<{ id: string; from: keyof TodoState }>
    ) => {
      let todoToMove: Todo | undefined;

      if (state.todos.length === 0) {
        state.creatingTodo = false;
      }

      if (action.payload.from === "deleted") {
        todoToMove = state.deleted.find(
          (todo) => todo.id === action.payload.id
        ) as Todo;
        if (todoToMove) {
          state.deleted = state.deleted.filter(
            (todo) => todo.id !== action.payload.id
          );
          state.todos.push(todoToMove);
          setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
        }
      } else if (action.payload.from === "completed") {
        todoToMove = state.completed.find(
          (todo) => todo.id === action.payload.id
        ) as Todo;
        if (todoToMove) {
          state.completed = state.completed.filter(
            (todo) => todo.id !== action.payload.id
          );
          state.todos.push(todoToMove);
          setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
        }
      }
    },
    setFilter: (
      state,
      action: PayloadAction<"all" | "completed" | "deleted">
    ) => {
      state.filter = action.payload;

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    existingTodoReducer: (state) => {
      if (state.todos.length >= 1) {
        state.existingTodo = true;
      }

      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    creatingTodoReducer: (state) => {
      state.creatingTodo = false;
      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    creatingTodoReducerT: (state) => {
      state.creatingTodo = true;
      setAllTodosStatesLocal(state.todos, state.deleted, state.completed);
    },
    sidebarReducer: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    sidebarClose: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export default TodoSlice.reducer;
export const {
  removeTodo,
  addTodo,
  completedTodo,
  removeAllFrom,
  removeTodoDeleted,
  removeTodoCompleted,
  moveTodoBack,
  setFilter,
  updateTodo,
  setTaskToEdit,
  clearTaskToEdit,
  existingTodoReducer,
  creatingTodoReducer,
  creatingTodoReducerT,
  sidebarReducer,
  sidebarClose,
} = TodoSlice.actions;
