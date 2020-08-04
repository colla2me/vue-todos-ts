import { DirectiveFunction } from "vue";

export const todoFocus: DirectiveFunction = (el, binding) => {
  if (binding.value) {
    el.focus();
  }
}
