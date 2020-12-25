import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    var firebaseConfig = {
      apiKey: "AIzaSyB9HtBEM-Hhelyp1wG1GHIza_wpQj1ltqE",
      authDomain: "primecuts-57079.firebaseapp.com",
      databaseURL: "https://primecuts-57079.firebaseio.com",
      projectId: "primecuts-57079",
      storageBucket: "primecuts-57079.appspot.com",
      messagingSenderId: "270007527015",
      appId: "1:270007527015:web:6237acea4e59ade46dd6c2"
    }
    firebase.initializeApp(firebaseConfig)
  }
}).$mount('#app')
