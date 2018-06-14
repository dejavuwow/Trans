<template>
	<transition name="slide-right">
		<div class="body_wrap wallet_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap" ref="wrap">
				<img :src="img" alt="">
				<p>{{address}}</p>
				<button type="">{{$t('transfer.tip4')}}</button>
			</div>
		</div>
	</transition>
</template>

<script>
	import Header from '../Public/header';
	import axios from "axios";
	import md5 from "md5";
	export default {
		name:"walletAddr",
		components:{Header},
		data(){
			return{
				title:this.$t('transfer.tip3'),
				img:"",
				address:"",
			}
		},
		mounted(){
			let info = this.baseApi("api/Wallet/userWallet");
			axios(info)
			.then(response => {
				if(response.data.error_code === 0){
					this.img = this.$store.state.url + response.data.data.data.qrcode_img;
					this.address = response.data.data.data.walletaddress;
				}
			})
		},
		methods:{
			copy() {
				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      				// ios
      				var UIPasteboard = plus.ios.importClass("UIPasteboard");
      				var generalPasteboard = UIPasteboard.generalPasteboard();
     			 	// 设置/获取文本内容:
     			 	generalPasteboard.setValueforPasteboardType(
     			 		this.address,
     			 		"public.utf8-plain-text"
     			 		);
     			 	var value = generalPasteboard.valueForPasteboardType(
     			 		"public.utf8-plain-text"
     			 		);
     			 	plus.nativeUI.toast(this.$t('chongzhi.tip4'),{verticalAlign: "center"});
     			 } else if (/(Android)/i.test(navigator.userAgent)) {
        			// android
        			var Context = plus.android.importClass("android.content.Context");
        			var main = plus.android.runtimeMainActivity();
        			var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
        			plus.android.invoke(clip,"setText",this.address);
        			plus.nativeUI.toast(this.$t('chongzhi.tip4'),{verticalAlign: "center"});
        		} 
        	}
        }
    };
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.wallet_wrap{
		img{
			display: block;
			width:3rem;
			height:3rem;
			margin-top:1rem;
			margin-bottom:.7rem;
			@extend %margin;
		}
		p{
			height:14px;
			text-align: center;
			@include fl(12px,normal,#fff);
		}
		button{
			width:70vw;
			@extend %margin;
			border-radius:4px;
			display: block;
			margin-top:.6rem;
			background-color:$btncolor;
		}
	}
</style>


