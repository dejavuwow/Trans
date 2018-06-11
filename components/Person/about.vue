<template>
	<transition :name="animate">
		<div class="aboutmain">
			<div class="header">
				<router-link to="/setting?path=about" class="left_icon" tag="span">&#xe625;</router-link>
				<span class="title">{{$t('setting.tip3')}}</span>
			</div>
			<div class="article_wrap">
				<div class="h1">
					{{title}}
				</div>
				<div class="time">
					{{time | time}}
				</div>
				<div class="content">
					<img :src="$store.state.url+img" alt="">
				</div>
				<div class="info">
					{{content}}
				</div>
			</div>
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
				animate: "slide-right",
				title:"",
				content:"",
				img:"",
				time:"",
			};
		},
		mounted(){
			var _this = this;
			var params = new URLSearchParams();
			params.append("type","2");
			params.append("token",sha1("2" + _this.$store.state.str));
			axios.post(_this.$store.state.url + "Api/Home/noticeList", params, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
				}
			})
			.then(res => {
				_this.img = res.data.info[0].images;
				_this.time = res.data.info[0].add_time;
				if(_this.$i18n.locale == "cn"){
					_this.title = res.data.info[0].title;
					_this.content = res.data.info[0].content;
				}else{
					_this.title = res.data.info[0].title_en;
					_this.content = res.data.info[0].content_en;
					
				}
			})
			.catch(err => {});
		}
	};
</script>

<style lang="less">
	.aboutmain {
		position: absolute;
		width: 100%;
		height:100%;
		.header {
			text-align: center;
			padding-left: 15px;
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
		.article_wrap{
			width:100%;
			padding:0 10px;
			box-sizing: border-box;
			.h1 {
				padding: 8px 15px;
			}
			.content {
				padding: 15px;
				img {
					width: 100%;
				}
			}

			.time {
				color: #5b6172;
				padding-left: 15px;
			}
			.info {
				padding: 15px;
			}
		}
	}

</style>
