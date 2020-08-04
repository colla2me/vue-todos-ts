import { Todo } from './models/Todo';

function all(todos: Todo[]): Todo[] {
  return todos
}

function active(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed)
}

function completed(todos: Todo[]): Todo[] {
  return todos.filter((todo) => todo.completed)
}

export default {
  all, active, completed
}