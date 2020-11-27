<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <!-- <p>{{ "BASE_URL: ", process.env.BASE_URL }}</p>
    <p>{{ "VUE_APP_API: ", process.env.VUE_APP_API }}</p> -->
    <p>{{ "api: ", api }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios"

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  return() {
    api: process.env.VUE_APP_API
  },
  mounted() {
    console.log(process.env)
    axios.get("/api/1").then(res => {
      console.log('proxy: ', res);
    })
  }
}
</script>
