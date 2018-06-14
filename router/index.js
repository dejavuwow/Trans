import Vue from 'vue'
import Router from 'vue-router'
import updatepwd from '../components/Person/updatePwd'
import paypwd from '../components/Person/payPwd'
import login from '../components/Login/login'
import Guide from '../components/Login/guide'
import register from '../components/Login/register'
import findpwd from '../components/Login/updatePwd'
import resetPwd from '../components/Login/resetPwd'
import setting from '../components/Person/setting'
import note from '../components/Home/notice'
import Notelist from '@/components/Home/notelist'
import WalletAddr from '@/components/Person/walletAddr'
import Order from "@/components/C2C/order"

import  Identification from '@/components/Home/identification'
import  Idstepthree from '@/components/Home/idstepthree'
import  Idsteptwo from '@/components/Home/idsteptwo'
import  Idfinish from '@/components/Home/idfinish'


Vue.use(Router)

export default new Router({
  		
  		routes: [
			{
				path:"/order",
				component:Order,
				name:'order'
			},
			{
				path:"/walletAddr",
				component:WalletAddr,
				name:'walletaddr'
			},
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
