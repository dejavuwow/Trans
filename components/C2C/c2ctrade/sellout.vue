<template>
  <div class="sell-out"
  v-loading="loading2"
  :element-loading-text="$t('err.tip14')"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :fullscreen="false">
  <div class="wrapper wrappersell" ref="wrapper">
    <div class="scroll">
      <div class="item-content" v-for="(item,i) in list" :key="i">
        <div class="top">
          <div class="left">
            <span>{{$t('sellout.s8')}}{{i+1}}</span>
          </div>
          <div class="right">
            <div class="first">
              <span>{{$t('sellout.s33')}}</span>
              <span>{{$t('sellout.s34')}}</span>
              <span>{{$t('sellout.s35')}}</span>
              <span>{{$t('sellout.s36')}}</span>
            </div>
            <div class="second">
              <span>{{(item.num*1)|xiaoshu2}}</span>
              <span>{{(item.price*1)|xiaoshu2}}</span>
              <span>{{(item.trade_num*1)|xiaoshu2}}</span>
              <span>{{(item.num*1)-(item.trade_num*1)|xiaoshu2}}</span>
            </div>
          </div>
        </div>
        <div class="btns">
          <button type="button"  @click="drop(item.ptpid,i)" :disabled="item.status==1" :class="item.status==1? 'unable':'drop'" >{{$t('sellout.s37')}}</button>
          <button type="button" class="edit" @click="coll(i,item.status,item.voucher,item.add_time,item.pay_time)">{{$t('sellout.s38')}}<span class="el-icon-arrow-down"></span></button>
        </div>
        <el-collapse-transition>
          <div class="content transition-box" v-show="isShow==i">
            <div class="colls">
              <div class="td">
                <div>{{$t('sellout.s8')}}</div>
                <div>{{(item.num*1)|xiaoshu2}}</div>
              </div>
              <div class="td">
                <div>{{$t('sellout.s39')}}</div>
                <div>{{(item.money*1)|xiaoshu2}}</div>
              </div>
              <div class="td td_else">
                <div class="">
                  <img :src='url+item.voucher' alt="" @click="big1()" v-show="!big">
                  <transition enter-active-class='animated zoomIn' leave-active-class="animated zoomOut">
                    <img :src='url+item.voucher' alt="" @click="goback()" v-show="big" class="bigpic">
                  </transition>
                </div>
              </div>
              <div class="td">
                <div v-show="item.status==0" class="margin0">{{$t('sellout.s51')}}</div>
                <div v-show="item.status==1" class="margin0">{{$t('sellout.s56')}}</div>
                <div class="time">{{Time}}</div>
              </div>
            </div>
            <div class="btns">
              <button type="button" class="drop" @click="confirm(item.ptptid,i)" :disabled="!item.voucher" :class="!item.voucher? 'unable':'drop'">{{$t('sellout.s41')}}</button>
              <button type="button" class="edit1" @click="chat(item.ptptid)" :class="[list.status==0?'':'enabled']">{{$t('sellout.s42')}}
                <i v-if="item.isMsg=='1'" class="fa fa-commenting msgicon"></i>
              </button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
  <div class="loading" v-show="loading">
    <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
  </div>
</div>
</template>
<script>
  import sha1 from "sha1";
  import vueLoading from "vue-loading-template";
  import BScroll from "better-scroll";
  import axios from "axios";
  import $ from "jquery";
  export default {
    components: {
      vueLoading
    },
    //status 0:挂单 1：带你确认收款  2:成交 -1:撤销
    data() {
      return {
        isShow: -1,
        loading2: false,
        list: "",
        click: 0,
        loading: true,
        Time: "",
        url: this.$store.state.url,
        big: false,
        timer:null
      };
    },
    created() {
      var _this = this;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true,
            probeType: 2
          });
        } else if (!this.$refs.wrapper) {
          return;
        } else {
          this.scroll.refresh();
        }
      });
      var params = new URLSearchParams();
      params.append("member_id", _this.$store.state.member_id);
      params.append(
        "token",
        sha1(_this.$store.state.member_id + _this.$store.state.str)
        );
      let pro = new Promise(function(resolve, reject) {
        axios
        .post(
          _this.$store.state.url + "Api/Ptptrade/entrustSellLstApv",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
          }
          )
        .then(res => {
          _this.loading = false;
          if (res.data.status == 1) {
            _this.list = res.data.info;
            console.log(res.data.info)
          }
          resolve(res);
        })
        .catch(err => {
          this.$message({
            message: this.$t("err.info"),
            duration: 1500
          });
        });
      })
      .then(res => {
      })
      .catch();
    },
    mounted() {},
    beforeRouteLeave(to, from, next){
      this.$store.commit('changeTrades',{data:""});
      clearInterval(this.timer);
      next();
    },
    methods: {
      coll(i, state,img,time,pay) {
        var _this = this;
      // 改变时间
      if(state==0){
        if (this.timer) {
          clearInterval(this.timer);
          let time1 = time * 1 + 2 * 3600;
          let now = Date.parse(new Date()) / 1000;
          let val = time1 - now;
          let h = parseInt(val / 3600);
          let m = parseInt((val - h * 3600) / 60);
          let s = parseInt(val - h * 3600 - m * 60);
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time = "0" + h + ":" + m + ":" + s;
          }
          this.timer = setInterval(function() {
           now = Date.parse(new Date()) / 1000;
           val = time1 - now;
           h = parseInt(val / 3600);
           m = parseInt((val - h * 3600) / 60);
           s = parseInt(val - h * 3600 - m * 60);
           if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time = "0" + h + ":" + m + ":" + s;
          }
        }, 1000);
        } else {
          let time1 = time * 1 + 2 * 3600;
          let now = Date.parse(new Date()) / 1000;
          let val = time1 - now;
          let h = parseInt(val / 3600);
          let m = parseInt((val - h * 3600) / 60);
          let s = parseInt(val - h * 3600 - m * 60);
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time = "0" + h + ":" + m + ":" + s;
          }
          this.timer = setInterval(function() {
            now = Date.parse(new Date()) / 1000;
            val = time1 - now;
            h = parseInt(val / 3600);
            m = parseInt((val - h * 3600) / 60);
            s = parseInt(val - h * 3600 - m * 60);
            if (m < 10) {
              m = "0" + m;
            }
            if (s < 10) {
              s = "0" + s;
            }
            if (val <= 0) {
              _this.Time = _this.$t("subaic.s16");
            } else {
              _this.Time = "0" + h + ":" + m + ":" + s;
            }
          }, 1000);
        }
      }else{
        if (this.timer) {
          clearInterval(this.timer);
          let time1 = pay * 1 + 48 * 3600;
          let now = Date.parse(new Date()) / 1000;
          let val = time1 - now;
          let h = parseInt(val / 3600);
          let m = parseInt((val - h * 3600) / 60);
          let s = parseInt(val - h * 3600 - m * 60);
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time =  h + ":" + m + ":" + s;
          }
          this.timer = setInterval(function() {
           now = Date.parse(new Date()) / 1000;
           val = time1 - now;
           h = parseInt(val / 3600);
           m = parseInt((val - h * 3600) / 60);
           s = parseInt(val - h * 3600 - m * 60);
           if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time =  h + ":" + m + ":" + s;
          }
        }, 1000);
        } else {
          let time1 = pay * 1 + 48 * 3600;
          let now = Date.parse(new Date()) / 1000;
          let val = time1 - now;
          let h = parseInt(val / 3600);
          let m = parseInt((val - h * 3600) / 60);
          let s = parseInt(val - h * 3600 - m * 60);
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time = h + ":" + m + ":" + s;
          }
          this.timer = setInterval(function() {
            now = Date.parse(new Date()) / 1000;
            val = time1 - now;
            h = parseInt(val / 3600);
            m = parseInt((val - h * 3600) / 60);
            s = parseInt(val - h * 3600 - m * 60);
            if (m < 10) {
              m = "0" + m;
            }
            if (s < 10) {
              s = "0" + s;
            }
            if (val <= 0) {
              _this.Time = _this.$t("subaic.s16");
            } else {
              _this.Time = h + ":" + m + ":" + s;
            }
          }, 1000);
        }
      }
      if (state!=1&&!img) {
        this.$message({
          message: this.$t("sellout.s54"),
          duration: 1500
        });
        return false;
      }
      if (state==1&&!img) {

       if (this.timer) {
        clearInterval(this.timer);
        let time1 = time * 1 + 2 * 3600;
        let now = Date.parse(new Date()) / 1000;
        let val = time1 - now;
        let h = parseInt(val / 3600);
        let m = parseInt((val - h * 3600) / 60);
        let s = parseInt(val - h * 3600 - m * 60);
        if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
        if (val <= 0) {
          _this.Time = _this.$t("subaic.s16");
        } else {
          _this.Time = "0" + h + ":" + m + ":" + s;
        }
        this.timer = setInterval(function() {
         now = Date.parse(new Date()) / 1000;
         val = time1 - now;
         h = parseInt(val / 3600);
         m = parseInt((val - h * 3600) / 60);
         s = parseInt(val - h * 3600 - m * 60);
         if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
        if (val <= 0) {
          _this.Time = _this.$t("subaic.s16");
        } else {
          _this.Time = "0" + h + ":" + m + ":" + s;
        }
      }, 1000);
      } else {
        let time1 = time * 1 + 2 * 3600;
        let now = Date.parse(new Date()) / 1000;
        let val = time1 - now;
        let h = parseInt(val / 3600);
        let m = parseInt((val - h * 3600) / 60);
        let s = parseInt(val - h * 3600 - m * 60);
        if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
        if (val <= 0) {
          _this.Time = _this.$t("subaic.s16");
        } else {
          _this.Time = "0" + h + ":" + m + ":" + s;
        }
        this.timer = setInterval(function() {
          now = Date.parse(new Date()) / 1000;
          val = time1 - now;
          h = parseInt(val / 3600);
          m = parseInt((val - h * 3600) / 60);
          s = parseInt(val - h * 3600 - m * 60);
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
          if (val <= 0) {
            _this.Time = _this.$t("subaic.s16");
          } else {
            _this.Time = "0" + h + ":" + m + ":" + s;
          }
        }, 1000);
      }

    }
    if (this.click == 0) {
      this.isShow = i;
      this.click = 1;
      return false;
    }
    if (this.click == 1) {
      this.isShow = -1;
      this.click = 0;
      return false;
    }
  },
    // 下架
    drop(id, i) {
      this.$http
      .post(
        this.$store.state.url + "Api/Ptptrade/offTheHhelfApv",
        {
          ptpid: id,
          token: sha1(id + this.$store.state.str)
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {
        if (res.data.status == 1) {
          this.list.splice(i, 1);
          this.$message({
            message: this.$t("sellout.s18"),
            duration: 1500
          });
        }else if(res.data.status=='05'){
          this.$message({
            message: this.$t("sellout.s20"),
            duration: 1500
          });
        }else{
          this.$message({
            message: this.$t("sellout.s46"),
            duration: 1500
          });
        }
      })
      .catch(function(response) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    // 确认收款
    confirm(id, i) {
      var _this = this;
      plus.nativeUI.confirm(_this.$t("tixian.tip25"),function(e){
        if(e.index==0){
          _this.loading2 = true;
          _this.$http
          .post(
            _this.$store.state.url + "Api/Ptptrade/sellConfirmationOfReceivables",
            {
              member_id: _this.$store.state.member_id,
              ptptid: id,
              token: sha1(
                _this.$store.state.member_id + id + _this.$store.state.str
                )
            },
            {
              headers: {},
              emulateJSON: true
            }
            )
          .then(res => {
            _this.loading2 = false;
            if (res.data.status == 1) {
              _this.list.splice(i, 1);
              _this.$message({
                message: _this.$t("selldetail.d9"),
                duration: 1500
              });
            } else if (res.data.status == "03") {
              _this.$message({
                message: _this.$t("err.tip4"),
                duration: 1500
              });
            } else {
              _this.$message({
                message: _this.$t("selldetail.d13"),
                duration: 1500
              });
            }
          })
          .catch(function(response) {
            _this.$message({
              message: _this.$t("err.info"),
              duration: 1500
            });
          });
        }
      })
    },
    // 放大图片
    big1() {
      this.big = true;
      var window_h = $(window).height();
      var window_w = $(window).width();
      $(".bigpic")
      .css("height", window_h)
      .css("width", window_w);
    },
    goback() {
      this.big = false;
    },
    chat(id){
      this.$router.push({path:'/chat',query:{id:id}})
    }
  }
};
</script>

<style lang="less" scoped>
  .sell-out {
    height:72%;
    .top {
      width: 100%;
      white-space: nowrap;
      .left {
        font-weight: bold;
        height:40px;
        line-height: 40px;
        width:96%;
        margin:0 auto;
        border-bottom:1px solid #ccc;
        span {
        }
      }
      .right {
        .first {
          height: 35px;
          line-height: 35px;
          padding-right: 15px;
          span {
            color: #333;
            display: inline-block;
            width: 25%;
            text-align: center;
          }
        }
        .second {
          height: 50px;
          line-height: 50px;
          padding-right: 15px;
          span {
            display: inline-block;
            width: 25%;
            text-align: center;
          }
        }
      }
    }
    .btns {
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 10px;
      .edit1{
       width: 48%;
       position:relative;
     }
     .drop {
      width: 48%;
      background-color: #f1b90c;
      border-radius: 4px;
      color: black;
      display: inline-block;
      border: 1px solid #f1b90c;
    }
    .edit {
      color: #fff;
      width: 48%;
      display: inline-block;
      border-radius: 4px;
      background-color: #f1b90c;
      border: 1px solid #f1b90c;
      .el-icon-arrow-down {
        margin-left: 10px;
        font-size: 15px;
      }
    }
  }
  .content {
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    .btns {
      border: none;
    }
  }
  .colls {
    width: 100%;
    height: 70px;
    white-space: nowrap;
    padding:0 15px;
    box-sizing: border-box;
    .td {
      width: 24%;
      display: inline-block;
      text-align: center;
      div {
        font-size: 12px;
      }
      div:nth-child(1) {
        color: #333;
      }
      div:nth-child(2) {
        margin-top: 10px;
      }
    }
    .td:last-child {
      text-align: right;
    }
  }
  .load-content {
    align-self: auto;
    margin-top: 250px;
  }
  .wrapper {
    height:100%;
    overflow: hidden;
    
  }
  .wrappersell{
    background: #e5e5e5;
    padding:10px;
  }
  .scroll {
    min-height: 101%;
  }
  .item-content {
    background: #fff;
    color:#333;
    border-radius:6px;
  }
  .unable {
    background-color: rgb(175, 188, 204) !important;
    width: 48%;
    border-radius: 4px;
    color: black;
    display: inline-block;
    border: 1px solid rgb(175, 188, 204) !important;
  }
  .td_else {
    // position: relative;
    img {
      width: 5rem;
      height: 5rem;
    }
  }
  .bigpic {
    position: absolute;
    display: flex;
    left: 0;
    align-items: center;
    top: 0;
    background-color: rgba(8, 8, 8, 0.8);
    width: 100%;
    height: 80% !important;
    z-index:3;
  }
  .time {
    margin-top: 10px;
  }
  .margin0{
    margin-top: 0!important;
  }
}
.enabled{
  color: #f1b90c;
  display: inline-block;
  border-radius: 4px;
  background-color: transparent;
  border: 1px solid #f1b90c;
}
.msgicon {
  color: red;
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 65%;
}

</style>
