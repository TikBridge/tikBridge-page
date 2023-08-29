<script>
import { defineComponent } from "vue";
import {NButton} from 'naive-ui'
export default defineComponent({
  name: 'TheHeader',
  setup(){},
  components: {
    NButton
  }
})
</script>

<template>
  <header>
    <router-link to="/transfer">
      <n-button type="info">transfer</n-button>
    </router-link>
  </header>
</template>



<style rel="stylesheet/scss"  scoped>
header {
  width: 100%;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
}

</style>
<script setup>
</script>