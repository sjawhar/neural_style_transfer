import 'bootstrap/dist/css/bootstrap.css';
import 'es6-promise/auto';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import router from './util/router';
import './polyfills';

// plugin setup
Vue.use(VueRouter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
