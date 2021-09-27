<template>
  <div id="my-chat-room" class="container my-5">
    <!-- nav -->
    <!-- spinner -->
    <main role="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "@/scss/main.scss";
</style>

<style lang="scss" scoped>
@import "@/scss/main.scss";
</style>
