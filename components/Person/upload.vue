<template>
	<!-- <transition name="slide-right"> -->
	<div class="upload">
		<div class="header">       
			<h1>
				<span class="left_icon" @click="jumpBack()">&#xe625;</span>
				{{$t('certify.tip4')}}
			</h1>
		</div>
		<div class="steps" 
		v-loading="loading2"
		:element-loading-text="$t('err.tip14')"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)"
		:fullscreen="false">
		<div class="step">
			<div class="first">
				<span>1</span>
			</div>
			<div class="line"></div>
			<div class="first">
				<span>2</span>
			</div>
			<div class="line second"></div>
			<div class="first second">
				<span>3</span>
			</div>
		</div>
		<div class="info">
			<div class="gold">{{$t('certify.tip18')}}</div>
			<div class="gold">{{$t('certify.tip19')}}</div>
			<div>{{$t('certify.tip20')}}</div>
		</div>
	</div>
	<div class="wrapper" ref="wrapper">
		<div class="input-content">
			<p>{{$t('certify.tip37')}}</p>
			<p>{{$t('certify.tip38')}}.</p>
			<div class="tips">
				<span></span>
				<div class="tip-info">{{$t('certify.tip39')}}</div>
			</div>
			<div class="inline">
				<div class="c-bottom">
					<form name="form1" id="form1">
						<input type="hidden" value="" name="ptrade_no">
						<div class="upload">
							<input type="file" 
							id='pic'
							name="imgs"
							@change='changeFile($event,this,1)'
							accept="image/*">
							<img :src="url+front" id="showImg" alt="1" v-show="front">
							<i class="fa fa-camera" id="camera"></i>
						</div>
					</form>
				</div>
			</div>
			<div class="tips">
				<span></span>
				<div class="tip-info">{{$t('certify.tip40')}}</div>
			</div>
			<div class="inline">
				<div class="c-bottom">
					<form name="form1" id="form2">
						<input type="hidden" value="" name="ptrade_no">
						<div class="upload">
							<input type="file" 
							id='pic1'
							name="imgs"
							@change='changeFile($event,this,2)'
							accept="image/*">
							<img :src="url+back" id="showImg1" alt="2" v-show="back">
							<i class="fa fa-camera" id="camera1"></i>
						</div>
					</form>
				</div>
			</div>
			<div class="tips">
				<span></span>
				<div class="tip-info">{{$t('certify.tip41')}}</div>
			</div>
			<img src="../../assets/img/id.jpg" alt="" class="modelimg">
			<div class="tips">
				<span></span>
				<div class="tip-info">{{$t('certify.tip42')}}.</div>
			</div>
			<div class="inline">
				<div class="c-bottom">
					<form name="form1" id="form3">
						<input type="hidden" value="" name="ptrade_no">
						<div class="upload">
							<input type="file" 
							id='pic2'
							name="imgs"
							@change='changeFile($event,this,3)'
							accept="image/*">
							<img :src="url+hand" id="showImg2" alt="3" v-show="hand">
							<i class="fa fa-camera" id="camera2"></i>
						</div>
					</form>
				</div>
			</div>
			<p class="confirmcont"><i class="fa fa-check-circle-o iconcheck"></i> {{$t('certify.tip43')}}</p>
			<div class="btn">
				<button type="button" @click="goNext">{{$t('certify.tip44')}}</button>
			</div>
		</div>
	</div>

</div>
<!-- </transition> -->
</template>
<script>
	import axios from "axios";
	import sha1 from "sha1";
	import md5 from "md5";
	import $ from "jquery";
	import BScroll from "better-scroll";
	export default {
		data() {
			return {
				myScroll: null,
				url:this.$store.state.url,
				date: "",
				test3: "11111",
				test2: "1",
				test1: "1",
				timer: null,
				upTrue: "1",
				loading2: false
			};
		},
		computed: {
			front() {
				return this.$store.state.front;
			},
			back() {
				return this.$store.state.back;
			},
			hand() {
				return this.$store.state.hand;
			}
		},
		created() {},
		mounted() {
			if (this.$store.state.front != "") {
				let camera = document.getElementById("camera");
				camera.style.opacity = 0;
			}
			if (this.$store.state.front != "") {
				let camera1 = document.getElementById("camera1");
				camera1.style.opacity = 0;
			}
			if (this.$store.state.front != "") {
				let camera2 = document.getElementById("camera2");
				camera2.style.opacity = 0;
			}
			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.wrapper, {
						click: true
					});
				} else if (!this.$refs.wrapper) {
					return;
				} else {
					this.scroll.refresh();
				}
			});
		},
		methods: {
			jumpBack() {
				this.$store.commit("changeRes", "upload");
				this.$router.push("/certify");
			},
			changeFile(e, i, index) {
				this.loading2 = true;
				var _this = this;
				if (index == 1) {
					let camera = document.getElementById("camera");
					camera.style.opacity = 0;
				} else if (index == 2) {
					let camera = document.getElementById("camera1");
					camera.style.opacity = 0;
				} else {
					let camera = document.getElementById("camera2");
					camera.style.opacity = 0;
				}
				let img = this.img,
				file = e.target,
				reader = new FileReader();
				reader.readAsDataURL(file.files[0]);
				reader.onload = function() {
					if (index == 1) {
						var fdata = new FormData($("#form1")[0]);
					} else if (index == 2) {
						var fdata = new FormData($("#form2")[0]);
					} else {
						var fdata = new FormData($("#form3")[0]);
					}
					axios({
						method: "post",
						dataType: "json",
						url: _this.url+"Api/Authentication/Authentication",
						data: fdata,
						cache: false,
						processData: false,
						contentType: false
					})
					.then(res => {
						_this.loading2 = false;
						if (res.data.status == 1) {
							if (index == 1) {
								_this.$store.commit("changeFront", res.data.info);
							} else if (index == 2) {
								_this.$store.commit("changeBack", res.data.info);
							} else {
								_this.$store.commit("changeHand", res.data.info);
							}
						} else {
							_this.$message({
								message: _this.$t("err.info"),
								duration: 1500
							});
						}
					})
					.catch(err => {
						_this.loading2 = false;
						console.log(err);
					});
				};
			},
			goNext() {
				if (!this.front) {
					this.$message({
						message: this.$t("upload.tip1"),
						duration: 1500
					});
					return false;
				} else if (!this.back) {
					this.$message({
						message: this.$t("upload.tip2"),
						duration: 1500
					});
					return false;
				} else if (!this.hand) {
					this.$message({
						message: this.$t("upload.tip3"),
						duration: 1500
					});
					return false;
				} else {
					this.$router.push("/complete");
				}
			}
		}
	};
</script>

<style lang="less">
	.upload {
		width: 100%;
		height:100%;
		position:absolute;
		.header {
			z-index: 100;
			width: 100%;
			.left_icon {
				top: -7.5px;
				left: 15px;
			}
		}
		.steps {
			background-color: #333;
			width: 100%;
			z-index: 100;
			white-space: nowrap;
			.step {
				padding: 0 45px;
				padding-top:10px;
			}
			.first {
				width: 25px;
				height: 25px;
				background-color: #f1b90c;
				color: black;
				text-align: center;
				border-radius: 50%;
				display: inline-block;
				span {
					line-height: 25px;
					display: inline-block;
					height: 25px;
				}
			}
			.second {
				background-color: rgb(142, 153, 168) !important;
			}
			.line {
				height: 1px;
				background-color: #f1b90c;
				display: inline-block;
				width: 34%;
			}
		}
		.info {
			display: flex;
			padding: 0 30px 5px 30px;
			justify-content: space-between;
			div {
				color: #a3aab4;
			}
			.gold {
				color: #f1b90c;
			}
		}
		.wrapper {
			overflow: hidden;
			position: absolute;
			top:104px;
			bottom:0;
		}
		.btn {
			padding: 30px 15px;
			width: 100%;
			box-sizing: border-box;
			button {
				border-radius: 4px;
				background-color: #f1b90c;
				line-height: 45px;
				color: black;
			}
		}
		.input-content {
			white-space: nowrap;
			padding: 0 15px;
			padding-top:10px;
			min-height: 101%;
			p {
				color: #a1968f;
				margin-bottom: 5px;
				word-break: break-all;
				white-space: normal;
				.iconcheck{
					color:#f1b90c;
				}
			}
			.confirmcont{
				margin-top:30px;
			}
			.tips {
				position: relative;
				span {
					display: inline-block;
					width: 5px;
					height: 5px;
					background-color: #f1b90c;
					border-radius: 50%;
					position: absolute;
					top: 23px;
				}
				.tip-info {
					color: #f1b90c;
					font-size: 12px;
					display: inline-block;
					margin-top: 15px;
					word-break: break-all;
					width: 100%;
					white-space: normal;
					margin-left: 10px;
				}
			}
		}
		.inline {
			width:8rem;
			display: block;
			margin-top: 10px;
			margin-left:auto;
			margin-right:auto;
		}
		.c-bottom {
			text-align: left;
			p {
				margin: 0 1.5rem;
				line-height: 20px;
				color: rgb(234, 0, 114);
				font-size: 14px;
				font-weight: 400;
				margin-bottom: 1rem;
			}
			.btn {
				text-align: center;
				margin: 0 1.5rem;
				height: 38px;
				font-size: 14px;
				line-height: 38px;
				border-radius: 3px;
				background-color: rgb(116, 167, 0);
			}
			.btn_ {
				text-align: center;
				margin: 1.5rem 1.5rem;
				height: 38px;
				font-size: 14px;
				line-height: 38px;
				border-radius: 3px;
				background-color: rgb(234, 0, 114);
			}
			.upload {
				padding: 1.5rem;
				width: 5rem;
				height: 5rem;
				background-color: white;
				text-align: center;
				position: relative;
				border-radius:4px;
				input {
					left: 0;
				}
				#showImg,
				#showImg1,
				#showImg2 {
					width: 8rem;
					height: 8rem;
					position: absolute;
					top: 0;
					left: 0;
				}
				#pic,
				#pic1,
				#pic2 {
					display: inline-block;
					width: 8rem !important;
					height: 8rem !important;
					opacity: 0;
					position: absolute;
					z-index: 101;
					top: 0;
				}
				.fa-camera {
					font-size: 24px;
					color: rgb(137, 143, 143);
					position: absolute;
					top: 3rem;
					left: 3rem;
					z-index: 100;
				}
			}
		}
	}
	.modelimg{
		width:100%;
		height:auto;
		display: block;
		margin-top:10px;
	}
</style>
