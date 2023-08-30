<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: 'TheHeader',
  setup(){},
  components: {
  }
})
</script>

<template>
  <header>
    <router-link to="/transfer">
      <el-button type="info">transfer</el-button>
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