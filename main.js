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
import md5 from "md5";
import axios from "axios";
Fastclick.attach(document.body);

/*Vue原型上定义方法，方便调用*/
Object.assign(Vue.prototype,{

	//token获取方法
	accessToken(baseStr){
		return function(){
			let token = "";
			for(let i in this){
				if(this.hasOwnProperty(i)){
					if(i!=="accessToken"){
						token += this[i];
						token += ",";
					}
				}
			}
			token += baseStr;
			return md5(token)
		}
	},

	//给对象绑定token方法
	bindToken(data,baseStr){
		return Object.defineProperty(data,"accessToken",{
			get:this.accessToken(baseStr),
			enumerable : true,
			configurable : true
		});
	},

	//定义aixos URLSearchParams的整合参数函数
	paramsPak(arg){               
		let arr = Object.entries(arg);
		let params = new URLSearchParams();
		for(let i of arr){
			params.append(i[0],i[1]);
		}
		return params
	},

  	//定义Iscroll的scroll事件方法
  	scrollFun(arg){                 
  		return function(){
  			if(this.y <= this.maxScrollY && arg.list.length > 10){
  				arg.scroll.display= true;
  				if(arg.scroll.loadtext == arg.$t('scroll.nomore')){
  					return false
  				}else if(this.y < (this.maxScrollY - 30) && arg.scroll.loadtext != arg.$t('scroll.nomore')){
  					arg.scroll.loadtext = arg.$t('scroll.loosen');    
  				}else{
  					arg.scroll.loadtext = arg.$t('scroll.up');
  				}
  			}else{
  				return false
  			}
  		}
  	},

  	 //定义Iscroll的scrollEnd事件方法
  	 scrollEnd(arg,{method,url,data}){           
  	 	return function(){
  	 		if(arg.scroll.loadtext == arg.$t('scroll.loosen')){
  	 			let info = arg.deepCopy(data);
  	 			let page = ++arg.scroll.page;
  	 			Object.assign(info,{page});
  	 			arg.bindToken(info,arg.$store.state.str);//给info绑定accesstoken属性
  	 			axios({
  	 				method,
  	 				url,
  	 				data:arg.paramsPak(info),
  	 			})
  	 			.then(response => {
  	 				if(response.data.error_code == 0){
  	 					arg.list = [...arg.list,...response.data.data.data];
  	 					arg.scroll.display = false;
  	 					arg.scroll.loadtext = arg.$t('scroll.up');
  	 				}else{
  	 					arg.scroll.loadtext = arg.$t('scroll.nomore');
  	 				}
  	 			})
  	 			.then(() => {

  	 				this.refresh();
  	 			});	
  	 		}else{
  	 			arg.scroll.display = false;
  	 		}

  	 	}
  	 }
  	});



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





/*全局混入动态消息类型*/
Vue.mixin({
	computed:{
		msgType(){
			return this.$i18n.locale === "zh-CN"?"msg_ch":"msg_en";
		},
	}
})

//主组件
new Vue({
	el: '#app',
	router,
	store,
	i18n,
	components: { App },
	template: '<App/>'
})
