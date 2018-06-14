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
					<div class="tips">
                        <p>风险提示告知</p>
                        <span>APV等数字货币交易为7X24小时连续交易。请综合考虑自身的投资经历、财务状况、风险承受能力等因素，充分了解诺一股等数字货币交易特性和风险的前提下，慎重、理性投资，避免因盲目投资而带来的损失。
                        </span>
                        <div class="radio">
                            <div>
                                <input type="radio" name="agree">本人同意
                            </div>
                            <div>
                                <input type="radio" name="agree">本人不同意
                            </div>
                        </div>
                    </div> 
                    <div class="tips">
                        <p>法律告知</p>
                        <span>您承诺以上提供的所有证件、资料、信息均为本人合法所有，且真实有效。若验证过程中发现证件、资料、信息均为冒用、虚假、伪造，或存在此等风险的，APV交易平台有权不经事先通知即冻结关联账户，并向公安机关举报。
                        </span>
                        <div class="radio">
                            <div>
                                <input type="radio" name="agree1">本人同意
                            </div>
                            <div>
                                <input type="radio" name="agree1">本人不同意
                            </div>
                        </div>
                    </div>     
                    <div class="tips">
                        <span class="myspan">根据“反洗钱法”及相关规定，APV交易平台可能在注册、充值、交易、提现等过程中向您了解资金来源及资金流向，若您拒绝告知或虚假陈述，APV交易平台有权不再另行通知即冻结您的账户。
                        </span>
                        <div class="radio">
                            <div>
                                <input type="radio" name="agree2">本人同意
                            </div>
                            <div>
                                <input type="radio" name="agree2">本人不同意
                            </div>
                        </div>
                        <div class="up_btn">
						    <button class="btn">确认风险提示</button> 
					    </div>
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
//   border-bottom: 1px solid #44352f;
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
  color: #f39902;
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
  color: #1d1c1c;
  font-size: 0.5rem;
  line-height: 40px;
  color: white;
}
.top_fourth {
  width: 80px;
  height: 1px;
  background-color: #f39902;
  margin-top: 20px;
}
.top_fifth {
  width: 40px;
  height: 40px;
  background-color: #f39902;
  border-radius: 20px;
  text-align: center;
  color: #1d1c1c;
  font-size: 0.5rem;
  line-height: 40px;
  color: white;
}
.tips{
    width: 97%;
    height: 220px;
    border-top: 1px solid #44352f;
    p{
        text-align: center;
        color: #a1968f;
        font-size: 0.35rem;
        padding: 20px 0px;
    }
    span{
        display: inline-block;
        margin-left: 10px;
        color: #a1968f;
        font-size: 0.28rem;
    }
    .radio{
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        font-size: 0.3rem;

    }
    .up_btn {
        width: 100%;
        height: 100px;
        margin-top: 10px;
        margin-left: 5px;
        .btn {
            height: 50px;
            width: 93%;
            background-color: #f39902;
            font-size: 0.3rem;
            border-radius: 5px;
            margin-left: 15px;
        }
    }
}
.myspan{
    margin-top: 20px;
}




</style>


