import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from "./store";
import vuetify from './plugins/vuetify';
import 'prismjs'
import 'prismjs/themes/prism-twilight.css'
import 'prismjs/components/prism-bash.min'
import 'prismjs/components/prism-yaml.min'
import 'prismjs/components/prism-markdown.min'

Vue.config.productionTip = false;
Vue.config.errorHandler = function (err, vm, info)  {
    console.log('[Global Error Handler]: Error in ' + vm.$options.name + " " + info + ': ' + err);
};
new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app');
