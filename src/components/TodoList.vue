<template>
  <div>
    <ol>
      <li v-for="(todo, index) in todoList" :key="index">
        <input type="checkbox" :checked="todo.status === 'done'" @change="changeStatus(todo, $event)"> {{todo.name}}
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Todo } from '../models/Todo'

@Component
export default class TodoList extends Vue {
  @Prop() private todoList!: Todo[]

  changeStatus(todo: Todo, e: Event) {
    const checked = (<HTMLInputElement>e.target).checked
    this.$emit('updateTodo', todo, {status: checked ? 'done' : 'todo'})
  }
}
</script>

<style lang="scss" scoped>

</style>