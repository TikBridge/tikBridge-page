<script>
import { defineComponent } from "vue";
import logoPath from '@/assets/images/logo.png'
export default defineComponent({
  name: 'TheHeader',
  setup(){},
  data() {
    return {
      logopath: logoPath
    }
  },
  components: {
  }
})
</script>

<template>
  <header class="header-container">
    <img :src="logopath" alt="logo" class="logo">
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
.header-container {
  display: flex;
  align-items: center;
}
.logo {
  width: 180px;
  height: auto;
  margin-right: 10px;
  margin-left: 30px;
}
</style>