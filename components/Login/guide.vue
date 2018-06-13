<template>
	<transition :name="slideName">
		<div class="guide_main" 
		v-loading="loading2"
		:element-loading-text="$t('err.tip18')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)">
		<img src="../../assets/img/guide.png" alt="">
		<div class="form_wrap">
			<button type="" @click="regist">{{$t('register.reg')}}</button>
			<button type="" class="yelbtn" @click="login">{{$t('login.h1')}}</button>
		</div>
	</div>
</transition>
</template>
<script>
	import md5 from "md5";
	import sha1 from "sha1";
	// import country from "../../assets/js/config";
	export default {
		name:"guide",
		data() {
			return {
				slideName:"slide-left",
				isOK:0,
				version_num: "1.1",
				loading2:false,
			}
		},
		mounted() {
			document.addEventListener(
				"touchmove",
				function(e) {
					e.returnValue = true;
				},
				false
				);
			this.loading2 = true;
			setTimeout(() => {
				this.$http
				.post(
					this.$store.state.url + "api/version/getVersion",
					{
						version: this.version_num,
						accessToken: md5(this.version_num +","+ this.$store.state.str)
					},
					{
						headers: {},
						emulateJSON: true
					}
					)
				.then(response => {
					response = response.body;
					switch(response.error_code){
						case 0:
						this.isOK = 2;
						break;
						case 1:
						this.isOK = 2;
						this.$message({
							message: response.data[this.msgType],
							duration: 1500
						});
						break;
						case 2:
						this.isOK = 1;
						this.$message({
							message: response.data[this.msgType],
							duration: 1500
						});
						break;
					}
				})
				.catch((response) => {
					this.$message({
						message: this.$t("err.info"),
						duration: 1500
					});
				})
				.finally(() => {
					this.loading2 = false;
				});
			}, 150);
		},
		created() {
			var _this = this;
			var userAgent = navigator.userAgent.match(this.regAgent)[1];
			this.phone_style = userAgent;
		},
		computed:{
			msgType(){
				return this.$i18n.locale === "zh-CN"?"msg_ch":"msg_en";
			}
		},
		methods:{
			login(){
				if(this.isOK != 0){
					this.isOK == 2
					?this.$router.push({name:"login"})
					:this.$message({
						message: this.$t("err.tip17"),
						duration: 1500
					});
				}
			},
			regist(){
				if(this.isOK != 0){
					this.isOK == 2
					?this.$router.push({name:"register",params:{path:"guide"}})
					:this.$message({
						message: this.$t("err.tip17"),
						duration: 1500
					});
				}
			}
		}
	}

</script>
<style lang="scss">
	.guide_main{
		height:100%;
		width:100%;
		position:absolute;
		background:linear-gradient(0deg,#352c25 0,#1d1c1c 100%);
	}
	.guide_main img{
		width:33.33%;
		height:auto;
		display: block;
		margin-left:auto;
		margin-right:auto;
		position:absolute;
		top:25%;
		left:50%;
		transform:translate3d(-50%,0,0); 
	}
	.form_wrap{
		width:100%;
		position:absolute;
		bottom:0;
		padding:20px 30px;
		box-sizing: border-box;
	}
	.form_wrap button{
		outline:none;
		border:none;
		width:100%;
		height:7vh;
		line-height:7vh;
		text-align: center;
		background: #1c1713;
		color:#fff;
		border-radius:3px;
	}
	.form_wrap .yelbtn{
		background: #f39902;
		color:#000;
		margin-top:20px;
	}
</style>


