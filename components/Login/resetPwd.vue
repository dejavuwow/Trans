<template>
	<transition :name="slideName">
		<div class="reset body_wrap"
		v-loading="loading2"
		:element-loading-text="$t('err.tip14')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false">
		<Header :title="$t('findPwd.h1')">
			<router-link to="/findpwd?path=resetPwd" slot="left" class="fa fa-angle-left" tag="i"></router-link>
			<i slot="right"></i>
		</Header>
		<div class="upwrap1">
			<div class="input-items">
				<input type="password" :placeholder="$t('findPwd.pwd')" v-model="pwd">
			</div>
			<div class="input-items">
				<input type="password" :placeholder="$t('findPwd.repwd')" v-model="re_pwd">
			</div>
			<button class="btn-gold" @click="complete()">{{$t('bank.tip18')}}</button>
		</div>
	</div>
</transition>
</template>
<script>
	import md5 from "md5";
	import sha1 from "sha1";
	import Header from "../Public/header";
	export default {
		name: "resetPwd",
		components:{Header},
		data() {
			return {
				slideName: "slide-left",
				pwd: "",
				re_pwd: "",
				user: this.$route.query.user,
				loading2: false
			};
		},
		mounted() {},
		created() {},
		computed: {
			pwdMd5() {
				return md5(this.pwd);
			},
			repwdMd5() {
				return md5(this.re_pwd);
			}
		},
		beforeRouteLeave(to, from, next) {
			if (to.path == "/register" || to.path == "/findpwd") {
				this.animateName = "slide-left";
			}
			setTimeout(function() {
				next();
			}, 0);
		},
		methods: {
			back() {
				this.$router.push({ name: "updatePwd", params: { t: "1" } });
			},
			complete() {
				var _this = this;
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
				if (!reg.test(this.pwd)) {
					this.$message({
						message: this.$t("findPwd.tip4"),
						duration: 1500
					});
					return false;
				}
				if (this.pwd != this.re_pwd) {
					this.$message({
						message: this.$t("findPwd.tip5"),
						duration: 1500
					});
					return false;
				}
				this.loading2 = true;
				this.$http
				.post(
					this.$store.state.url + "api/user/resetPassword",
					{
						uid:localStorage.getItem("uid"),
						loginSign:localStorage.getItem("loginSign"),
						logpwd: this.pwd,
						logpwd_confirm: this.re_pwd,
						accessToken:md5(
							localStorage.getItem("uid") +"," +
							localStorage.getItem("loginSign") + "," +
							this.pwd +"," +
							this.re_pwd +"," +
							this.$store.state.str
							)
					},
					{
						headers: {},
						emulateJSON: true
					}
					)
				.then(response => {
					this.loading2 = false;
					if (response.data.error_code === 0) {
						this.$message({
							message: this.$t("findPwd.tip8"),
							duration: 1500
						});
						this.$router.push({ path: "/", params: { t: "1" } });
					} else{
						this.$message({
							message: response.data.data[this.msgType],
							duration: 1500
						});
					}
				})
				.catch(function(response) {
					this.loading2 = false;
					this.$message({
						message: this.$t("err.info"),
						duration: 1500
					});
				});
			}
		}
	};
</script>
<style lang="less">
	.reset {
		position: absolute;
		z-index: 99;
		width: 100%;
		box-sizing: border-box;
		.upwrap1{
			padding:0 15px;
		}
		h1 {
			font-size: 16px;
			font-weight: normal;
			margin-bottom: 20px;
			line-height: 40px;
		}
		.input-items {
			border-bottom: 1px solid #44352f;
			margin: 0;
		}
		input {
			margin: 0;
			padding: 15px 0;
			text-align: left;
			border: none;
			color: #d6e9fc;
		}
		.find {
			float: right;
		}
		.register1 {
			background-color: #151a1d;
			border: 1px solid rgb(255, 195, 52);
			color: rgb(255, 195, 52);
			margin-top: 30px;
			border-radius: 4px;
		}
		.btn-gold {
			margin-top: 30px;
			background-color: rgb(255, 195, 52);
			border-radius: 4px;
			color: rgb(51, 51, 51);
		}
		.back {
			position: absolute;
			left: 0;
			top: 10px;
			font-size: 25px;
		}
	}
</style>


