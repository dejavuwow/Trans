<template>
	<transition :name="animateName">
		<div class="loginPwd3 body_wrap"
		v-loading="loading2"
		element-loading-text="处理中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false"
		>
		<Header :title="$t('payPwd.h1')">
			<router-link to="/setting?path=payPwd" slot="left" class="fa fa-angle-left" tag="i"></router-link>
			<i slot="right"></i>
		</Header>
		<div class="content">
			<div class="input-item">
				<span>{{$t('update.old')}}</span>
				<el-input
				:placeholder="$t('update.tip3')"
				type="password"

				v-model="oldpwdtrade">
			</el-input>
		</div>
		<div class="input-item">
			<span>{{$t('update.new')}}</span>
			<el-input
			:placeholder="$t('register.tip21')"
			type="password"

			v-model="pwdtrade">
		</el-input>
	</div>
	<div class="input-item">
		<span>{{$t('update.new')}}</span>
		<el-input
		:placeholder="$t('update.repwd')"
		type="password"

		v-model="repwdtrade">
	</el-input>
</div>
<div class="btn">
	<button type="button" @click="confirm">{{$t('mail.tip3')}}</button>
</div>
</div>
</div>
</transition>
</template>
<script>
	import md5 from "md5";
	import sha1 from "sha1";
	import Header from "../Public/header";
	import axios from "axios";
	export default {
		name: "updatepwd",
		components:{Header},
		data() {
			return {
				animateName: "slide-right",
				oldpwdtrade: "",
				pwdtrade: "",
				repwdtrade: "",
				loading2:false
			};
		},
		computed: {
		},
		methods: {
			confirm() {
				var _this = this;
				var reg = /^\d{6}$/;
				if (!this.oldpwdtrade || !this.pwdtrade || !this.repwdtrade) {
					this.$message({
						message: this.$t("alipay.tip"),
						duration: 1500
					});
					return false;
				}
				if (this.pwdtrade != this.repwdtrade) {
					this.$message({
						message: this.$t("register.tip20"),
						duration: 1500
					});
					return false;
				}
				if (!reg.test(this.pwdtrade)) {
					this.$message({
						message: this.$t("register.tip3"),
						duration: 1500
					});
					return false;
				}
				this.loading2=true;
				let [uid,loginSign] = [localStorage.getItem("uid"),localStorage.getItem("loginSign")];
				const baseStr = this.$store.state.str;
				let basInfo = {
					method:"post",
					url: this.$store.state.url+"api/user/tradepwdEdit",
					data:{
						uid,
						loginSign,
						oldtradepwd:this.oldpwdtrade,
						tradepwd:this.pwdtrade,
						tradepwd_confirm:this.repwdtrade,

					}
				};

				this.bindToken(basInfo.data,baseStr);//给basInfo绑定accesstoken属性
				basInfo.data = this.paramsPak(basInfo.data);

				axios(basInfo)
				.then(response => {
					if(response.data.error_code === 0){
						this.oldpwdtrade = "";
						this.pwdtrade = "";
						this.repwdtrade = "";
					}
					this.$message({
						message: response.data.data[this.msgType],
						duration: 1500
					});
				})
				.catch(() => {
					this.$message({
						message: this.$t("err.info"),
						duration: 1500
					});
				})
				.finally(() => {
					this.loading2 = false;
				});
			}
		}
	};
</script>
<style lang="less">
	.loginPwd3 {
		position: absolute;
		width: 100%;
		.header {
			text-align: center;
			.fa {
				font-size: 25px;
				float: left;
				line-height: 25px;
			}
			.left_icon{
				left:15px;
			}
		}
		.content {
			white-space: nowrap;
			padding:30px;
			.input-item {
				span {
					width: 30%;
					display: inline-block;
					color: #a1968f;
				}
				border-bottom: 1px solid #44352f;
			}
			.el-input {
				display: inline-block;
				width: 70%;
			}
			.el-input__inner {
				border: none;
				text-align: left;
				background: transparent;
			}
			.el-input .el-input__clear {
				margin-top: 25px !important;
			}
			.btn {
				margin-top: 50px;
				button {
					border-radius: 5px;
					background-color: rgb(255, 195, 52);
					color: rgb(51, 51, 51);
				}
			}
		}
	}
</style>

