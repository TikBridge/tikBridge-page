<script setup>
import { RouterView } from 'vue-router'
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";

</script>

<template>
  <div>
    <TheHeader />
    <div class="main">
      <RouterView />
    </div>
    <TheFooter/>
  </div>

</template>

<style scoped>
body {
}
.main{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
