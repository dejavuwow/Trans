<template>
  <div class="sell-out proxysell"
  v-loading="loading2"
  :element-loading-text="$t('err.tip14')"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :fullscreen="false">
  <div>
    <!-- <input type="date" name="" id=""> -->
  </div>
  <div class="wrapper wrapperbuy" ref="wrapper">
    <div class="scroll">
      <div class="item-content" v-for="(item,i) in list" :key="i">


        <div class="top">
          <div class="left">
            <span>{{$t('buyaic.b11')}}{{i+1}}</span>
          </div>
          <div class="right">
            <div class="first">
              <span>{{$t('sellout.s33')}}</span>
              <span>{{$t('sellout.s34')}}</span>
              <span>{{$t('sellout.s39')}}</span>
            </div>
            <div class="second">
              <span>{{(item.num*1)|xiaoshu2}}</span>
              <span>{{(item.price*1)|xiaoshu2}}</span>
              <span>{{((item.num*1)*(item.price*1))|xiaoshu2}}</span>
            </div>
          </div>
        </div>
        <div class="btns" v-if="item.order_type!=1">
          <button type="button" @click="drop(item.ptptid,i,item.order_type)" :class="item.voucher==''&&num3!==i? 'drop':'unable'" :disabled="item.voucher!=''||num3===i">{{$t('sellout.s55')}}</button>
          <button type="button" class="edit" @click="coll(i,item.voucher,item.add_time,item.pay_time,item.status)">{{$t('sellout.s38')}}<span class="el-icon-arrow-down"></span></button>
        </div>
        <div class="btns" v-else>
          <button type="button" @click="dropBuy(item.ptpid,i,item.order_type,item.realsellid,item.ptptid)" :class="item.status==0&&isUpload==false? 'drop':'unable'" :disabled="item.status!=0||isUpload==true">{{$t('sellout.s55')}}</button>
          <button type="button" class="edit" @click="coll(i,item.voucher,item.add_time,item.pay_time,item.status,item.order_type,item.realsellid)">{{$t('sellout.s38')}}<span class="el-icon-arrow-down"></span></button>
        </div>
        <el-collapse-transition>
          <div class="content transition-box" v-show="isShow==i">
            <div class="colls">
              <div class="td">
                <div>{{$t('sellout.s49')}}</div>
                <div>{{item.bankcardname}}</div>
              </div>
              <div class="td">
                <div>{{$t('sellout.s50')}}</div>
                <div>{{item.bank}}</div>
              </div>
              <div class="td align">
                <div class="inline">
                  <div class="c-bottom">
                    <form name="form1" class="form1">
                      <input type="hidden" value="" name="ptrade_no">
                      <div class="upload">
                        <input type="file" 
                        id='pic2'
                        name="imgs"
                        @change='changeFile($event,this,i)'
                        v-show="item.voucher==''&&isUpload==false">
                        <img :src="$store.state.url+item.voucher" class="showImg1" alt="" v-show="item.voucher!=''" @click="big1(item.voucher)">
                        <img :src="$store.state.url+src['src'+i]" class="showImg1 showcu" alt="" v-show="num2!==''" >
                        
                        <!-- <img :src="'http://192.168.0.103/'+src['src'+i]" class="showImg1" alt="1"  v-else v-show="src['src'+i]!=i"> -->
                        <i class="fa fa-camera" :id="'camera'+i" :class="item.voucher!=''|| src['src'+i]!=i? '':'opacity'"></i>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="td">
                <div v-show="item.status==0" class="margin0">{{$t('sellout.s51')}}</div>
                <div v-show="item.status==1" class="margin0">{{$t('sellout.s56')}}</div>
                <div>{{Time}}</div>
              </div>
            </div>
            <div class="btns">
              <button type="button" class="drop" @click="watch(item.bank,item.bankaddress,item.bankcardname,item.bankcardnum)">{{$t('sellout.s53')}}</button>
              <button type="button" :class="['up',item.voucher?upobjec:'']" @click="upload(item.ptptid,i)" :disabled="item.voucher!=''||isUpload==true">{{$t('sellout.s52')}}</button>
              <button type="button" class="edit" @click="chat(item.ptptid)">{{$t('sellout.s42')}}
                <i v-if="item.isMsg=='1'" class="fa fa-commenting msgicon"></i>
              </button>
            </div>
          </div>
        </el-collapse-transition>
      </div> <!-- 你是 -->
    </div>
  </div>
  <div class="loading" v-show="loading">
    <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
  </div>
  <transition enter-active-class='animated zoomIn' leave-active-class="animated zoomOut">
    <img :src="$store.state.url+voucher" class="bigpic" alt="" v-show="big" @click="goback()">
  </transition>
</div>
</template>
<script>
  import axios from "axios";
  import vueLoading from "vue-loading-template";
  import BScroll from "better-scroll";
  import sha1 from "sha1";
  import $ from "jquery";
  import registerVue from "../../Login/register.vue";
  export default {
    components: {
      vueLoading
    },
    data() {
      return {
        isShow: -1,
        click: 0,
        isUpload: false,
        scroll: null,
        loading: true,
        list: "",
        Time: "",
        timer: null,
        loading2: false,
        length: "",
        obj1: "",
        num2: "",
        num: "",
        num3: "",
        upobjec:"disabled",
        big:false,
        voucher:"",
        currentimg:"",
        src:"",
      };
    },
    computed: {
      hand() {
        return this.$store.state.hand;
      },
    },
    beforeRouteLeave(to, from, next){
      this.$store.commit('changeTrades',{data:""});
      clearInterval(this.timer);
      next();
    },
    created() {
      this.num2 = "";
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
      this.init();
    },
    methods: {
      big1(src) {
        if(src){
          this.voucher = src;
        }
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
      coll(i, img, time, pay, state, type, sellId) {
        var _this = this;
        if (type == 1) {
          if (state == 0) {
            if (sellId == 0) {
              _this.$message({
                message: _this.$t("sellout.s59"),
                duration: 1500
              });
              return false;
            }
            if (this.timer) {
              clearInterval(this.timer);
              this.upDown(i, img, time, pay, state, type, sellId, 2, false);
            } else {
              this.upDown(i, img, time, pay, state, type, sellId, 2, false);
            }
          } else {
            if (img == "") {
              console.log("没有上传");
              if (this.timer) {
                clearInterval(this.timer);
                this.upDown(i, img, time, pay, state, type, sellId, 2, false);
              } else {
                this.upDown(i, img, time, pay, state, type, sellId, 2, false);
              }
            } else {
              if (this.timer) {
                clearInterval(this.timer);
                this.upDown(i, img, time, pay, state, type, sellId, 48, true);
              } else {
                this.upDown(i, img, time, pay, state, type, sellId, 48, true);
              }
            }
          }
        } else {
          console.log("else")
        // 改变时间
        if (state == 0) {
          if (this.timer) {
            clearInterval(this.timer);
            this.upDown(i, img, time, pay, state, type, sellId, 2, false);
          } else {
            this.upDown(i, img, time, pay, state, type, sellId, 2, false);
          }
        } else {
          console.log("")
          if (this.timer) {
            clearInterval(this.timer);
            this.upDown(i, img, time, pay, state, type, sellId, 48, true);
          } else {
            this.upDown(i, img, time, pay, state, type, sellId, 48, true);
          }
        }
      }
      // 判断是否上传
      var _this = this;
      if (img != "") {
        var camera1 = document.getElementById("camera" + i);
        camera1.style.opacity = 0;
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
    changeFile(e, i, ii) {
      var _this = this;
      let camera = document.getElementById("camera" + ii);
      console.log(camera);
      camera.style.opacity = 0;
      let img = this.img,
      file = e.target,
      reader = new FileReader();
      reader.readAsDataURL(file.files[0]);

      reader.onload = function() {
        var fdata = new FormData($(".form1")[ii]);
        // plus.nativeUI.showWaiting(_this.$t("certify.tip13"), {
        //   verticalAlign: "center"
        // });
        _this.loading2 = true;
        if (!_this.obj1) {
        }
        axios({
          method: "post",
          dataType: "json",
          url:  _this.$store.state.url+"/Api/Authentication/Authentication",
          data: fdata,
          cache: false,
          processData: false,
          contentType: false
        })
        .then(res => {
            // plus.nativeUI.closeWaiting();
            _this.loading2 = false;
            if (res.data.status == 1) {
              _this.obj1["src" + ii] = res.data.info;
              _this.num2 = ii;
              _this.src = _this.obj1;
              // _this.$store.commit("changeImg", _this.obj1);
            } else {
              plus.nativeUI.toast(_this.$t("certify.tip3"), {
                verticalAlign: "center"
              });
            }
          })
        .catch(err => {
          console.log(err);
        });
      };
    },
    // 撤单
    drop(id, i, type) {
      console.log('撤单')
      this.$http
      .post(
        this.$store.state.url + "Api/Ptptrade/buyCancelTheOrder",
        {
          ptptid: id,
          order_type: type,
          token: sha1(id + type + this.$store.state.str)
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {
        if (res.data.status == 1) {
          this.list.splice(i, 1);
          this.init();
          this.$message({
            message: this.$t("sellout.s47"),
            duration: 1500
          });
        } else {
          this.$message({
            message: this.$t("sellout.s48"),
            duration: 1500
          });
        }
      })
      .catch(function(response) {
        plus.nativeUI.toast(this.$t("err.info"), {
          verticalAlign: "center"
        });
      });
    },
    // 撤除买入单
    dropBuy(id, i, type, sellId, tid) {
      console.log(sellId + "sellID");
      if (sellId == 0) {
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/offTheHhelfApv",
          {
            ptpid: id,
            order_type: type,
            token: sha1(id + type + this.$store.state.str)
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          if (res.data.status == 1) {
            this.list.splice(i, 1);
            this.init();
            this.$message({
              message: this.$t("sellout.s47"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("sellout.s48"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          plus.nativeUI.toast(this.$t("err.info"), {
            verticalAlign: "center"
          });
        });
      } else {
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/buyCancelTheOrder",
          {
            ptptid: tid,
            order_type: type,
            token: sha1(tid + type + this.$store.state.str)
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          if (res.data.status == 1) {
            this.list.splice(i, 1);
            this.init();
            this.$message({
              message: this.$t("sellout.s47"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("sellout.s48"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          plus.nativeUI.toast(this.$t("err.info"), {
            verticalAlign: "center"
          });
        });
      }
    },
    // 查看信息
    watch(b, a, n, m) {
      if (this.$i18n.locale == "cn") {
        var str =
        "<span>姓名:</span>" +
        n +
        "<br><span>银行账号:</span>" +
        m +
        "<br>" +
        "<span>开户行:</span>" +
        b +
        "<br>" +
        "<span>开户支行:</span>" +
        a;
      } else {
        var str =
        "<span>Name:</span>" +
        n +
        "<br><span>Number:</span>" +
        m +
        "<br>" +
        "<span>Bank:</span>" +
        b +
        "<br>" +
        "<span>Bank Branch:</span>" +
        a;
      }
      this.$alert(str, this.$t("sellout.s53"), {
        dangerouslyUseHTMLString: true,
        showClose: false
      });
    },
    // 上传按钮
    upload(id, i) {
      var _this = this;
      plus.nativeUI.confirm(_this.$t("tixian.tip25"),function(e){
        if(e.index==0){

          if (!_this.src) {
            _this.$message({
              message: _this.$t("subaic.s14"),
              duration: 1500
            });
            return false;
          }
          _this.loading2 = true;
          _this.$http
          .post(
            _this.$store.state.url + "Api/Ptptrade/buyUploadBoucher",
            {
              ptptid: id,
              path: _this.src["src" + i],
              token: sha1(id + _this.src["src" + i] + _this.$store.state.str)
            },
            {
              headers: {},
              emulateJSON: true
            }
            )
          .then(res => {
            _this.loading2 = false;
            if (res.data.status == 1) {
              _this.isUpload = true;
              _this.num3 = i;
              if(_this.timer){
                clearInterval(_this.timer)
              }
              var time1 = res.data.info.pay_time * 1 + 48 * 3600;
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
              if (h < 10) {
                h = "0" + h;
              }
              if (val <= 0) {
                _this.Time = _this.$t("subaic.s16");
              } else {
                _this.Time = h + ":" + m + ":" + s;
              }
              _this.timer = setInterval(function() {
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
                if (h < 10) {
                  h = "0" + h;
                }
                if (val <= 0) {
                  _this.Time = _this.$t("subaic.s16");
                } else {
                  _this.Time = h + ":" + m + ":" + s;
                }
              }, 1000);
              _this.$message({
                message: _this.$t("subaic.s15"),
                duration: 1500
              });
            } else {
              _this.$message({
                message: _this.$t("certify.tip2"),
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
    init() {
      var _this = this;
      var params = new URLSearchParams();
      params.append("member_id", _this.$store.state.member_id);
      params.append(
        "token",
        sha1(_this.$store.state.member_id + _this.$store.state.str)
        );
      let pro = new Promise(function(resolve, reject) {
        axios
        .post(
          _this.$store.state.url + "Api/Ptptrade/entrustBuyLstApv",
          params,
          {
            headers: {
              "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8"
            }
          }
          )
        .then(res => {
          _this.loading = false;
          if (res.data.status == 1) {
            _this.list = res.data.info;
            var obj = {};
            for (let j = 0; j < _this.list.length; j++) {
              eval("obj.src" + j + "=" + j);
            }
            _this.obj1 = obj;
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
      .then(res => {})
      .catch();
    },
    chat(id) {
      this.$router.push({ path: "/chat", query: { id: id } });
    },
    // this.upDown(i, img, time, pay, state, type, sellId, 48, true);
    upDown(i, img, time, pay, state, type, sellId, num, isTrade) {
      console.log(num,time,pay,isTrade)
      var _this = this;
      if (isTrade == true) {
        var time1 = pay * 1 + num * 3600;
      } else {
        var time1 = time * 1 + num * 3600;
      }
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
      if (h < 10) {
        h = "0" + h;
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
        if (h < 10) {
          h = "0" + h;
        }
        if (val <= 0) {
          _this.Time = _this.$t("subaic.s16");
        } else {
          _this.Time = h + ":" + m + ":" + s;
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less">
  .el-message-box__title{
    height:30px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background:#1d1c1c;
    color:#fff !important;
    line-height:30px !important;
    text-align: center;
  }
  .el-message-box {
    width: 75% !important;
    border:none !important;
  }
  .el-message-box__header {
    padding: 0 !important;
  }
  .el-button--primary {
    background-color: #f1b90c !important;
    border-color: #f1b90c !important;
  }
  .el-message-box__message {
    p {
      span {
        display: inline-block;
        width: 30%;
        text-align: right;
        margin-right: 10px;
        margin-top: 5px;
      }
    }
  }
  .sell-out {
    position: relative;
    height:72%;
    .wrapper {
      height:100%;
      overflow: hidden; 
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
    .top {
      width: 100%;
      white-space: nowrap;
      .left {
        font-weight: bold;
        color:red;
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
            width: 33.333%;
            text-align: center;
          }
        }
        .second {
          height: 35px;
          line-height: 35px;
          padding-right: 15px;
          span {
            display: inline-block;
            width: 33.333%;
            text-align: center;
          }
        }
      }
    }
    .btns {
      width: 100%;
      padding: 5px 15px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 10px;
      .drop {
        width: 48%;
        background-color: transparent;
        border: 1px solid #f1b90c;
        border-radius: 4px;
        color: #f1b90c;
        display: inline-block;
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
      padding: 10px 5px 0 5px;
      box-sizing: border-box;
      .btns {
        padding: 10px;
        border: none;
        .edit,
        .up {
          position:relative;
          color: #666;
          width: 24% !important;
          display: inline-block;
          border-radius: 4px;
          background-color: transparent;
          border: 1px solid #666;
          .el-icon-arrow-down {
            margin-left: 10px;
            font-size: 15px;
          }
        }
        .up{
          color:#f1b90c;
          border-color:#f1b90c;
        }
        .disabled{
         color: #666;
         border-color:#666;
       }
     }
   }
   .colls {
    width: 100%;
    height: 70px;
    white-space: nowrap;
    display: flex;
    padding:0 10px;
    box-sizing: border-box;
    .td {
      width: 23%;
      display: inline-block;
      div {
        // font-size: 12px;
      }
      div:nth-child(1) {
        color: #333;
      }
      div:nth-child(2) {
        margin-top: 10px;
        color: #333;
        margin-top: 10px;
      }
      div:nth-child(3) {
        margin-top: 10px;
      }
    }
    .td:last-child {
      text-align: right;
    }
  }
  .inline {
    display: inline-block;
    margin-top: 0 !important;
    border:1px solid #aaa;
    border-radius: 3px;
  }
  .align {
    text-align: center;
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
      /*      padding: 1.5rem;*/
      position:relative;
      background-color: white;
      text-align: center;
      width: 5rem;
      margin-top: 0 !important;
      height: 5rem;
      input {
        left: 0;
      }
      .showImg,
      .showImg1,
      .showImg2 {
        width: 5rem;
        height: 5rem;
        position: absolute;
        top:0;
        left:0;
        z-index:999;
      }
      #pic,
      #pic1,
      #pic2 {
        display: inline-block;
        opacity: 0;
        z-index: 101;
        position:absolute;
        top:0;
      }
      .fa-camera {
        font-size: 24px;
        color: rgb(137, 143, 143);
        z-index: 100;
        position:absolute;
        left: 50%;
        top: 50%;
        transform:translate3d(-50%,-50%,0);
      }
    }
  }
}
.load-content {
  align-self: auto;
  margin-top: 250px;
}

.wrapperbuy{
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
  border: 1px solid rgb(175, 188, 204);
}
.opacity {
  opacity: 1;
}
.margin0 {
  margin-top: 0 !important;
}
.msgicon {
  color: red;
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 65%;
}
.proxysell .wrapper .scroll{
  padding-bottom:50px;
}
</style>
