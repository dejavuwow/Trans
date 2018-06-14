<template>
	<transition :name="animateName">
		<div class="loginPwd2 body_wrap"
		v-loading="loading2"
		:element-loading-text="$t('err.tip14')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false">
		<Header :title="title">
			<router-link to="/setting?path=updatepwd" slot="left" class="fa fa-angle-left" tag="i"></router-link>
			<i slot="right"></i>
		</Header>
		<div class="content">
			<div class="input-item">
				<span>{{$t('update.old')}}</span>
				<el-input
				:placeholder="$t('update.tip14')"
				type="password"
				clearable
				v-model="oldpwd">
			</el-input>
		</div>
		<div class="input-item">
			<span>{{$t('update.new')}}</span>
			<el-input
			:placeholder="$t('register.tip2')"
			type="password"
			clearable
			v-model="pwd">
		</el-input>
	</div>
	<div class="input-item">
		<span>{{$t('update.new')}}</span>
		<el-input
		:placeholder="$t('update.repwd')"
		type="password"
		clearable
		v-model="repwd">
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
	import axios from "axios";
	import Header from "../Public/header";
	export default {
		name: "updatepwd",
		components:{Header},
		data() {
			return {
				title:this.$t('update.h1'),
				animateName: "slide-right",
				oldpwd: "",
				pwd: "",
				repwd: "",
				loading2: false
			};
		},
		computed: {


		},
		beforeRouteLeave(to, from, next) {
			setTimeout(function() {
				next();
			}, 50);
		},
		created(){
		},
		methods: {
			jumpBack() {
				this.$router.push("/setting");
			},
			confirm() {
				var _this = this;
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
				if (!this.oldpwd || !this.pwd || !this.repwd) {
					this.$message({
						message: this.$t("alipay.tip"),
						duration: 1500
					});
					return false;
				}
				if (this.pwd != this.repwd) {
					this.$message({
						message: this.$t("findPwd.tip5"),
						duration: 1500
					});
					return false;
				}
				if (!reg.test(this.pwd)) {
					this.$message({
						message: this.$t("findPwd.tip4"),
						duration: 1500
					});
					return false;
				}
				this.loading2 = true;
				let [uid,loginSign] = [localStorage.getItem("uid"),localStorage.getItem("loginSign")];
				let baseStr = this.$store.state.str;
				let basInfo = {
					method:"post",
					url: this.$store.state.url+"api/user/logpwdEdit",
					data:{
						uid,
						loginSign,
						oldlogpwd:this.oldpwd,
						logpwd:this.pwd,
						logpwd_confirm:this.repwd,

					}
				};

				this.bindToken(basInfo.data,baseStr);//给basInfo绑定accesstoken属性
				basInfo.data = this.paramsPak(basInfo.data);

				axios(basInfo)
				.then(response => {
					if(response.data.error_code === 0){
						this.oldpwd = "";
						this.pwd = "";
						this.repwd = "";
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
<style lang="scss">
	.loginPwd2 {
		position: absolute;
		width: 100%;
		.header {
			text-align: center;
			.left_icon{
				font-size: 25px;
				left: 15px;
				line-height: 25px;
			}
		}
		.content {
			input {
				height: 46px;
				line-height: 46px;
			}
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
				background-color: transparent;
				border: none;
				text-align: left;
				color:#a1968f;
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


