<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
@font-face {
    font-family: roboto;
    src: url(./assets/font/Roboto/Roboto-Regular.ttf);
}
#app {
   font-family: roboto,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body{
  margin: 0px;
}
:root{

}
</style>
