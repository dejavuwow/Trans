<template>
	<transition :name="slideName">
	<div class="login body_wrap"
		v-loading="loading2"
		:element-loading-text="$t('err.tip14')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false">
		<h1>
			<span class="left_icon" @click="back()">&#xe625;</span>
			{{$t('findPwd.h1')}}</h1>
			<div class="input-items">
				<input type="password" :placeholder="$t('findPwd.pwd')" v-model="pwd">
			</div>
			<div class="input-items">
				<input type="password" :placeholder="$t('findPwd.repwd')" v-model="re_pwd">
			</div>
			<button class="btn-gold" @click="complete()">{{$t('bank.tip18')}}</button>
		</div>
	</transition>
</template>
<script>
	import md5 from "md5";
	import sha1 from "sha1";
	export default {
		name: "resetPwd",
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
				this.$http
				.post(
					this.$store.state.url + "Api/Login/subForgetpassword",
					{
						user: this.user,
						pwd: this.pwdMd5,
						repwd: this.repwdMd5,
						token: sha1(
							this.user + this.pwdMd5 + this.repwdMd5 + this.$store.state.str
							)
					},
					{
						headers: {},
						emulateJSON: true
					}
					)
				.then(res => {
					this.loading2 = false;
					if (res.data.status == 1) {
						this.$message({
							message: this.$t("findPwd.tip8"),
							duration: 1500
						});
						this.$router.push({ path: "/", params: { t: "1" } });
					} else if (res.data.status == 3) {
						this.$message({
							message: this.$t("findPwd.tip13"),
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
	.login {
		padding: 0 15px;
		position: absolute;
		z-index: 99;
		width: 100%;
		box-sizing: border-box;
		h1 {
			font-size: 16px;
			font-weight: normal;
			margin-bottom: 20px;
			line-height: 40px;
		}
		.input-items {
			border-bottom: 1px solid rgb(38, 38, 58);
			margin: 0;
		}
		input {
			margin: 0;
			padding: 15px 0;
			text-align: left;
			border: none;
			border-bottom: 1px solid rgb(38, 38, 58);
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


