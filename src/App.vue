<template>
  <!-- <div class="app">
    <div class="inner">
      <NewTodo @addTodo="addTodo" />
      <TodoList :todoList="todoList" @updateTodo="updateTodo"/>
    </div>
  </div>-->
  <div class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus autocomplete="off" type="text" placeholder="What needs to be done?" v-model="newTodo" @keyup.enter="addTodo"/>
    </header>
    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone"/>
      <label for="toggle-all">Mark all as complete</label>
      <ol class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{completed: todo.completed, editing: editedTodo && todo == editedTodo}">
          <div class="view">
            <input type="checkbox" class="toggle" v-model="todo.completed"/>
            <label @dblclick="editTodo(todo)">{{todo.name}}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input type="text" class="edit" v-model="todo.name" v-todo-focus="todo == editedTodo" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" />
        </li>
      </ol>
    </section>
    <footer class="footer"></footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";
import NewTodo from "./components/NewTodo.vue";
import TodoList from "./components/TodoList.vue";
import { Todo } from "./models/Todo";
import { Log } from "./decorators/log";
import { todoFocus } from "./directives/todo-focus";
import { Hello, World } from "./mixins/mixin-one";
import todoStorage from './store'
import filters from './filters'

@Component({
  components: {
    NewTodo,
    TodoList,
  },
  directives: {
    todoFocus
  }
})
export default class App extends Mixins(Hello, World) {
  static ENTER_KEY = 13
  private newTodo = ''
  private beforeEditTodo?: string
  private editedTodo: Todo | null = null
  private visibility: 'all' | 'active' | 'completed' = 'all'
  private todos = todoStorage.fetch()

  get filteredTodos(): Todo[] {
    return filters[this.visibility](this.todos)
  }

  get remaining(): number {
    return filters.active(this.todos).length
  }

  get allDone(): boolean {
    return this.remaining == 0
  }

  set allDone(value: boolean) {
    this.todos.forEach((todo) => {todo.completed = value})
  }

  @Watch('todos', {deep: true})
  todosChanged(newVal: Todo[]) {
    console.log(JSON.stringify(newVal));
    todoStorage.save(newVal)
  }

  @Log
  addTodo() {
    const value = this.newTodo && this.newTodo.trim()
    if (!value) {
      return
    }
    const todo: Todo = {
      id: this.todos.length + 1,
      name: value,
      completed: false
    };

    this.todos.push(todo);
    // clear inputed text
    this.newTodo = ''
  }

  @Log
  updateTodo(todo: Todo, partialTodo: Partial<Todo>) {
    const index = this.todos.indexOf(todo);
    const newTodo = Object.assign(todo, partialTodo);
    this.todos.splice(index, 1, newTodo);
  }

  @Log
  removeTodo(todo: Todo) {
    const index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }

  @Log
  editTodo(todo: Todo) {
    this.beforeEditTodo = todo.name
    this.editedTodo = todo
  }

  @Log
  doneEdit(todo: Todo) {
    if (!this.editedTodo) {
      return
    }

    this.editedTodo = null
    todo.name = todo.name.trim()
    if (!todo.name) {
      this.removeTodo(todo)
    }
  }

  @Log
  cancelEdit(todo: Todo) {
    this.editedTodo = null
    if (this.beforeEditTodo) {
      todo.name = this.beforeEditTodo
    }
  }

  @Log
  removeCompleted() {
    this.todos = filters.active(this.todos)
  }
}
</script>

<style lang="scss" scoped>
.todoapp {
  position: relative;
  margin: 130px 0 40px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  input::placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  h1 {
    width: 100%;
    position: absolute;
    top: -155px;
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    text-rendering: optimizeLegibility;
  }
}

.new-todo,
.edit {
  position: relative;
  margin: 0;
  width: 100%;
  padding: 6px;
  font-size: 24px;
  line-height: 1.4em;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.main {
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
}

.toggle-all {
  position: absolute;
  text-align: center;
  border: none;
  opacity: 0;

  & + label {
    position: absolute;
    top: -52px;
    left: -13px;
    width: 60px;
    height: 34px;
    transform: rotate(90deg);
    font-size: 0;

    &::before {
      content: "❯";
      padding: 10px 27px;
      font-size: 22px;
      color: #e6e6e6;
    }
  }

  &:checked + label:before {
    color: #737373;
  }
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #e6e6e6;

    .toggle {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      text-align: center;
      width: 40px;
      height: auto;
      border: none;
      opacity: 0;

      & + label {
        background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center left;
      }

      &:checked + label {
        background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
      }
    }

    label {
      display: block;
      padding: 15px 15px 15px 60px;
      line-height: 1.2;
      word-break: break-all;
      transition: color 0.4s;
    }

    &.completed {
      label {
        color: #d9d9d9;
        text-decoration: line-through;
      }
    }

    .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 30px;
      color: #cc9a9a;
      margin-bottom: 11px;
      transition: color 0.2s ease-out;

      &:hover {
        color: #af5b5e;
      }

      &:after {
        content: "×";
      }
    }

    &:hover {
      .destroy {
        display: block;
      }
    }

    .edit {
      display: none;
    }

    &:last-child {
      border-bottom: none;
    }

    &.editing {
      border-bottom: none;
      padding: 0;

      .edit {
        display: block;
        width: 506px;
        padding: 12px 16px;
        margin: 0 0 0 43px;
      }

      .view {
        display: none;
      }

      &:last-child {
        margin-bottom: -1px;
      }
    }
  }
}

.footer {
  padding: 10px 15px;
  height: 20px;
  text-align: center;
  color: #777;
  border-top: 1px solid #e6e6e6;

  &::before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 
                0 8px 0 -3px #f6f6f6,
                0 9px 1px -3px rgba(0, 0, 0, 0.2), 
                0 16px 0 -6px #f6f6f6,
                0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;

  > .inner {
    padding: 8px;
    border: 1px solid grey;
  }
}
</style>
