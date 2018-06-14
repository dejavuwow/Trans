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
		path:'/',
		component:Guide,
		name:'guide'
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
		path:'/resetPwd',
		component:resetPwd
	},
	{
		path:'/setting',
		component:setting
	},
	{
		path:'/notice',
		component:note
	},
	]
})
