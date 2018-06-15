<template>
	<transition name="slide-right">
		<div class="body_wrap order_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap">
				
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
				title:this.$t('receive.bank'),
			}
		},
		computed:{
		},
		mounted(){
			const info = this.baseApi("api/bank/bankList");
			axios(info)
			.then(response => {
				console.log(response)
			})
			.then(() => {
			})
		},
		methods:{

		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	
</style>


