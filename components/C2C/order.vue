<template>
	<transition name="slide-right">
		<div class="body_wrap order_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap">
				<div class="trade_type">
					<span @click="type = 0">挂卖单</span>
					<span @click= "type = 1">挂买单</span>
					<Inp v-for="(item,index) in inpList" :inputData="item" @input="writeVal" :key="index"></Inp>
					<button type="" @click="trade">{{btnTxt}}</button>
				</div>
				<div class="listwrap" ref="wrap">
					<ul class="orderlist">
						<li v-for="(item,index) in list">
							<i :class="[item.type===0?'sell':'buy']">{{item.type===0?'卖':'买'}}</i>
							<span>{{item.num}}</span>
							<em>{{item.price}}</em>
						</li>
					</ul>
					<div class="up" v-show="scroll.display">{{scroll.loadtext}}</div>
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
		name:"order",
		components:{Header,Inp},
		data(){
			return{
				title:this.$t('C2C.b1'),
				inpList:[		
				{name:"num",type:"text",placeholder:this.$t('order.price'),value:""},
				{name:"price",type:"text",placeholder:this.$t('order.num'),value:""},
				{name:"tradepwd",type:"password",placeholder:this.$t('register.ppwd'),value:""}
				],
				list:[],
				scroll:{
					display:false,
					loadtext:this.$t('scroll.up'),
					page:0,
				},
				type:0,
			}
		},
		computed:{
			btnTxt(){
				return this.type === 0?"卖出":"买入";
			}
		},
		mounted(){
			const info = this.baseApi("api/orders/getorderlist");
			axios(info)
			.then(response => {
				this.list = response.data.data.data;
			})
			.then(() => {
				setTimeout(()=>{
					this.myscroll=new IScroll(this.$refs.wrap,{
						click:this.iScrollClick(),
						scrollbars: true,
						mouseWheel: false,
						probeType:2,
						fadeScrollbars:true,
						shrinkScrollbars:'clip'
					});
					document.addEventListener('touchmove', function(e) {  
						e.preventDefault();  
					}, {passive:false,capture:false})

					//绑定this环境,定义scroll方法
					let scrollFun = this.scrollFun(this);
					this.myscroll.on("scroll",scrollFun);

					//定义scrollEnd方法
					let scrollEnd = this.scrollEnd(this,"api/orders/getorderlist");
					this.myscroll.on("scrollEnd",scrollEnd);
				},300);
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

			//根据子组件中name属性确定更新主组件中的input的value
			writeVal(data){
				switch(data.name){
					case "num":
					this.inpList[0].value = data.value;
					break;
					case "price":
					this.inpList[1].value = data.value;
					break;
					case "tradepwd":
					this.inpList[2].value = data.value;
					break;
				}
			},

			//挂单方法
			trade(){
				const info = this.baseApi("api/orders/createorder",
					{num:this.inpList[0].value},
					{price:this.inpList[1].value},
					{tradePwd:this.inpList[2].value},
					{type:this.type}
					);
				axios(info)
				.then(response => {
					if(response.data.error_code === 0){
						for(let i of this.inpList){
							i.value = "";
						}
					}else{
						this.$message({
							message: response.data.data[this.msgType],
							duration: 1500
						});
					}
				})
				.catch(() => {
					this.$message({
						message: this.$t("err.info"),
						duration: 1500
					});
				})
			}
		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.order_wrap{
		.contwrap{
			background:#fff;
			button{
				width:39vw;
				background:$btncolor;
				border-radius:4px;
				margin-top:20px;
			}
			
		}
	}
	.orderlist{
		min-height:100.2%;
		li{
			height:40px;

			.buy{
				color:green;
			}
			.sell{
				color:red;
			}
		}
	}
	.listwrap{
		@include position(top,bottom,4rem,0);
		overflow: hidden;
	}
	.trade_type{
		span{
			height:40px;
			background:$btncolor;
			width:50px;
			display: inline-block;
		}
	}
</style>


