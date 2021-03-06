// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue';
import mathjs from 'mathjs';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import JsonExcel from 'vue-json-excel'
import Circle8 from "vue-loading-spinner/src/components/Circle8"


Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue);
Vue.use(mathjs);
window.Vue = Vue;
Vue.component('downloadExcel', JsonExcel)
Vue.component('Circle8', Circle8)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
