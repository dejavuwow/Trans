<template>
	<transition name="slide-right">
		<div class="register body_wrap"
		v-loading="loading2"
		:element-loading-text="$t('err.tip14')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false">
		<Header :title="$t('findPwd.h1')">
			<router-link to="/login?path=findpwd" slot="left" class="fa fa-angle-left" tag="i"></router-link>
			<i slot="right"></i>
		</Header>
		<div class="upwrap1">			
			<div>
				<div class="input-item">
					<div class="label">{{$t('register.country')}}</div>
					<select name="" id="phone" v-model="country_selected">
						<option v-for="coun in countrys">{{coun}}</option>
					</select>
					<div class="select"><span class="el-icon-arrow-right"></span></div>
				</div>
				<div class="input-item">
					<div class="label">+{{qu_num}}</div>
					<input type="text" :placeholder="$t('findPwd.phone')" v-model="user">
				</div>
				<div class="input-item">
					<div class="label">{{$t('register.code')}}</div>
					<input type="text" :placeholder="$t('findPwd.code')" v-model="verify_code" class="short">
					<Ide @imgMsg="showImg" class="sms-btn"></Ide>
				</div>
				<div class="input-item">
					<div class="label">{{$t('register.code1')}}</div>
					<input type="text" :placeholder="$t('findPwd.code1')" v-model="sms" class="short">
					<button  @click="sendCode()" :class="timer!=null? 'sms-btn1':'sms-btn'">{{info}}</button>
				</div>
			</div>
			<div>
				<button class="register1 btn-gold" @click="updatePwd()">{{$t('findPwd.h1')}}</button>
			</div>
		</div>
	</div>
</transition>
</template>
<script>
	import md5 from "md5";
	import sha1 from "sha1";
	import country from "../../assets/js/config";
	import Header from "../Public/header";
	import Ide from "./idenrun"; 
	export default {
		name: "updatePwd",
		components:{Header,Ide},
		data() {
			return {
				info: this.$t("findPwd.tip1"),
				timer: null,
				count: "",
				user: "",
				verify_code: "",
				url: this.$store.state.url + "Api/Reg/verificationCode",
				ctype: "5",
				sms: "",
				countrys: country.country_cn,
				country_selected: "China-中国-86",
				loading2: false,
				imgTxt:""
			};
		},
		mounted() {},
		computed: {
			type(){
				return  this.$i18n.locale === "zh-CN"?1:2
			},
			qu_num() {
				return this.country_selected.substring(
					this.country_selected.lastIndexOf("-") + 1
					);
			},
			token() {
				return md5(
					localStorage.getItem("uid") + "," +
					localStorage.getItem("loginSign") +","+
					this.user + "," +
					this.sms +"," +
					this.$store.state.str
					);
			},
			token1() {
				return md5(this.type +","+ this.user +"," + this.$store.state.str);
			}
		},
		methods: {
			showImg(txt){
				this.imgTxt = txt; 
			},
			updatePwd() {
				var _this = this;
				var reg = /^\d{5,20}$/;
				if (!reg.test(_this.user)) {
					this.$message({
						message: this.$t("findPwd.tip3"),
						duration: 1500
					});
					return false;
				}
				if (!_this.verify_code) {
					this.$message({
						message: this.$t("findPwd.tip6"),
						duration: 1500
					});
					return false;
				}
				if (!_this.sms) {
					this.$message({
						message: this.$t("findPwd.tip7"),
						duration: 1500
					});
					return false;
				}
				if (_this.verify_code !== this.imgTxt) {
					this.$message({
						message: this.$t("findPwd.tip10"),
						duration: 1500
					});
					return false;
				}
				this.$http
				.post(
					this.$store.state.url + "api/user/retrievePassword",
					{
						uid:localStorage.getItem("uid"),
						loginSign:localStorage.getItem("loginSign"),
						phone:_this.user,
						code: _this.sms,
						accessToken: _this.token
					},
					{
						headers: {},
						emulateJSON: true
					}
					)
				.then(response => {
					this.loading2 = false;
					if (response.data.error_code === 0) {
						_this.user = "";
						_this.verify_code = "";
						_this.sms = "";
						_this.info = _this.$t("findPwd.tip1");
						clearInterval(_this.timer);
						_this.timer = null;
						_this.$router.push({
							path: "/resetPwd",
							query: { user: _this.com_user }
						});
						_this.user = "";
					}else {
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
					console.log(response);
				});
			},
			sendCode() {
				var _this = this;
				var reg = /^\d{5,20}$/;
				if (!reg.test(_this.user)) {
					this.$message({
						message: this.$t("register.tip8"),
						duration: 1500
					});
					return false;
				}
				if (!_this.timer) {
					_this.$http
					.post(
						_this.$store.state.url + "api/code/getcode",
						{
							type: _this.type,
							phone:_this.user,
							accessToken: _this.token1
						},
						{
							headers: {},
							emulateJSON: true
						}
						)
					.then(response => {
						if (response.data.error_code === 0) {
							this.$message({
								message: this.$t("register.tip9"),
								duration: 1500
							});
							var TIME_COUNT = 60;
							if (!this.timer) {

								this.count = TIME_COUNT;
								this.timer = setInterval(() => {
									if (this.count > 0 && this.count <= TIME_COUNT) {
										this.count--;
										this.info =
										this.$t("findPwd.tip2") + "(" + this.count + "s)";
									} else {
										this.info = this.$t("findPwd.tip2");
										clearInterval(this.timer);
										this.timer = null;
									}
								}, 1000);
							}
						} else {
							this.$message({
								message: response.data.data[this.msgType],
								duration: 1500
							});
						}
					})
					.catch(function(response) {
						this.$message({
							message: this.$t("err.info"),
							duration: 1500
						});
						console.log(response);
					});
				}
			},
			back() {
				this.$router.push({ name: "login", params: { t: "2" } });
			}
		}
	};
</script>
<style lang="less">
	.register {
		position: absolute;
		z-index: 99;
		.upwrap1{
			padding:0 15px;
		}
		h1 {
			font-size: 16px;
			margin-bottom: 20px;
			line-height: 40px;
		}
		input {
			margin: 0;
			padding: 15px 0;
			width: 65%;
			text-align: left;
			border: none;
			color: #d6e9fc;
		}
		.line {
			height: 1px;
			background-color: #898f8f;
			margin: 20px 0px;
		}
		.login1 {
			background-color: #898f8f;
			border: 1px solid #898f8f;
			color: #feffff;
			opacity: 0.8;
		}
		.short {
			width: 25%;
		}
		.input-item {
			border-bottom: 1px solid #44352f;
			white-space: nowrap;
			height: 46px;
		}
		.label {
			display: inline-block;
			width: 35%;
			color: #97989a;
			line-height: 46px;
		}
		.img {
			width: 30%;
			vertical-align: middle;
			float: right;
			height: 36px;
			margin-top: 5px;
		}
		.select {
			display: inline-block;
			width: 5%;
			float: right;
			text-align: right;
			vertical-align: middle;
			line-height: 46px;
			margin-right: 5px;
			span {
				font-size: 18px;
				color: rgb(255, 195, 52);
			}
		}
		select::-ms-expand {
			display: none;
		}
		#phone {
			width: 55%;
			background: none;
			border: none;
			height: 36px;
			color: #d6e9fc;
			appearance: none;
			-moz-appearance: none;
			-webkit-appearance: none;
			outline: none;
		}
		.sms-btn {
			display: inline-block;
			width: 28%;
			background-color: rgb(255, 195, 52);
			border-radius: 4px;
			color: rgb(51, 51, 51);
			height: 25px;
			line-height: 36px;
			height: 36px;
			margin-top: 5px;
			float: right;
		}
		.sms-btn1 {
			background-color: rgb(175, 188, 204) !important;
			display: inline-block;
			width: 28%;
			border-radius: 4px;
			color: rgb(51, 51, 51);
			height: 25px;
			line-height: 36px;
			height: 36px;
			margin-top: 5px;
			float: right;
		}
		.btn-gold {
			margin-top: 50px;
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
	.register .half button {
		width: 48%;
		float: right;
	}
	.register .intl-tel-input.allow-dropdown input,
	.intl-tel-input.allow-dropdown input[type="text"] {
		padding-left: 0 !important;
	}
	.intl-tel-input {
		display: block !important;
		margin-bottom: 20px;
	}
	.intl-tel-input .country-list .country-name {
		color: rgb(0, 0, 0);
	}
</style>
