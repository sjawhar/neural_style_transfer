<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications
      transition-name="notification-list"
      transition-mode="out-in"
    />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
// Loading some plugin css asynchronously
import('sweetalert2/dist/sweetalert2.css');
import('vue-notifyjs/themes/default.css');
export default {};
</script>
<style lang="scss">
.notifications.vue-notifyjs {
  .notification-list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .notification-list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .notification-list-enter-active,
  .notification-list-leave-active {
    transition: opacity 0.4s;
  }
  .notification-list-enter,
  .notification-list-leave-to {
    opacity: 0;
  }
}
</style>
