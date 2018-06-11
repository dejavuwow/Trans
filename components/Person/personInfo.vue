<template>
	<transition :name="animate">
		<div class="person-infode"
		v-loading="loading2"
		:element-loading-text="loadtext1"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false"
		>
		<div class="header">
			<span class="left_icon" @click="goBack()">&#xe625;</span>
			<span class="title">{{$t('info.tip')}}</span>
		</div>
		<div class="info-content">
			<div class="bar">
				<div>{{$t('info.tip1')}}</div>
				<div class="pic">
					<i v-show="!picurl"> &#xe65c;</i>   
					<img :src="headpic" alt="" v-show="headpic">	
					<input type="file" @change="view($event)">
					<button type="" v-show="isChange" @click="save">{{$t('editInfo.save')}}</button>
				</div>
			</div>
			<div class="bar-short">
				<div>{{$t('info.tip2')}}</div>
				<div class="info">{{user.substring(0,5)}}****{{user.substring(9,14)}}</div>
			</div>
			<div class="bar-short" @click="editInfo">
				<div>{{$t('info.tip3')}}</div>
				<div class="info">{{nickname}}</div>
			</div>
		</div>
		<router-link to="/credit">
			<div class="bar-short credit">
				<div>{{$t('info.tip6')}}</div>
				<div class="info"><span class="fa fa-angle-right"></span></div>
			</div>
		</router-link>
	</div>
</transition>
</template>

<script>
	"use strict";
	import axios from "axios";
	import sha1 from "sha1";
	export default {
		data() {
			return {
				loadtext1:this.$t("headpic['4']"),
				animate: "slide-right",
				user:this.$store.state.user,
				nickname:"",
				headpic:"",
				picurl:"",
				url:this.$store.state.url,
				isChange:false,
				formData:"",
				loading2:false

			};
		},
		beforeRouteLeave(to, from, next) {
			if (to.path == "/mail") {
				this.animate = "slide-left";
			} else {
				this.animate = "";
			}
			if(to.path=='/Person'){
				this.$store.commit("changeRes", "info");
			}
			setTimeout(function() {
				next();
			}, 50);
		},
		created() {
			var _this = this;
			if (this.$store.state.urlRes == "credit") {
				this.animate = "slide-left";
			}
			var params = new URLSearchParams();
			params.append("member_id",this.$store.state.member_id);
			params.append("token",sha1(this.$store.state.member_id + _this.$store.state.str));
			axios.post(_this.$store.state.url + "Api/PersonalCenter/personalNick", params, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
				}
			})
			.then(res => {
				_this.nickname = res.data.info.name;
				_this.picurl = res.data.info.head;
				_this.headpic = _this.$store.state.url + res.data.info.head;
			})
			.catch(err => {});
		},
		methods: {
			view(e){
				var th = this;
				var files = e.target.files;
				console.log(files[0].size);
				var fileReader = new FileReader();
				fileReader.readAsDataURL(files[0]);
				fileReader.onload = function(){
					th.headpic = this.result;
					th.isChange = true;
				}
				th.formData = new FormData();
				th.formData.append('file',files[0]);
				th.formData.append("member_id",this.$store.state.member_id);
				
			},
			save(){
				var th = this;
				th.loading2 = true;
				axios({
					method: "post",
					dataType: "json",
					url: th.url+"Api/Authentication/uploadHead",
					data: th.formData,
					cache: false,
					processData: false,
					contentType: false
				})
				.then(res => {
					th.loading2 = true;
					if(Number(res.data.status) == 2){
						th.$message({
							message: th.$t("headpic['2']"),
							duration: 1500
						});
					}else if(Number(res.data.status) == 3){
						th.$message({
							message: th.$t("headpic['3']"),
							duration: 1500
						});
					}else{
						th.isChange = false;

					}
					th.loading2 = false;	
				})
				.catch(err => {
					console.log(err);
				});
			},
			goBack() {
				this.$store.commit("changeRes", "info");
				this.$router.push("/Person");
			},
			editInfo(){
				var th = this;
				plus.nativeUI.prompt(this.$t('editInfo.cont'), function(e){
					if(e.index==1) return;
					var params = new URLSearchParams();
					params.append("member_id",th.$store.state.member_id);
					params.append("name",e.value);
					params.append("token",sha1(th.$store.state.member_id + e.value + th.$store.state.str));
					plus.nativeUI.showWaiting();
					axios.post(th.$store.state.url + "Api/PersonalCenter/updatePersonalNick", params, {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
						}
					})
					.then(res => {
						plus.nativeUI.closeWaiting();
						th.nickname = e.value;
					})
					.catch(err => {});

				}, 
				this.$t('editInfo.title'),
				this.$t('editInfo.tips'));
			}

		}
	};
</script>

<style lang="less">
	.person-infode {
		position: absolute;
		width: 100%;
		height:100%;
		background:linear-gradient(0deg,#352c25 0,#1d1c1c 100%);
		.header {
			text-align: center;
			padding-left: 15px;
			box-sizing: border-box;
			.left_icon {
				font-size: 25px;
				position: absolute;
				left: 15px;
				line-height: 25px;
			}
			.title {
				line-height: 25px;
				font-size: 1.8rem;
			}
		}
		.info-content {
			color: #d6e9fc;
			.bar {
				display: flex;
				line-height: 90px;
				padding: 0 15px;
				justify-content: space-between;
				overflow: hidden;
				align-items: center;
				border-bottom: 1px solid  #44352f;
				.pic {
					font-family: "user";
					color: #a3aab4;
					position:relative;
					height:118px;
					width:50px;
					i{
						font-size: 50px;
						display: inline-block;
						vertical-align: middle;
						line-height: 118px;
					}
					input{
						width:50px;
						height:100%;
						position:absolute;
						top:0;
						left:0;
						opacity: 0.01;
					}
					img{
						width:50px;
						height:50px;
						position:absolute;
						top:50%;
						transform: translateY(-50%);
						display: block;
					}
					button{
						line-height:20px; 
						text-align: center;
						width:50px;
						height:20px;
						border-radius:3px;
						position:absolute;
						background: #f1b90c;
						bottom:5px;
					}
				}
			}
		}
		.bar-short {
			display: flex;
			line-height: 45px;
			padding: 0 15px;
			justify-content: space-between;
			border-bottom: 1px solid #44352f;
			div{
				color: #d6e9fc;
			}
			.info {
				color: #d6e9fc;
				display: flex;
				.fa {
					font-size: 20px;
					align-self: center;
					margin-left: 5px;
				}
			}
		}
	}
</style>
