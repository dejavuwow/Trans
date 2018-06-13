<template>
	<transition :name="transitionName">
		<div class="body_wrap">
			<Header :title="title">
				<i slot="left" class="fa fa-angle-left"></i>
				<i slot="right"></i>
			</Header>
			<div class="contwrap" ref="wrap">
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
			</div>
		</div>
	</transition>
</template>
<script>
	import axios from "axios";
	import md5 from "md5";
	import Header from '../Public/header';
	import IScroll from 'iscroll/build/iscroll-probe';
	export default {
		components:{Header},
		data() {
			return {
				transitionName:"",
				title:this.$t('note.title'),
				list:[],
				scroll:{
					display:false,
					loadtext:this.$t('scroll.up'),
					page:0,
				},
			};
		},
		methods: {
			iScrollClick(){
				if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
				if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
				if (/Silk/i.test(navigator.userAgent)) return false;
				if (/Android/i.test(navigator.userAgent)) {
					var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
					return parseFloat(s[0]+s[3]) < 44 ? false : true
				}
			},
			//定义深度拷贝对象方法
			deepCopy(obj,arr={}){
				for(let i in obj){
					if(typeof obj[i] === 'object' ){
						arr[i] = obj[i].constructor === Array?[]:{};
						this.deepCopy(obj[i],arr[i]);
					}else{
						arr[i] = obj[i];
					}
				}
				return arr;
			}
		},
		computed: {
		},
		created() {
			this.transitionName = this.$route.query.path === "notice"?"slide-left":"slide-right";

			let [uid,loginSign] = [localStorage.getItem("uid"),localStorage.getItem("loginSign")];
			let baseStr = this.$store.state.str;
			
			let basInfo = {
				method:"post",
				url: this.$store.state.url+"api/Article/getArticleList",
				data:{
					uid,
					loginSign,
				}
			};
			
			this.bindToken(basInfo,baseStr);//给basInfo绑定accesstoken属性

			let info = this.deepCopy(basInfo);

			info.data = this.paramsPak(info.data);
			axios(info)
			.then((response) => {
				if(response.data.error_code == 0){
					this.list = response.data.data.data;
				}
			})
			.then(() => {
				//请求数据更新视图完成后初始化Iscroll
				setTimeout(()=>{
					this.myscroll=new IScroll(this.$refs.wrap,{
						click:this.iScrollClick(),
						scrollbars: true,
						mouseWheel: false,
						probeType:2,
						scrollbars: 'custom',
						fadeScrollbars:true,
						shrinkScrollbars:'clip'
					});
					document.addEventListener('touchmove', function(e) {  
						e.preventDefault();  
					}, {passive:false,capture:false})

					//绑定this环境,定义scroll方法
					let scrollFun = this.scrollFun(this);
					this.myscroll.on("scroll",scrollFun);

					//定义scrollEnd方法
					let scrollEnd = this.scrollEnd(this,basInfo);
					this.myscroll.on("scrollEnd",scrollEnd);
				},300);
			})
			.catch((e) => {
				this.$message({
					message: this.$t("err.info"),
					duration: 1500
				});
			})
		},
		beforeRouteLeave(to,from,next){
			this.transitionName = to.path === "/notice"?"slide-left":"slide-right";
			setTimeout(next,50);
		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.notelist{
		padding:0 15px;
		li{
			border-bottom: 1px solid $linecolor;
			color:#ccc;
			span{
				display: block;
				line-height: 0.7rem;
				@extend %textstyle;
				white-space: nowrap;
			}
			i{
				display: block;
				text-align: right;
				@include fl(0.25rem,0.5rem,$timecolor);
			}
		}
		
	}
</style>


