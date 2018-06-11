<template>
	<transition :name="animate">
		<div class="home">
			<div class="header">
				<div class="select">
					<span class="news" @click="goTips"></span>
					APV
					<router-link to="/service">
						<span class="servicemsg">
							<span class="red-o kefu-o" v-show="isKefu=='0'"></span>
						</span>
					</router-link>
					<span class="red-o" @click="goTips" v-show="state=='0'"></span>
				</div>
			</div>
			<div id="wrapper" class="wrapper" ref="wrapper">
				<div class="scroll">
					<div class="home-page">
						<div class="title announce">
							<span class="left">{{$t('note.title')}}：</span>
							<div class="anlist swiper-container" v-if="lang=='cn'">
								<ul class="swiper-wrapper">		
									<li v-for="(item,i) in notes" class="swiper-slide" >{{item.title}}
										<a href="#" @click="goNote(item.images,item.content,item.add_time,item.title)">{{$t('home.tip11')}}</a>
									</li>				
								</ul>
							</div>
							<div class="anlist swiper-container" v-else>
								<ul class="swiper-wrapper">		
									<li v-for="(item,i) in notes" class="swiper-slide" >{{item.title_en}}
										<a href="#" @click="goNote(item.images,item.content_en,item.add_time,item.title_en)">{{$t('home.tip11')}}</a>
									</li>				
								</ul>
							</div>
							
						</div>
						<div class="title">
							<span class="left">{{$t('home.tip')}}：{{currentPrice}}</span>
							<span class="right">{{$t('home.tip1')}}：{{$t('home.tip12')}}</span>
						</div>
						<div class="banner">
							<div class="nav">
								<span>{{$t('home.tip2')}}</span>
								<span>{{$t('home.tip3')}}</span>
								<span>{{$t('home.tip4')}}</span>
								<span>{{$t('home.tip5')}}</span>
							</div>
							<div class="info">
								<span>APV</span>
								<span>{{num*1|xiaoshu2}}</span>
								<span>{{vol*1|xiaoshu2}}</span>
								<span v-if="up>=0" class="up">+{{up*100|xiaoshu2}}%</span>
								<span v-else class="down">{{up*100|xiaoshu2}}%</span>
							</div>
						</div>
						<div class="k_line" id="main">
							<!-- <svg viewBox="0,0,365,220" class="charc"></svg> -->
						</div>
<!-- 						<div class="title else">
							<span class="left">{{$t('home.tip6')}}</span>
						</div> -->
						<div class="make-deal">
							<div class="th">
								<span>{{$t('home.tip7')}}</span>
								<span>{{$t('home.tip8')}}</span>
								<span>{{$t('home.tip9')}}</span>
							</div>
							<div class="th" v-for="(item,i) in lists" :key="i">
								<span>{{item.apay_time}}</span>
								<span>{{item.price*1|xiaoshu2}}</span>
								<span class="red">{{item.num*1|xiaoshu2}}</span>
							</div>
						</div>
<!-- 						<div class="note">
							<div class="title">{{$t('home.tip10')}}</div>
							<div v-if="lang=='cn'">
								<div class="note-content" v-for="(item,i) in notes" :key="i" @click="goNote(item.images,item.content,item.add_time,item.title)">
									<div class="top">{{item.title}}</div>
									<div class="time">{{item.add_time}}</div>
									<div class="content">{{item.content}}</div>
								</div>
							</div>
							<div v-else>
								<div class="note-content" v-for="(item,i) in notes" :key="i" @click="goNote(item.images,item.content_en,item.add_time,item.title_en)">
									<div class="top">{{item.title_en}}</div>
									<div class="time">{{item.add_time}}</div>
									<div class="content">{{item.content_en}}</div>
								</div>
							</div>
						</div> -->
					</div>
				</div>
			</div>
			<Footer1 :isTrades="isTrades" :footname="footname"></Footer1>
			<div class="loading" v-show="loading">
				<div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
			</div>
			<div class="loading" v-show="loading7">
				<div class="load-content"><vue-loading type="spin" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
			</div>
		</div>
	</transition>
</template>
<script>
	import BScroll from "better-scroll";
	import sha1 from "sha1";
	import Footer1 from "../Public/foot";
	import vueLoading from "vue-loading-template";
	import Swiper from "swiper";
	import echarts from "echarts";
	export default {
		name: "Home",
		components: { Footer1, vueLoading },
		data() {
			return {
				footname:"active1",
				animate: "slide-left",
				lang: this.$i18n.locale,
				scroll: null,
				className: "fa fa-long-arrow-down",
				className1: "fa fa-long-arrow-up",
				className2: "refresh1",
				loading: false,
				loading7: false,
				num: "",
				vol: "",
				up: "",
				lists: "",
				myChart: null,
				rawdata: "",
				notes: [],
				state: "",
				kData:[],
				isKefu:"",
				currentPrice:"",
			};
		},
		computed: {
			time() {
				return localStorage.getItem("time");
			},
			isTrades(){
				return this.$store.state.isTrades;
			}
		},
		mounted() {
			var _this = this;

		// 滚动
		this.$nextTick(() => {

			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.wrapper, {
					click: true,
					probeType: 3,
					pullUpLoad: {
						// 配置上啦加载
						threshold: -40 //上拉40px的时候加载
					},
					pullDownRefresh: {
						// 配置下拉
						threshold: 40 //下拉40px的时候加载
					}
				});
				this.scroll.on("pullingUp", () => {
					// d3.select("svg").selectAll("g").remove();
					// this.kData= [];
					this.loading7 = true;
					this.scrollFinish = false;
					this.scroll.finishPullUp();
					this.init();
				});
				this.scroll.on("pullingDown", () => {
					// d3.select("svg").selectAll("g").remove();
					// this.kData= [];
					this.loading7 = true;
					this.scrollFinish = false;
					this.scroll.finishPullDown();
					this.init();
				});
			} else if (!this.$refs.wrapper) {
				return;
			} else {
				this.scroll.refresh();
			}
		});
		// K线图
		this.loading = true;
		setTimeout(function() {
			_this.init()
			
		}, 1500);		
	},
	methods: {
		chart_init2(dates,data,volumes){
			var dom = document.getElementById("main");
			var myChart = echarts.init(dom);

			var app = {};
			var option = null;
			var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
			var labelFont = 'bold 12px Sans-serif';

			console.log(myChart);

			function calculateMA(dayCount, data) {
				var result = [];
				for (var i = 0, len = data.length; i < len; i++) {
					if (i < dayCount) {
						result.push('-');
						continue;
					}
					var sum = 0;
					for (var j = 0; j < dayCount; j++) {
						sum += data[i - j][1];
					}
					result.push((sum / dayCount).toFixed(2));
				}
				return result;
			}
			var dataMA5 = calculateMA(5, data);
			var dataMA10 = calculateMA(10, data);
			var dataMA20 = calculateMA(20, data);

			option = {
				animation: false,
				color: colorList,
				legend: {
					top: 30,
					data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
				},
				tooltip: {
					triggerOn: 'none',
					transitionDuration: 0,
					confine: true,
					bordeRadius: 4,
					borderWidth: 1,
					borderColor: '#333',
					backgroundColor: 'rgba(255,255,255,0.9)',
					textStyle: {
						fontSize: 12,
						color: '#333'
					},
					position: function (pos, params, el, elRect, size) {
						var obj = {
							top: 60
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
						return obj;
					}
				},

				dataZoom: [
				{
					type: 'inside',
					xAxisIndex: [0, 1],
					start:0,
					end: 100,
					top: 30,
					height: 20
				}
				],
				xAxis: [
				{
					type: 'category',
					data: dates,
					boundaryGap : false,
					axisLine: { lineStyle: { color: '#777' } },
					axisLabel: {
						formatter: function (value) {
							return echarts.format.formatTime('MM/dd', value);
						}
					},
					min: 'dataMin',
					max: 'dataMax',
					axisPointer: {
						show: true
					}
				},
				{
					type: 'category',
					gridIndex: 1,
					data: dates,
					scale: false,
					boundaryGap : false,
					splitLine: {show: false},
					axisLabel: {show: false},
					axisTick: {show: false},
					axisLine: { lineStyle: { color: '#777' } },
					splitNumber: 20,
					min: 'dataMin',
					max: 'dataMax',
				}
				],
				yAxis: [
				{
					scale: true,
					splitNumber: 2,
					axisLine: { lineStyle: { color: '#777' } },
					splitLine: { show: true },
					axisTick: { show: false },
					axisLabel: {
						inside: true,
						formatter: '{value}\n'
					}
				}, 
				{
					scale: true,
					gridIndex: 1,
					splitNumber: 2,
					axisLabel: {show: false},
					axisLine: {show: false},
					axisTick: {show: false},
					splitLine: {show: false}
				}
				],
				grid: [
				{
					left: 20,
					right: 20,
					top: 80,
					height: 120
				},
				{
					left: 20,
					right: 20,
					height: 40,
					top: 160
				}
				],
				graphic: [{
					type: 'group',
					left: 'center',
					top: 70,
					width: 300,
					bounding: 'raw',
					children: [{
						id: 'MA5',
						type: 'text',
						style: {fill: colorList[1], font: labelFont},
						left: 0
					}, {
						id: 'MA10',
						type: 'text',
						style: {fill: colorList[2], font: labelFont},
						left: 'center'
					}, {
						id: 'MA20',
						type: 'text',
						style: {fill: colorList[3], font: labelFont},
						right: 0
					}]
				}],
				series: [
				{
					type: 'candlestick',
					name: '日K',
					data: data,
					itemStyle: {
						normal: {
							color0: '#ef232a',
							color: '#14b143',
							borderColor0: '#ef232a',
							borderColor: '#14b143'
						},
						emphasis: {
							color: 'black',
							color0: '#444',
							borderColor: 'black',
							borderColor0: '#444'
						}
					}
				}, {
					name: 'MA5',
					type: 'line',
					data: dataMA5,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}, {
					name: 'MA10',
					type: 'line',
					data: dataMA10,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}, {
					name: 'MA20',
					type: 'line',
					data: dataMA20,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1
						}
					}
				}]
			};
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}

		},
		chart_init(data){
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 365 - margin.left - margin.right,
			height = 220 - margin.top - margin.bottom;

			var parseDate = d3.timeParse("%Y-%m-%d");

			var x = techan.scale.financetime()
			.range([0, width]);

			var y = d3.scaleLinear()
			.range([height, 0]);

			var candlestick = techan.plot.candlestick()
			.xScale(x)
			.yScale(y);

			var zoom = d3.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [width, height]])
			.extent([[0, 0], [width, height]])
			.on("zoom",zoomed);

			var zoomableInit;

			var xAxis = d3.axisBottom(x).tickFormat(d =>  d3.timeFormat("%m/%d")(d));


			var yAxis = d3.axisLeft(y);

			var svg = d3.select("svg")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("x", 0)
			.attr("y", y(1))
			.attr("width", width)
			.attr("height", y(0) - y(1));

			svg.append("g")
			.attr("class", "candlestick")
			.attr("clip-path", "url(#clip)");

			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

			svg.append("g")
			.attr("class", "y axis");



			svg.append("rect")
			.attr("class", "pane")
			.attr("width", width)
			.attr("height", height)
			.style("opacity","0")
			.call(zoom);


			var accessor = candlestick.accessor();

			data = data.sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
			x.domain(data.map(candlestick.accessor().d));
			y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
			svg.select("g.candlestick").datum(data);

			draw();

			zoomableInit = x.zoomable().clamp(false).copy();
			
			function zoomed() {
				var rescaledY = d3.event.transform.rescaleY(y);
				yAxis.scale(rescaledY);
				candlestick.yScale(rescaledY);
				x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
				draw();
				colorset();
			}
			function draw(){
				svg.selectAll("g.candlestick").call(candlestick);
				svg.select("g.x.axis").call(xAxis);
				svg.select("g.y.axis").call(yAxis);
			}

			function colorset(){
				svg.selectAll(".axis").select("path").attr("stroke","#807c77");
				svg.selectAll(".tick").attr("stroke","#807c77").select("line").attr("stroke","#807c77");
				svg.selectAll(".tick").select("text").style("font-size","10px").style("font-family","sans-serif").style("font-weight","100");
				svg.selectAll(".up").attr("fill","#00AA00").attr("stroke","#00AA00");
				svg.selectAll(".down").attr("fill","#FF0000").attr("stroke","#FF0000");
				svg.selectAll(".body").attr("stroke-width","0");
			}
			colorset();
		},
		//时间，收盘，开盘，最低，最高，成交量
		init() {

			let _this = this;

			this.$http
			.post(
				_this.$store.state.url + "Api/PersonalCenter/kLine",
				{
					member_id: _this.$store.state.member_id,
					token: sha1(_this.$store.state.member_id + _this.$store.state.str)
				},
				{
					headers: {},
					emulateJSON: true
				}
				)
			.then(response => {
				this.loading = false;
				this.loading7 = false;
				_this.num = response.data.info.neworder.num;
				_this.vol = response.data.info.volume;
				_this.up = response.data.info.updown;
				_this.notes = response.data.info.noticeList;
				_this.lists = response.data.info.timelyres;
				_this.state = response.data.info.isMessage;
				_this.isKefu = response.data.info.isKefu;
				_this.$store.commit('changeTrades',{data:response.data.info.isTrades});
				_this.currentPrice = response.data.info.kline[response.data.info.kline.length-1][1];
				var dates = [],
				data = [],
				volumes = [];
				response.data.info.kline.forEach((v,k) => {
					dates.push(new Date(v[0]).toLocaleString().replace(/[\/年月日]/g,"-").replace(/^(\d{4}\-\d{1,2}\-\d{1,2}).*/,"$1"));
					var list = [];
					list[0]=v[2];
					list[1]=v[1];
					list[2]=v[3];
					list[3]=v[4];
					list[4]=v[5];
					data.push(list);
					volumes.push(v[5]);
				});	
				// _this.chart_init(_this.kData);
				_this.chart_init2(dates,data,volumes);

			}).then(v => {
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 5000,
					loop:true,
					direction:"vertical",
					speed:1000
				})
			})
			.catch(function(response) {
				this.loading = false;
			});
		},
		goTips() {
			this.$router.push("/tips");
		},
		splitData(rawData) {
			var categoryData = [];
			var values = [];
			var volumes = [];
			for (var i = 0; i < rawData.length; i++) {
				categoryData.push(rawData[i].slice(0, 1)[0]);
				values.push(rawData[i].slice(1));
				volumes.push([
					i,
					rawData[i][5],
					rawData[i].slice(1)[0] > rawData[i].slice(1)[1] ? 1 : -1
					]);
			}
			return {
				categoryData: categoryData,
				values: values,
				volumes: volumes
			};
		},
		calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.values.length; i < len; i++) {
				if (i < dayCount) {
					result.push("-");
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data.values[i - j][1];
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		},
		goNote(img, content, time, title) {
			this.$router.push({
				path: "/note",
				query: { img: img, content: content, time: time, title: title }
			});
		}
	},
	created() {
		if (this.$store.state.urlRes == "tips") {
			this.animate = "slide-left";
		} else {
			this.animate = "";
		}
	},
	beforeRouteLeave(to, from, next) {
		if (to.path != "/tips") {
			this.animate = "";
			this.$store.commit("changeRes", "");
		} else {
		}
		setTimeout(function() {
			next();
		}, 50);
	}
};
</script>
<style lang="less" scoped>

	.charc {
		color:#fff;
		text {
			fill: #000;
			font-size:14px;
		}
	}

	.candle {
		stroke: #d6e9fc;
	}

	.candle.body {
		stroke-width: 0;
	}

	.candle.down {
		fill: #00AA00;
		stroke: #00AA00;
	}

	.candle.up {
		fill: #FF0000;
		stroke: #FF0000;
	}
	.domain{
		stroke:#d6e9fc;
	}
	.pane {
		cursor: move;
		fill: none;
		pointer-events: all;
	}
	.home {
		width: 100%;
		position: absolute;
		height:100%;
		background:linear-gradient(0deg,#352c25 0,#1d1c1c 100%);
		.header {
			background-color: rgb(31, 25, 35);
			text-align: center;
			position: fixed;
			z-index: 100;
			top: 0;
			.news {
				width:20px;
				height:23px;
				position: absolute;
				left: 20px;
				font-size: 20px;
				top:1px;
				background:url(../../assets/img/news.png) no-repeat center;
				background-size:contain;
			}
			.servicemsg{
				width:20px;
				height:20px;
				position: absolute;
				right: 20px;
				font-size: 20px;
				top: 2px;
				background:url(../../assets/img/service.png) no-repeat center;
				background-size:contain;
			}
			.select {
				font-size: 16px;
				position: relative;
				.arrow {
					display: inline-block;
					position: absolute;
					top: 7.5px;
					margin-left: 5px;
					width: 0px;
					height: 0px;
					border-top: 8px solid #fff;
					border-right: 8px solid transparent;
					border-bottom: 8px solid transparent;
					border-left: 8px solid transparent;
				}
			}
		}
		#wrapper {
			width: 100%;
			height: 600px;
			.scroll {
				padding-bottom: 80px;
			}
		}
		.home-page {
			margin-top: 45px;
			width: 100%;
			padding-bottom: 20px;
			.refresh {
				color: #bbb;
				text-align: center;
				font-size: 18px;
				.rotate {
					transition: all 0.5s ease;
					transform: rotateZ(-180deg);
				}
			}
			.refresh1 {
				color: #bbb;
				text-align: center;
				position: absolute;
				margin-top: 20px;
				width: 100%;
				font-size: 18px;
				.rotate1 {
					margin-bottom: 10px;
					display: inline-block;
					transition: all 0.5s ease;
					transform: rotateZ(180deg);
				}
			}
			.title {
				background-color: #2d2b28;
				height: 45px;
				line-height: 45px;
				padding: 0 20px;
				color: #d6e9fc;
				.left {
					font-size: 14px;
				}
				.right {
					font-size: 14px;
					float: right;
					span {
						transform: rotate(270deg);
						font-size: 20px;
						margin-left: 10px;
						vertical-align: middle;
					}
				}
			}
			.announce{
				background: #333;
				color:#f1b90c;
				display: flex;
				flex-direction: row;
				align-items: center;
				.anlist{
					width: 85%;
					height: 45px;
					line-height: 45px;
					overflow: hidden;
					display: inline-block;
					vertical-align: middle;
					li{
						line-height:45px;
						color:#f1b90c;
						a{
							font-size: 12px;
							text-decoration: underline;
							float:right;
						}
					}
				}
				
			}
			.banner {
				border-top: 0.1px solid rgb(47, 49, 68);
				background-color: #fff;
				padding: 0 20px;
				.nav {
					line-height: 20px;
					display: flex;
					justify-content: space-between;
					span {
						color: #2d2b28;
						line-height: 45px;
						display: inline-block;
						width: calc(100%/4);
						text-align: center;
					}
					span:last-child {
						text-align: right;
						width: 18%;
					}
					span:nth-child(1) {
						text-align: left;
						width: 18%;
					}
				}
				.info {
					line-height: 20px;
					margin-top: 5px;
					padding-bottom: 10px;
					display: flex;
					justify-content: space-between;
					width: 100%;
					color: #2d2b28;
					span {
						display: inline-block;
						width: calc(100%/4);
						line-height: 30px;
						overflow: hidden;
						text-align: center;
					}
					span:nth-child(1) {
						text-align: left;
						width: 18%;
					}
					span:last-child {
						width: 18%;
						color:#fff;
					}
					.down {
						background-color: red;
						display: inline-block;
						border-radius: 3px;
						width: 50px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						width: 18%;
					}
					.up {
						background-color: green;
						display: inline-block;
						border-radius: 3px;
						width: 50px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						width: 18%;
					}
				}
			}
			.k_line {
				min-height: 250px;
				background-color: #f4f4f4;
			}
			.make-deal {
				border-top: 0.1px solid rgb(47, 49, 68);
				box-sizing: border-box;
				width: 100%;
				margin-bottom: 10px;
				.th {
					width: 100%;
					display: flex;
					justify-content: space-between;
					color: #2d2b28;
					background-color: #fff;
					padding: 0 20px;
					margin-bottom: 0;
					border-bottom: 1px solid #807c77;
					box-sizing: border-box;
					.red {
						color: red;
					}
					span {
						display: inline-block;
						width: 33.33%;
						line-height: 40px;
						font-size: 13px;
					}
					span:nth-child(2) {
						text-align: center;
					}
					span:nth-child(3) {
						text-align: right;
					}
				}
			}
			.note {
				background-color: rgb(38, 38, 58);
				.title {
					border-bottom: 0.1px solid rgb(47, 49, 68);
				}
				.note-content {
					margin: 0 20px;
					.top {
						margin-top: 5px;
						background-color: rgb(38, 38, 58);
						color: #d6e9fc;
					}
					.time {
						color: rgb(91, 97, 114);
						margin-top: 5px;
						font-size: 14px;
					}
					.content {
						font-size: 14px;
						color: #d6e9fc;
						padding: 10px 0;
					}
				}
			}
		}
		.load-content {
			align-self: auto;
			margin-top: 250px;
		}
		.red-o {
			display: inline-block;
			width: 6px;
			height: 6px;
			background-color: red;
			position: absolute;
			left: 30px;
			top: 5px;
			border-radius: 50%;
		}
		.kefu-o{
			left:13px;
		}
	}
</style>

