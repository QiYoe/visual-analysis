import { from } from 'core-js/fn/array'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: CompositeOperation
  export default componentOptions
}
