<template>
	<transition name="slide-right">
		<div class="body_wrap order_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right" :class="[display?'fa fa-check':'fa fa-pencil']" @click="display=!display"></i>
			</Header>
			<div class="contwrap" ref="wrap">
				<div class="maincontent">
					<ul class="credit_list">
						<li v-for="(item,index) in list">
							<i class="fa fa-check-circle" v-show="item.id===defaultId"></i>
							<span>{{item.bankname}}</span>
							<span>{{item.deposit}}</span>
							<p>{{item.cardnumber}}</p>
							<p class="btn_wrap" v-show="display">
								<button @click="setDefault(item.id)">{{$t('bank.edit[0]')}}</button>
								<button @click="removeItem(item.id,index)">{{$t('bank.edit[1]')}}</button>
							</p>
						</li>
					</ul>
					<button type="" class="add_bank" @click="addCard">{{$t('bank.tip2')}}</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import Header from '../Public/header';
	import Inp from '../Public/Inp';
	import axios from "axios";
	import md5 from "md5";
	import IScroll from 'iscroll/build/iscroll-probe';
	export default {
		name:"credit",
		components:{Header,Inp},
		data(){
			return{
				title:this.$t('bank.tip1'),
				display:false,
				defaultId:"",
				list:[],
			}
		},
		computed:{
		},
		mounted(){
			//包装接口参数,方法见main.js
			const info = this.baseApi("api/bank/bankList");
			document.addEventListener('touchmove', function(e) {  //禁止默认滑动事件
				e.preventDefault();  
			}, {passive:false,capture:false})

			//下次dom更新初始化iscroll
			this.$nextTick(() => {
				this.myscroll=new IScroll(this.$refs.wrap,{
					click:this.iScrollClick(),
					scrollbars: true,
					mouseWheel: false,
					probeType:2,
					scrollbars: 'custom',
					fadeScrollbars:true,
					shrinkScrollbars:'clip'
				});
			})

			//获取银行卡信息并更新dom视图
			axios(info)
			.then(response => {
				if(response.data.error_code === 0){
					this.list = response.data.data.data;

					for(let i of this.list){//根据default属性判断默认的账户
						if(i.default === 1){
							this.defaultId = i.id;
						}
					}
				}
			})
			.catch(() => {
				this.$message({
					message: this.$t("err.info"),
					duration: 1500
				})
			})
		},
		methods:{
			iScrollClick(){
				if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
				if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
				if (/Silk/i.test(navigator.userAgent)) return false;
				if (/Android/i.test(navigator.userAgent)) {
					var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
					return parseFloat(s[0]+s[3]) < 44 ? false : true
				}
			},

			//判断条件是否满足跳转到添加银行卡路由
			addCard(){
				this.$router.push("/addBank");
			},

			//设置默认
			setDefault(id){
				const info = this.baseApi("api/bank/bankPretermit",{id});
				axios(info)
				.then(response => {
					if(response.data.error_code === 0){
						this.defaultId = id;
					}
				})
			},

			//删除银行卡
			removeItem(id,index){
				const info = this.baseApi("api/bank/bankDel",{id});
				axios(info)
				.then(response => {
					if(response.data.error_code === 0){
						this.list.splice(index,1);
					}
				})
			}
			
		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.credit_list{
		width:100%;
		padding:20px;
		padding-bottom:0;
		box-sizing: border-box;
		li{
			width:100%;
			background:linear-gradient(135deg,rgba(157,141,119,0.9) 0,rgba(62,55,48,0.3) 100%);
			height:3rem;
			border-radius:4px;
			margin-bottom:20px;
			position:relative;
			.btn_wrap{
				width:100%;
				@include position(left,bottom,0,0);
				font-size:0;
				button{
					width:50%;
					background-color:$btncolor;

				}
				button:nth-of-type(2){
					background-color:#ff0033;
				}
			}
			i{
				@include position(top,right,0,0);
				color:green;

			}
		}
	}
	.add_bank{
		width:calc(100% - 40px);
		margin:0 auto;
		display: block;
		background-color:$btncolor;
		border-radius:4px;
	}
</style>


