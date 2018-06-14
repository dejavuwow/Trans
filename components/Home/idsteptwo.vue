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
							<div class="msg">上传证件</div>  
							<div ></div>
							<div >完善信息</div>   
						</div>
					</div>
                    <div class="tip">
                        <p>温馨提示:</p>
                        <p>每张图片大小不能超过5MB，请按照下列要求拍照上传。</p>
                    </div>
                    <p class="tip_p">•请上传清晰的身份证正面照片，拍照时确保无反光、无遮挡</p>
                    <div class="imageFileInput">
                        <i class="iconfont icon-scanwebiconcanmera ts-iconfont"></i>
                        <input class="fileInput" type="file" id="" name="">
                    </div>
                    <p class="tip_p">•请上传清晰的身份证正面照片，拍照时确保无反光、无遮挡</p>
                    <div class="imageFileInput">
                        <i class="iconfont icon-scanwebiconcanmera ts-iconfont"></i>
                        <input class="fileInput" type="file" id="" name="">
                    </div>
                    <p class="tip_p">•请上传清晰的手持身份证照片，需免冠，五官清晰可见，建议未化妆，完全露出双臂（如下图所示）</p>
                    <div class="img">
                        <img src="../../assets/img/id.jpg">
                    </div>
					<p class="tip_p">•请确保身份证中的信息清晰可见，否则无法通过审核。</p>
                    <div class="imageFileInput">
                        <i class="iconfont icon-scanwebiconcanmera ts-iconfont"></i>
                        <input class="fileInput" type="file" id="" name="">
                    </div>
                    <div class="tip">
                        <i class="iconfont icon-finish ts-iconfont"></i>
                        <span>点击确认上传按钮，即代表您承诺以上的所有证件、资料、信息均为本人合法所有，且真实有效。</span>
                    </div>
					<div class="id_btn">
						<button class="btn">确认上传</button> 
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
  // methods: {
  // 	iScrollClick(){
  // 		if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
  // 		if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
  // 		if (/Silk/i.test(navigator.userAgent)) return false;
  // 		if (/Android/i.test(navigator.userAgent)) {
  // 			var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
  // 			return parseFloat(s[0]+s[3]) < 44 ? false : true
  // 		}
  // 	},
  // 	//定义深度拷贝对象方法
  // 	deepCopy(obj,arr={}){
  // 		for(let i in obj){
  // 			if(typeof obj[i] === 'object' ){
  // 				arr[i] = obj[i].constructor === Array?[]:{};
  // 				this.deepCopy(obj[i],arr[i]);
  // 			}else{
  // 				arr[i] = obj[i];
  // 			}
  // 		}
  // 		return arr;
  // 	}
  // },
  // computed: {
  // },
  // created() {
  // 	this.transitionName = this.$route.query.path === "notice"?"slide-left":"slide-right";

  // 	let [uid,loginSign] = [localStorage.getItem("uid"),localStorage.getItem("loginSign")];
  // 	let baseStr = this.$store.state.str;

  // 	let basInfo = {
  // 		method:"post",
  // 		url: this.$store.state.url+"api/Article/getArticleList",
  // 		data:{
  // 			uid,
  // 			loginSign,
  // 		}
  // 	};

  // 	this.bindToken(basInfo,baseStr);//给basInfo绑定accesstoken属性

  // 	let info = this.deepCopy(basInfo);

  // 	info.data = this.paramsPak(info.data);
  // 	axios(info)
  // 	.then((response) => {
  // 		if(response.data.error_code == 0){
  // 			this.list = response.data.data.data;
  // 		}
  // 	})
  // 	.then(() => {
  // 		//请求数据更新视图完成后初始化Iscroll
  // 		setTimeout(()=>{
  // 			this.myscroll=new IScroll(this.$refs.wrap,{
  // 				click:this.iScrollClick(),
  // 				scrollbars: true,
  // 				mouseWheel: false,
  // 				probeType:2,
  // 				scrollbars: 'custom',
  // 				fadeScrollbars:true,
  // 				shrinkScrollbars:'clip'
  // 			});
  // 			document.addEventListener('touchmove', function(e) {
  // 				e.preventDefault();
  // 			}, {passive:false,capture:false})

  // 			//绑定this环境,定义scroll方法
  // 			let scrollFun = this.scrollFun(this);
  // 			this.myscroll.on("scroll",scrollFun);

  // 			//定义scrollEnd方法
  // 			let scrollEnd = this.scrollEnd(this,basInfo);
  // 			this.myscroll.on("scrollEnd",scrollEnd);
  // 		},300);
  // 	})
  // 	.catch((e) => {
  // 		this.$message({
  // 			message: this.$t("err.info"),
  // 			duration: 1500
  // 		});
  // 	})
  // },
  // beforeRouteLeave(to,from,next){
  // 	this.transitionName = to.path === "/notice"?"slide-left":"slide-right";
  // 	setTimeout(next,50);
  // }
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
  background-color: #f39902;
  border-radius: 20px;
  text-align: center;
  color: white;
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
.tip{
    margin-top:20px;
    margin-bottom: 20px;
    color: #786f6a;
    margin-left: 10px;
    i{
        color: #f39902;
    }
}
.tip_p{
    margin-top:20px;
    margin-bottom: 20px;
    color: #f39902;
    margin-left: 10px;
    font-size: 0.25rem;
}
.imageFileInput{
    width: 100px;
    height: 100px;
    position: relative;
    background-color: white;
    border-radius: 10px; 
    margin:  0 auto;
    .iconfont{
        font-size: 1rem;
        margin-left: 22px;
        line-height: 100px;
        color: #c1b7b0;
    }

}
.fileInput{
    width: 100px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
}
.img{
    width: 100%;
    img{
        width: 100%;
        // height: 200px;        
    }
}
</style>


