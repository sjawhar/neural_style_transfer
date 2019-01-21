<template>
  <div class="wrapper wrapper-full-page">
    <div class="full-page">
      <div class="content">
        <div class="container-fluid">
          <transition
            name="fade"
            mode="out-in"
          >
            <!-- your content here -->
            <router-view/>
          </transition>
        </div>
      </div>
    </div>
    <div
      class="full-page-background"
      style="background-image: url(/img/background/background-2.jpg)"
    />
  </div>
</template>

<script>
export default {};
</script>

<style>
.wrapper-vertical-offset {
  padding-top: 20vh;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
