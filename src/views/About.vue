<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- <p>{{ ctx.$router.currentRoute.value }}</p> -->
    <div>state from vuex {{ a }}</div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from "vue";
export default {
  setup () {
    const { ctx } = getCurrentInstance();
    console.log(ctx.$router.currentRoute.value);
    const a = computed(() => ctx.$store.state.test.a);
    return {
      a
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  color: red;
}
</style>
