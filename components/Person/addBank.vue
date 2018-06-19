<template>
	<transition name="slide-right">
		<div class="body_wrap order_wrap">
			<Header :title="title">
				<router-link to="/creditCard?path=addBank" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap" ref="wrap">
				<div class="maincontent bank_inp">
					<div class="list_it">
						<div>{{$t('bank.tip7')}}：</div>
						<span v-for="(item,index) in typeList">
							<input type="radio"  name="item.value" :value="item.value" v-model="activeType">{{item.text}}
						</span>
					</div>
					<Inp v-for="(item,index) in inpList" :inputData="item" @input="writeVal" :key="index" v-if="item.actype.includes(activeType)">
					</Inp>
					<div class="upload_wrap" v-if="activeType!=0">
						<label>{{$t('bank.qrcode')}}</label>
						<div class="mixwrap">
							<span class="fa fa-picture-o" v-show="preview == ''"></span>
							<input type="file" name="" @change="view($event)">
							<img :src="preview" alt="" v-if="preview" @load="revoke" @click='display=true'>
						</div>
					</div>
					<button type="" class="confirm" @click="add">添加</button>
				</div>
			</div>
			<transition enter-active-class = "animated zoomIn" leave-active-class = "animated zoomOut">
				<div class="coverzoom" @click="display=false" v-show="display">
					<img :src="preview" alt="">
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
	import Header from '../Public/header';
	import Inp from '../Public/Inp';
	import axios from "axios";
	import md5 from "md5";
	import IScroll from 'iscroll/build/iscroll-probe';
	export default {
		name:"addbank",
		components:{Header,Inp},
		data(){
			return{
				display:false,
				title:this.$t('bank.tip2'),
				typeList:[
				{value:0,text:this.$t('bank.type[0]')},
				{value:1,text:this.$t('bank.type[1]')},
				{value:2,text:this.$t('bank.type[2]')},
				],
				inpList:[
				{placeholder:this.$t('bank.bankname'),type:"text",name:"bankname",value:"",actype:[0]},
				{placeholder:this.$t('bank.cardname'),type:"text",name:"cardname",value:"",actype:[0,1,2]},
				{placeholder:this.$t('bank.cardnumber'),type:"text",name:"cardnumber",value:"",actype:[0,1,2]},
				{placeholder:this.$t('bank.deposit'),type:"text",name:"deposit",value:"",actype:[0]},
				],
				activeType:0,
				preview:"",
				qrcodeImg:"",
			}
		},
		computed:{
		},
		mounted(){

		},
		methods:{
			//根据子组件中name属性确定更新主组件中的input的value
			writeVal(data){
				for(let i of this.inpList){
					if(i.name === data.name) i.value = data.value;
				}
			},

			//预览上传图片
			view(e){
				this.preview = URL.createObjectURL(e.target.files[0]);
				this.qrcodeImg = e.target.files[0];

			},

			//图片加载后释放url对象
			revoke(){
				URL.revokeObjectURL(this.preview);
			},

			//添加银行卡接口
			add(){
				const info = {
					uid:localStorage.getItem("uid"),
					loginSign:localStorage.getItem("loginSign"),
					type:this.activeType,                         //收款账户类型
					bankname:this.inpList[0].value,            //银行名称
					cardname:this.inpList[1].value,            //收款人姓名
					cardnumber:this.inpList[2].value,          //收款人账号
					deposit:this.inpList[3].value,             //开户行
					qrcode:this.qrcodeImg					   //支付宝或微信的二维码收账图片
				};
				let formdata = new FormData();					//用formdata传参
				for(let i of Object.entries(info)){
					formdata.append(i[0],i[1]);
				}
				axios({
					method:"post",
					url: this.$store.state.url+"api/File/bankAdd",
					data:formdata
				})
				.then(response => {
					this.$message({
						message: response.data.data[this.msgType],
						duration: 1500
					});
					if(response.data.error_code ===0){
						this.$router.push("/creditCard?path=addBank");
					}
				})
			}
		},
		watch:{
			//切换单选按钮清空表单数据
			activeType(){
				for(let i of this.inpList){
					i.value = "";
				}
				this.preview = "";
				this.qrcodeImg = "";
			}
		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.list_it{
		div{
			display: inline-block;
		}
		span{
			display: inline-block;
			width:25%;
			@include fl(16px,21px,$fontcolor);
			input{
				vertical-align:middle;
			}
		}
	}
	.bank_inp{
		padding:15px;
		.inp_wrap input{
			color:$fontcolor;
			border:none;
			border-bottom:1px solid $linecolor;
			width:100%;
			height:.8rem;
		}
	}
	.upload_wrap{
		padding-top:20px;
		.mixwrap{
			height:2rem;
			width:2rem;
			margin:10px auto;
			position:relative;
			input{
				width:100%;
				height:100%;
				opacity:0;
				z-index:999;
			}
			span{
				@extend img;
				display: block;
				z-index:0;
				opacity:1;
				font-size:2rem;
			}
			img{
				width:100%;
				height:100%;
				@include position(top,left,0,0);
			}
		}
	}
	.coverzoom{
		width:100%;
		height:100%;
		@include position(left,top,0,0);
		background:rgba(0,0,0,0.7);
		@include flex(column,center);
		align-items: center;
		img{
			width:50%;
			height:auto;
		}
	}
	.confirm{
		background:$btncolor;
		width:100%;
		border-radius: 4px;
		margin-top:20px;
	}
</style>


