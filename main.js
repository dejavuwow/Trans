// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/sass/reset.scss';
import './assets/js/index.js';
import 'font-awesome/css/font-awesome.css'
import './assets/css/animate.css'
import VueI18n from 'vue-i18n'
import  Fastclick from 'fastclick'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vueresource from 'vue-resource'
Fastclick.attach(document.body);

//页面跳转强制到顶部
Vue.config.productionTip = false
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

//插件
/*双语插件*/
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: localStorage.getItem("lang")?localStorage.getItem("lang"):'zh-CN',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh-CN': require('./assets/language/cn'),   // 中文语言包
      'en-US': require('./assets/language/en')    // 英文语言包
  }
})
/*element-ui插件*/
Vue.use(ElementUI);
Vue.use(Vueresource)


//主组件
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
