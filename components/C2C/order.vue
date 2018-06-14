<template>
	<transition name="slide-right">
		<div class="body_wrap order_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap" ref="wrap">
				<Inp v-for="(item,index) in list" :inputData="item" @input="writeVal" :key="index"></Inp>
				<button type="" @click="trade">买入/卖出</button>
			</div>
		</div>
	</transition>
</template>

<script>
	import Header from '../Public/header';
	import Inp from '../Public/Inp';
	import axios from "axios";
	import md5 from "md5";
	export default {
		name:"walletAddr",
		components:{Header,Inp},
		data(){
			return{
				title:this.$t('C2C.b1'),
				list:[		
				{name:"num",type:"text",placeholder:this.$t('sellout.s33'),value:""},
				{name:"price",type:"text",placeholder:this.$t('sellout.s34'),value:""},
				{name:"tradepwd",type:"password",placeholder:this.$t('register.ppwd'),value:""}
				],
			}
		},
		mounted(){

		},
		methods:{
			//根据子组件中name属性确定更新主组件中的input的value
			writeVal(data){
				switch(data.name){
					case "num":
					this.list[0].value = data.value;
					break;
					case "price":
					this.list[1].value = data.value;
					break;
					case "tradepwd":
					this.list[2].value = data.value;
					break;
				}
			},

			//挂单方法
			trade(){
				let info = this.baseApi("api/orders/createorder",
					{num:this.list[0].value},
					{price:this.list[1].value},
					{tradePwd:this.list[2].value},
					{type:0}
					);
				axios(info)
				.then(response => {
					console.log(response)
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
</style>


