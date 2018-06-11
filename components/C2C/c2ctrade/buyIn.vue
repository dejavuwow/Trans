<template>
  <div class="trade-content"
  v-loading="loading2"
  :element-loading-text="$t('err.tip14')"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :fullscreen="false">
  <div id="left" class="wrapper" ref="wrapper">
    <div class="scroll">
      <div class="th">
        <span>{{$t('trade.tip19')}}</span>
        <span>{{$t('trade.tip6')}}</span>
        <span>{{$t('trade.tip7')}}</span>
      </div>
      <div  v-for="(item,i) in arr" :key="i" @click="fill(item.price,item.num,item.ptpid,item.order_type,$event)" :class="item.order_type==1? 'td':'td1'">
        <span :class="[item.order_type=='0'?sellobj:buyobj]">{{item.order_type=='0'?$t('trade.tip21'):$t('trade.tip20')}}{{i+1}}</span>
        <span>{{item.price*1|xiaoshu2}}</span>
        <span>{{item.num*1|xiaoshu2}}</span>
      </div>
    </div>
  </div>
  <div class="right" ref="right" id="right">
    <div class="scroll">
      <input class="el-input__inner"
      :placeholder="$t('trade.tip9')"
      :readonly='type==0? true:false'
      v-model="buy_num" @input="fomarNumber($event,'buy_num')">
      <input class="el-input__inner"
      :placeholder="$t('trade.tip10')"
      :readonly='type==0? true:false'
      v-model="buy_price" @input="fomarNumber($event,'buy_price')">
      <el-input
      :placeholder="$t('trade.tip11')"
      :readonly='true'
      v-if="buy_all==0">
    </el-input>
    <el-input
    :placeholder="$t('trade.tip11')"
    :readonly='true'
    v-model="buy_all"
    v-else>
  </el-input>
  <el-input
  type='password'
  :placeholder="$t('trade.tip12')"
  clearable
  v-model="paypwd1">
</el-input>
<button type="button" class="buy-btn" @click="buy()">{{$t('trade.tip13')}}</button>
<input class="el-input__inner"
:placeholder="$t('trade.tip14')"
clearable
:readonly='type==0? false:true'
v-model="sell_num" id="num"  @input ="fomarNumber($event,'sell_num')">
<input class="el-input__inner"
:placeholder="$t('trade.tip15')"
clearable
:readonly='type==0? false:true'
v-model="sell_price" id="price"  @input ="fomarNumber($event,'sell_price')">
<el-input
:placeholder="$t('trade.tip16')"
:readonly='true'
v-if="sell_all==0">
</el-input>
<el-input
:placeholder="$t('trade.tip16')"
:readonly='true'
v-else 
v-model="sell_all">
</el-input>
<el-input
type='password'
:placeholder="$t('trade.tip17')"
clearable
v-model="paypwd"
:click="focu"
id="test">
</el-input>
<button type="button" class="sell-btn" @click="sell()">{{$t('trade.tip18')}}</button>
</div>
</div>
<div class="loading" v-show="loading">
  <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
</div>
<div class="loading" v-show="loading7">
  <div class="load-content"><vue-loading type="spin" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
</div>
</div>
</template>

<script>
  import IScroll from "iscroll/build/iscroll-probe";
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  import vueLoading from "vue-loading-template";
  import md5 from "md5";
  import $ from "jquery";
  export default {
    components: {
      vueLoading
    },
    data() {
      return {
        regAgent: /(iPhone|iPad|iPod|iOS|Android)/i,
        scroll: null,
        scroll1: null,
        arr: "",
        buy_price: "",
        buy_num: "",
        sell_num: "",
        sell_price: "",
        id: "",
        paypwd: "",
        paypwd1: "",
        page: 0,
        state: false,
        loading: true,
        loading7: false,
        loading2: false,
        type: "",
        sellobj:"sell",
        buyobj:"buy",

      };
    },

    created() {
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
            this.page++;
            this.loading7 = true;
            this.scrollFinish = false;
            this.scroll.finishPullUp();
            this.init();
          });
          this.scroll.on("pullingDown", () => {
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
      var userAgent = navigator.userAgent.match(this.regAgent)[1];
      if (userAgent == "iPhone") {
        this.$nextTick(() => {
          if (!this.scroll1) {
            this.scroll1 = new BScroll(this.$refs.right, {
              click: true,
              probeType: 2
            });
          } else if (!this.$refs.right) {
            return;
          } else {
            this.scroll.refresh();
          }
        });
        var _this = this;
        this.scroll1 = new IScroll("right", {
        click: this.iScrollClick(), //调用判断函数
        probeType: 2,
        mouseWheel: true
      });
      }
    },
    mounted() {
    // 让键盘把底部导航顶起
    var h1 = $(window).innerHeight();
    $(window).resize(function() {
      var h2 = $(window).innerHeight();
      if (h1 > h2) {
        $("#foot").hide();
      } else {
        $("#foot").show();
      }
    });
    // 防止软键盘挡住input
    $("#test").on("click", function() {
      var target = this;
      setTimeout(function() {
        target.scrollIntoViewIfNeeded();
      }, 400);
    });
    $("#price").on("click", function() {
      var target = this;
      setTimeout(function() {
        target.scrollIntoViewIfNeeded();
      }, 400);
    });
    $("#num").on("click", function() {
      var target = this;
      setTimeout(function() {
        target.scrollIntoViewIfNeeded();
      }, 400);
    });
    this.loading = true;
    this.init();
    // 请求个人信息
    this.$http
    .post(
      this.$store.state.url + "Api/PersonalCenter/userPersonalCenter",
      {
        member_id: this.$store.state.member_id,
        token: sha1(this.$store.state.member_id + this.$store.state.str)
      },
      {
        headers: {},
        emulateJSON: true
      }
      )
    .then(res => {
      if (res.data.status == 4) {
        this.num = res.data.info.num;
        this.user = res.data.info.user.substring(2);
        this.order = res.data.info.ptporders;
        this.state = res.data.info.userAuth.status;
        this.$store.commit("changeStatus", res.data.info.userAuth.status);
      } else if (res.data.status == 1) {
        this.num = res.data.info.num;
        this.user = res.data.info.user.substring(2);
        this.order = res.data.info.ptporders;
        this.state = res.data.info.userAuth.status;
        this.$store.commit("changeStatus", res.data.info.userAuth.status);
      } else {
        this.num = res.data.info.num;
        this.user = res.data.info.user.substring(2);
        this.order = res.data.info.ptporders;
        this.state = "";
        this.$store.commit("changeStatus", "");
      }
    })
    .catch(function(re) {
      this.$message({
        message: this.$t("err.info"),
        duration: 1500
      });
    });
  },
  computed: {
    pay() {
      return md5(this.paypwd);
    },
    pay1() {
      return md5(this.paypwd1);
    },
    sell_all() {
      return this.accMul(this.sell_num,this.sell_price);
    },
    buy_all() {
      return this.accMul(this.buy_num,this.buy_price);
    },
  },
  methods: {
    //格式化输入框中的值
    fomarNumber(e,type){
      e.target.value = e.target.value.replace(/[^\d\.]+/ig,"").replace(/\.{2,}/ig,".");
      var index = e.target.value.indexOf(".");
      if(index != -1){
        e.target.value = e.target.value.substring(0,index+3);
      }
      switch(type){
        case "buy_num":
        this.buy_num = e.target.value;
        break;
        case "sell_num":
        this.sell_num = e.target.value;
        break;
        case "buy_price":
        this.buy_price = e.target.value;
        break;
        case "sell_price":
        this.sell_price = e.target.value;
        break;
      }
    },
    //解决js小数计算的bug
    accMul(arg1,arg2)
    {
      var m=0,s1=arg1.toString(),s2=arg2.toString();
      try{m+=s1.split(".")[1].length}catch(e){}
      try{m+=s2.split(".")[1].length}catch(e){}
      return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    },
    // 自动填充右边的input框
    fill(price, num, id, type,e) {
      if($(".activeitem")){
        $(".activeitem").removeClass("activeitem");
      }
      $(e.currentTarget).addClass("activeitem");    
      if (type == 0) {
        this.buy_price = (price * 1).toFixed(2);
        this.buy_num = (num * 1).toFixed(2);
        this.buy_all = (price * 1 * (num * 1)).toFixed(2);
        this.id = id;
      } else {
        this.sell_price = (price * 1).toFixed(2);
        this.sell_num = (num * 1).toFixed(2);
        this.sell_all = (price * 1 * (num * 1)).toFixed(2);
        this.id = id;
      }
    },
    // 上拉加载更多
    init1(page) {
      this.$http
      .post(
        this.$store.state.url + "Api/Ptptrade/getPtporderList",
        {
          page: page,
          token: sha1(page + this.$store.state.str)
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {

        this.loading = false;
        this.loading7 = false;
        if (res.data.status == 1) {
          this.arr = this.arr.concat(res.data.info.ptpolist);
          if (res.data.info.ptpolist < 15) {
            this.$message({
              message: this.$t("err.tip15"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("err.tip15"),
              duration: 1500
            });
          }
          this.$store.commit("changeNow", res.data.info.timelyres);
        } else if (res.data.status == 2) {
          this.$store.commit("changeNow", res.data.info.timelyres);
        } else if (res.data.status == 0) {
          this.arr = "";
        }
      })
      .catch(function(response) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    // 获取挂单列表
    init() {
      this.$http
      .post(
        this.$store.state.url + "Api/Ptptrade/getPtporderList",
        {
          token: sha1(this.$store.state.str)
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {
        this.loading = false;
        this.loading7 = false;
        if (res.data.status == 1) {
          this.arr = res.data.info.ptpolist;
          this.$store.commit("changeNow", res.data.info.timelyres);
          this.type = res.data.info.ptporder_type;
        } else if (res.data.status == 2) {
          this.$store.commit("changeNow", res.data.info.timelyres);
        } else if (res.data.status == 0) {
          this.arr = "";
        }
      })
      .catch(function(response) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    // 卖出
    sell() {
      if (this.$store.state.status != 1) {
        this.$message({
          message: this.$t("err.tip5"),
          duration: 1500
        });
        return false;
      }
      this.loading2 = true;
      // 判断是不是卖出单
      if (this.type == 0) {
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/sellApv",
          {
            member_id: this.$store.state.member_id,
            sell_num: this.sell_num,
            price: this.sell_price,
            pwdtrade: this.pay,
            order_type: 0,
            token: sha1(
              this.$store.state.member_id +
              this.sell_num +
              this.sell_price +
              this.pay +
              0 +
              this.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          this.loading2 = false;
          if (res.data.status == 1) {
            this.init();
            this.sell_num = "";
            this.sell_price = "";
            this.sell_all = "";
            this.paypwd = "";
            this.$message({
              message: this.$t("buyIn.tip5"),
              duration: 1500
            });
          } else if (res.data.status == "03") {
            this.$message({
              message: this.$t("err.tip4"),
              duration: 1500
            });
          } else if (res.data.status == "05") {
            this.$message({
              message: this.$t("selldetail.d11"),
              duration: 1500
            });
          } else if (res.data.status == "08") {
            this.$message({
              message: this.$t("sellout.s28"),
              duration: 1500
            });
          } else if (res.data.status == "10") {
            this.$message({
              message: this.$t("sellout.s14"),
              duration: 1500
            });
          } else if (res.data.status == 11) {
            this.$message({
              message: this.$t("sellout.s24"),
              duration: 1500
            });
          } else if (res.data.status == 13) {
            this.$message({
              message: this.$t("sellout.s12") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "06") {
            this.$message({
              message: this.$t("sellout.s10") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "07") {
            this.$message({
              message: this.$t("sellout.s11") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == 14) {
            this.$message({
              message: this.$t("sellout.s22") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "09") {
            this.$message({
              message: this.$t("sellout.s45"),
              duration: 1500
            });
          } else if (res.data.status == "20") {
            this.$message({
              message: this.$t("sellout.s60"),
              duration: 1500
            });
          } else if (res.data.status == "21") {
            this.$message({
              message: this.$t("sellout.s61"),
              duration: 1500
            });
          }else if (res.data.status == "22") {
            this.$message({
              message: this.$t("sellout.s62"),
              duration: 1500
            });
          }else {
            this.$message({
              message: this.$t("sellout.s44"),
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
        });
      } else if (this.type == 1) {
        // 判断是不是委托卖出单
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/buyApv",
          {
            member_id: this.$store.state.member_id,
            buynum: this.sell_num,
            price: this.sell_price,
            pwdtrade: this.pay,
            ptpid: this.id,
            order_type: 1,
            token: sha1(
              this.$store.state.member_id +
              this.sell_num +
              this.sell_price +
              this.pay +
              this.id +
              1 +
              this.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          this.loading2 = false;
          this.init();
          if (res.data.status == 1) {
            this.init();
            this.sell_num = "";
            this.sell_price = "";
            this.sell_all = "";
            this.paypwd = "";
            this.$message({
              message: this.$t("buyIn.tip5"),
              duration: 1500
            });
          } else if (res.data.status == "04") {
            this.$message({
              message: this.$t("buyaic.b12"),
              duration: 1500
            });
          } else if (res.data.status == "06") {
            this.$message({
              message: this.$t("err.tip4"),
              duration: 1500
            });
          } else if (res.data.status == "08") {
            this.$message({
              message: this.$t("selldetail.d11"),
              duration: 1500
            });
          } else if (res.data.status == "10") {
            this.$message({
              message: this.$t("err.tip16"),
              duration: 1500
            });
          } else if (res.data.status == "11") {
            this.$message({
              message: this.$t("buyaic.b18"),
              duration: 1500
            });
          } else if (res.data.status == "13") {
            this.$message({
              message: this.$t("sellout.s28"),
              duration: 1500
            });
          }else if (res.data.status == "20") {
            this.$message({
              message: this.$t("sellout.s60"),
              duration: 1500
            });
          } else if (res.data.status == "21") {
            this.$message({
              message: this.$t("sellout.s61"),
              duration: 1500
            });
          }else if (res.data.status == "22") {
            this.$message({
              message: this.$t("sellout.s62"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("buyaic.b16"),
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
        });
      }
    },
    // 买入
    buy() {
      if (this.$store.state.status != 1) {
        this.$message({
          message: this.$t("err.tip5"),
          duration: 1500
        });
        return false;
      }
      if (!this.buy_num) {
        this.$message({
          message: this.$t("buyaic.b17"),
          duration: 1500
        });
        return false;
      }
      if (!this.paypwd1) {
        this.$message({
          message: this.$t("sellout.s32"),
          duration: 1500
        });
        return false;
      }
      this.loading2 = true;
      // 判断是不是买入单
      if (this.type == 0) {
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/buyApv",
          {
            member_id: this.$store.state.member_id,
            buynum: this.buy_num,
            price: this.buy_price,
            pwdtrade: this.pay1,
            ptpid: this.id,
            order_type: this.type,
            token: sha1(
              this.$store.state.member_id +
              this.buy_num +
              this.buy_price +
              this.pay1 +
              this.id +
              this.type +
              this.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          this.loading2 = false;
          this.init();
          if (res.data.status == 1) {
            this.init();
            this.buy_num = "";
            this.buy_price = "";
            this.buy_all = "";
            this.paypwd1 = "";
            this.$message({
              message: this.$t("buyIn.tip5"),
              duration: 1500
            });
          } else if (res.data.status == "04") {
            this.$message({
              message: this.$t("buyaic.b12"),
              duration: 1500
            });
          } else if (res.data.status == "06") {
            this.$message({
              message: this.$t("err.tip4"),
              duration: 1500
            });
          } else if (res.data.status == "08") {
            this.$message({
              message: this.$t("selldetail.d11"),
              duration: 1500
            });
          } else if (res.data.status == "10") {
            this.$message({
              message: this.$t("err.tip16"),
              duration: 1500
            });
          } else if (res.data.status == "11") {
            this.$message({
              message: this.$t("buyaic.b18"),
              duration: 1500
            });
          } else if (res.data.status == "20") {
            this.$message({
              message: this.$t("sellout.s60"),
              duration: 1500
            });
          } else if (res.data.status == "21") {
            this.$message({
              message: this.$t("sellout.s61"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("buyaic.b16"),
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
        });
      } else if (this.type == 1) {
        // 判断是不是委托买入
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/sellApv",
          {
            member_id: this.$store.state.member_id,
            sell_num: this.buy_num,
            price: this.buy_price,
            pwdtrade: this.pay1,
            order_type: 1,
            token: sha1(
              this.$store.state.member_id +
              this.buy_num +
              this.buy_price +
              this.pay1 +
              1 +
              this.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          this.loading2 = false;
          if (res.data.status == 1) {
            this.init();
            this.buy_num = "";
            this.buy_price = "";
            this.buy_all = "";
            this.paypwd1 = "";
            this.$message({
              message: this.$t("buyIn.tip5"),
              duration: 1500
            });
          } else if (res.data.status == "03") {
            this.$message({
              message: this.$t("err.tip4"),
              duration: 1500
            });
          } else if (res.data.status == "05") {
            this.$message({
              message: this.$t("selldetail.d11"),
              duration: 1500
            });
          } else if (res.data.status == "08") {
            this.$message({
              message: this.$t("sellout.s28"),
              duration: 1500
            });
          } else if (res.data.status == "10") {
            this.$message({
              message: this.$t("sellout.s14"),
              duration: 1500
            });
          } else if (res.data.status == 11) {
            this.$message({
              message: this.$t("sellout.s24"),
              duration: 1500
            });
          } else if (res.data.status == 13) {
            this.$message({
              message: this.$t("sellout.s12") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "16") {
            this.$message({
              message: this.$t("sellout.s57") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "17") {
            this.$message({
              message: this.$t("sellout.s58") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == 14) {
            this.$message({
              message: this.$t("sellout.s22") + res.data.info,
              duration: 1500
            });
          } else if (res.data.status == "09") {
            this.$message({
              message: this.$t("sellout.s45"),
              duration: 1500
            });
          } else if (res.data.status == "20") {
            this.$message({
              message: this.$t("sellout.s60"),
              duration: 1500
            });
          } else if (res.data.status == "21") {
            this.$message({
              message: this.$t("sellout.s61"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("sellout.s44"),
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
        });
      }
    },
    iScrollClick() {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent))
        return /Android/i.test(navigator.userAgent);
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        var s = navigator.userAgent.substr(
          navigator.userAgent.indexOf("Android") + 8,
          3
          );
        return parseFloat(s[0] + s[3]) < 44 ? false : true;
      }
    },
    focu() {
      let _this = this;
      setTimeout(function() {
        let pan = document.getElementById("test");
        pan.scrollIntoView(true);
        pan.scrollIntoViewIfNeeded();
      }, 200);
    }
  }
};
</script>

<style lang="less">
  .trade-content {
    .el-input__inner {
      color: #999;
    }
    .th {
      span {
        color: #000;
        display: inline-block;
        width: 33.3333%;
        text-align: left;
      }
    }
    .td {
      display: flex;
      justify-content: space-between;
      color:#333;
      span {
        display: inline-block;
        width: 33.3333%;
        line-height: 35px;
        font-size: 13px;
        text-align: left;
      }
      .sell{
        color:#109e7e;
      }
      .buy{
        color:#e60012;
      }
    }
    .td1 {
      display: flex;
      justify-content: space-between;
      color:#000;
      span {
        display: inline-block;
        width: 33.3333%;
        line-height: 35px;
        font-size: 13px;
        text-align: left;
      }
      .sell{
        color:#109e7e;
      }
      .buy{
        color:#e60012;
      }
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
    .el-loading-mask {
      margin-top: -100px;
    }
  }
  .activeitem{
    background: #f4f4f4;
  }
</style>
