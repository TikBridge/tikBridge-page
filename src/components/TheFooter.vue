
<template>
<footer>
  <div>
    <p>Powered by TikBridge</p>
    <router-link to="/">
<!--      <n-icon size="40" :component="HomeSharp"/>-->
    </router-link>
    <a href=""></a>
<!--    <n-icon size="40" :component="LogoTwitter"/>-->
<!--    <n-icon size="40" :component="DocumentText"/>-->

<!--    <n-icon size="40" :component="LogoGithub"/>-->
  </div>
</footer>
</template>

<script>
import { defineComponent } from "vue";
import { LogoTwitter,HomeSharp,DocumentText, LogoGithub } from '@vicons/ionicons5'

export default defineComponent({
  name: 'TheFooter',
  components: {
  },
  setup(){
    return {
      LogoTwitter, LogoGithub,HomeSharp,DocumentText
    }
  }
})
</script>

<style scoped>
footer {
  //background-color: #f2f2f2;


  width: 100%;
  padding: 20px;
  bottom: 0;
  left: 0;
  position: fixed;
  text-align: center;
}
</style>