<template>
  <div class="test">
    <h1>test count: {{ count }}</h1>
    <div>count * 2 = {{ doubleCount }}</div>
    <button @click="add">add</button>
    <button @click="update">update a</button>
  </div>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
export default {
  setup () {
    const count = ref(0)
    const add = () => {
      count.value++
    }
    watch(() => count.value, val => {
      console.log(`count is ${val}`)
    })
    const doubleCount = computed(() => count.value * 2)
    const { ctx } = getCurrentInstance();
    const update = () => { 
      ctx.$store.commit('setTestA', count) 
    };
    return {
      count,
      doubleCount,
      add,
      update
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  color: red;
}
</style>