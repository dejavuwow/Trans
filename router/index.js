import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/Home/home'
import C2C from '../components/C2C/c2ctrade/C2C.vue'
import Person from '../components/Person/index'
import updatepwd from '../components/Person/updatePwd'
import paypwd from '../components/Person/payPwd'
import about from '../components/Person/about'
import login from '../components/Login/login'
import Guide from '../components/Login/guide'
import register from '../components/Login/register'
import findpwd from '../components/Login/updatePwd'
import certify from '../components/Person/certify'
import bank from '../components/Person/bank'
import addBank from '../components/Person/addBank'
// 新
import resetPwd from '../components/Login/resetPwd'
import buy_in from '../components/C2C/c2ctrade/buyIn'
import personInfo from '../components/Person/personInfo'
import setting from '../components/Person/setting'
import mail from '../components/Person/mail'
import credit from '../components/Person/credit'
import upload from '../components/Person/upload'
import roll_in from '../components/Person/rollIn'
import roll_out from '../components/Person/rollOut'
import in_record from '../components/Person/in-record'
import wallet from '../components/Person/wallet'
import add_address from '../components/Person/addAddress'
import trade from '../components/C2C/c2ctrade/trade'
import sell_out from '../components/C2C/c2ctrade/sellout'
import deal_record from '../components/C2C/c2ctrade/deal_record'
import complete from '../components/Person/complete'
import state from '../components/Person/state'
import myCoin from '../components/Person/myCoin'
import chat from '../components/C2C/c2ctrade/chat'
import tips from '../components/Home/tips'
import out_record from '../components/Person/out-record'
import service from '../components/Home/service'
import note from '../components/Home/notice'
import Aboutus from '../components/Person/aboutus'
import About from '../components/Person/about'
import Notelist from '@/components/Home/notelist'

import  Identification from '@/components/Home/identification'
import  Idstepthree from '@/components/Home/idstepthree'
import  Idsteptwo from '@/components/Home/idsteptwo'
import  Idfinish from '@/components/Home/idfinish'


Vue.use(Router)
Router.prototype.goBack = function () {
	this.isBack = true
	window.history.go(-1);
}

export default new Router({
  		
  		routes: [
  		{
  			path:"/notelist",
  			component:Notelist,
  			name:'notelist'
  		},
  		{
  			path:"/identification",
  			component:Identification,
  			name:'identification'
		  },
		{
			path:"/idstepthree",
			component:Idstepthree,
			name:'idstepthree'
		},
		{
			path:"/idsteptwo",
			component:Idsteptwo,
			name:'idsteptwo'
		},
		{
			path:"/idfinish",
			component:Idfinish,
			name:'idfinish'
		},
  		{
  			path:'/about',
  			component:About,
  			name:'about'
  		},
  		{
  			path:'/aboutus',
  			component:Aboutus,
  			name:'aboutus'
  		},
  		{
  			path:'/',
  			component:Guide,
  			name:'guide'
  		},
  		{
  			path:'/home',
  			component:home,
  			name:'Home'
  		},
	   //fdq
	   {
	   	path:'/C2C',
	   	name:'C2C',
	   	component:C2C,
	   	redirect:'/C2C/buyin',
	   	children:[{
	   		path:'/C2C/trade',
	   		component:trade
	   	},{
	   		path:'/C2C/buyin',
	   		component:buy_in
	   	},
	   	{
	   		path:'/C2C/sellout',
	   		component:sell_out
	   	},
	   	{
	   		path:'/C2C/record',
	   		component:deal_record
	   	},
	   	],
	   	meta:{
	   		auth:true
	   	},
	   },
	  //fdq
	  {
	  	path:'/Person',
	  	component:Person,
	  	name:'Person',
	  	meta:{
	  		auth:true
	  	},
	  },

	  {
	  	path:'/updatePwd',
	  	component:updatepwd,
	  },
	  {
	  	path:'/payPwd',
	  	component:paypwd,
	  },
	  {
	  	path:'/about',
	  	component:about,
	  },
	  {
	  	path:'/login',
	  	component:login,
	  	name:'login'
	  },
	  {
	  	path:'/register',
	  	name:"register",
	  	component:register,
	  },
	  {
	  	path:'/findpwd',
	  	component:findpwd,
	  	name:'updatePwd'
	  },
	  {
	  	path:'/certify',
	  	component:certify,
	  },
	  {
	  	path:'/resetPwd',
	  	component:resetPwd
	  },
	  {
	  	path:'/personInfo',
	  	component:personInfo
	  },
	  {
	  	path:'/setting',
	  	component:setting
	  },
	  {
	  	path:'/mail',
	  	component:mail
	  },
	  {
	  	path:'/credit',
	  	component:credit
	  },
	  {
	  	path:'/upload',
	  	component:upload
	  },
	  {
	  	path:'/roll-in',
	  	component:roll_in
	  },
	  {
	  	path:'/in-record',
	  	component:in_record
	  },
	  {
	  	path:'/roll-out',
	  	component:roll_out
	  },
	  {
	  	path:'/wallet',
	  	component:wallet
	  },
	  {
	  	path:'/add-address',
	  	component:add_address
	  },{
	  	path:'/complete',
	  	component:complete
	  },
	  {
	  	path:'/state',
	  	component:state
	  },
	  {
	  	path:'/myCoin',
	  	component:myCoin
	  },
	  {
	  	path:'/chat',
	  	component:chat
	  },
	  {
	  	path:'/bank',
	  	component:bank
	  },
	  {
	  	path:'/addBank',
	  	component:addBank
	  },
	  {
	  	path:'/tips',
	  	component:tips
	  },
	  {
	  	path:'/out-record',
	  	component:out_record
	  },
	  {
	  	path:'/service',
	  	component:service
	  },
	  {
	  	path:'/notice',
	  	component:note
	  },
	  ]
	})
