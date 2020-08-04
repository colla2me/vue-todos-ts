import { createDecorator } from 'vue-class-component'

export const Log = createDecorator((options, key) => {
  if (!options.methods) return;
  const originalMethod = options.methods[key]

  options.methods[key] = function wrapperMethod(...args) {
    console.log(`invoked: ${key}(`, ...args, ')')

    originalMethod.apply(this, args)
  }
})