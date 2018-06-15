<template>
	<transition :name="transitionName">
		<div class="body_wrap">
			<Header :title="title">
				<i slot="left" class="fa fa-angle-left"></i>
				<i slot="right"></i>
			</Header>
			<!-- <div class="contwrap" ref="wrap">
				<div class="maincontent">
					<ul class="notelist">
						<router-link v-for="(item,index) in list" :to="{path:'/notice',query:item}" tag="li" :key="index">
							<span v-if="$i18n.locale === 'zh-CN'">{{item.title_ch}}</span>
							<span v-else>{{item.title_en}}</span>
							<i>{{item.create_time}}</i>
						</router-link>
					</ul>
					<div class="up" v-show="scroll.display">{{scroll.loadtext}}</div>
				</div>	
			</div> -->
			<div class="all">
				<div class="all_wrap">
					<div class="id_all">
						<div class="id_top">
							<div class="top_first">1</div>
							<div class="top_second"></div>
							<div class="top_third">2</div>  
							<div class="top_fourth"></div>
							<div class="top_fifth">3</div>   
						</div>  
						<div class="id_top1">
							<div class="msg">基础信息</div>
							<div ></div>
							<div >上传证件</div>  
							<div ></div>
							<div >完善信息</div>   
						</div>
					</div>
					<div class="name">
						<span class="na">姓名</span>
						<div class="na_text">
							<input type="text" placeholder="请输入姓名">
						</div>
					</div> 
					<div class="country">
						<span class="na">国家/地区</span>
						<div class="na_text">China-中国</div>
					</div>  
					<div class="country">
						<span class="na">证件类型</span>
						<div class="na_text">身份证</div>
					</div>
					<div class="number">
						<span class="na">证件号码</span>
						<div class="na_text">
							<input type="text" placeholder="请输入身份证号码">
						</div>
					</div>  
					<div class="country">
						<span class="na">性别</span>
						<div class="na_text">男</div>
					</div>
					<div class="number">
						<span class="na">出生日期</span>
						<div class="na_text">
							<input type="text" placeholder="格式：19920101">
						</div>
					</div>  
					<div class="number">
						<span class="na">职业</span>
						<div class="na_text">
							<input type="text" placeholder="请输入职业类型">
						</div>
					</div>
					<div class="number">
						<span class="na">常用地址</span>
						<div class="na_text">
							<input type="text" placeholder="请输入常用地址">
						</div>
					</div> 
					<div class="id_btn">
						<button class="btn">确认提交</button> 
					</div>                               
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import axios from "axios";
import md5 from "md5";
import Header from "../Public/header";
import IScroll from "iscroll/build/iscroll-probe";
export default {
	components: { Header },
	data() {
		return {
			transitionName: "",
			// title:this.$t('note.title'),
			title: "实名认证",
			list: [],
			scroll: {
				display: false,
				loadtext: this.$t("scroll.up"),
				page: 0
			}
		};
	}
};
</script>
<style lang="scss">
@import "../../assets/sass/index.scss";
.all{
	width: 100%;
	@include position(top,bottom,.9rem,0);
	overflow:auto;
}
.id_all {
	border-top: 1px solid #44352f;
	border-bottom: 1px solid #44352f;
	width: 100%;
	height: 90px;
	background-color: #333333;
}
.id_top {
	width: 85%;
	height: 60%;
	display: flex;
	justify-content: space-around;
	padding-top: 10px;
	margin-left: 30px;
}
.id_top1 {
	width: 95%;
	height: 60%;
	display: flex;
	justify-content: space-around;
	margin-left: 13px;
	color: #a1968f;
	font-size: 0.3rem;
	margin-top: -10px;
}
.msg {
	color: #f39902;
}
.top_first {
	width: 40px;
	height: 40px;
	background-color: #f39902;
	border-radius: 20px;
	text-align: center;
	color: white;
	font-size: 0.5rem;
	line-height: 40px;
}
.top_second {
	width: 80px;
	height: 1px;
	background-color: #f39902;
	margin-top: 20px;
}
.top_third {
	width: 40px;
	height: 40px;
	background-color: #a1968f;
	border-radius: 20px;
	text-align: center;
	color: #1d1c1c;
	font-size: 0.5rem;
	line-height: 40px;
}
.top_fourth {
	width: 80px;
	height: 1px;
	background-color: #a1968f;
	margin-top: 20px;
}
.top_fifth {
	width: 40px;
	height: 40px;
	background-color: #a1968f;
	border-radius: 20px;
	text-align: center;
	color: #1d1c1c;
	font-size: 0.5rem;
	line-height: 40px;
}
.name {
	width: 90%;
	height: 60px;
	color: #786f6a;
	font-size: 0.35rem;
	border-bottom: 1px solid #44352f;
	margin-left: 20px;
	line-height: 60px;
	display: inline-block;
}
.na {
	width: 130px;
	height: 60px;
	float: left;
}
.na_text {
	float: left;
}
.na_text input {
	font-size: 0.3rem;
}
.country {
	width: 90%;
	height: 60px;
	color: #786f6a;
	font-size: 0.35rem;
	border-bottom: 1px solid #44352f;
	margin-left: 20px;
	line-height: 60px;
	display: inline-block;
	.na_text {
		color: white;
	}
}
.number {
	width: 90%;
	height: 60px;
	color: #786f6a;
	font-size: 0.35rem;
	border-bottom: 1px solid #44352f;
	margin-left: 20px;
	line-height: 60px;
	display: inline-block;
}
.id_btn {
	width: 100%;
	height: 200px;
}
.btn {
	height: 50px;
	width: 93%;
	background-color: #f39902;
	font-size: 0.3rem;
	border-radius: 5px;
	margin-left: 15px;
}
</style>


