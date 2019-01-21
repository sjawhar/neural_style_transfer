import 'bootstrap/dist/css/bootstrap.css';
import 'es6-promise/auto';
import Vue from 'vue';
import VueRouter from 'vue-router';
import AsyncComputed from 'vue-async-computed';
import App from './App';
import router from './util/router';
import './polyfills';

// plugin setup
Vue.use(VueRouter);
Vue.use(AsyncComputed);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
