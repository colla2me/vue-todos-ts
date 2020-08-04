import { Todo } from './models/Todo';
const STORAGE_KEY = 'TodoList'

function fetch(): Todo[] {
  const data = localStorage.getItem(STORAGE_KEY) || '[]'
  return <Todo[]>JSON.parse(data)
}

function save(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default {
  fetch,
  save
}