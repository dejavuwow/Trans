<template>
  <transition :name="animateName">
    <div class="chat">
      <div class="top">
        <span id="count">{{$t('chat.tip1')}}</span>
        <i class="left_icon" @click="closepay()">&#xe625;</i>
      </div>
      <div id="wrapper" class="wrapper" ref="wrapper">
        <div class="scroll">
          <div class="content" id="talkList">
            <div class="talkList" v-if="this.msgLists.status!=2"> 
              <div id="item" v-for="(v,k) in msgLists.info" :key="k" >
                <div style="clear:both">
                  <div class="pho"><span class="tou" :class="v.sender_uid == mid ? 'right' : 'left' ">&#xe65c;</span></div>
                  <div class="listText" :class="v.sender_uid == mid ? 'right' : 'left' ">
                    <span :class="v.sender_uid == mid ? 'right1' : 'left1' ">{{v.content}}</span>
                  </div>
                </div>
                <div class="listTime">
                  <span>{{v.create_time}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <input id="msg" 
        v-model="value"
        type="text" 
        :placeholder="$t('chat.tip3')"
        @keyup.enter="sendValue">
        <i class="fa fa-paper-plane" aria-hidden="true" @click="sendValue" title="发送"></i>
      </div>
      <div class="loading" v-show="ishow">
        <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
      <div class="loading" v-show="ishow1">
        <div class="load-content"><vue-loading type="spin" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
    </div>
  </transition>
</template>

<script>
  import axios from "axios";
  import $ from "jquery";
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  import vueLoading from "vue-loading-template";
  export default {
    name: "chat",
    components: {
      vueLoading
    },
    data() {
      return {
        animateName: "slide-right",
        value: "",
        msgLists: "",
        lov: true,
        mid: this.$store.state.member_id,
        scroll: null,
        ishow: true,
        ishow1:false
      };
    },
    methods: {
      closepay() {
        this.$router.back(-1);
      },
    // 发送消息
    sendValue() {
      let _this = this;
      if(!_this.value) return;
      this.ishow1=true;
      var params = new URLSearchParams();
      params.append("member_id", _this.$store.state.member_id);
      params.append("content", _this.value);
      params.append(
        "token",
        sha1(
          _this.$store.state.member_id + _this.value + _this.$store.state.str
          )
        );
      axios
      .post(_this.$store.state.url + "Api/Ptptrade/addkefuRecords", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })
      .then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: this.$t("register.tip9"),
            duration: 1500
          });
        } else {
          this.$message({
            message: this.$t("register.tip10"),
            duration: 1500
          });
        }
      })
      .catch(err => {});
      this.value = "";
      var params1 = new URLSearchParams();
      params1.append("member_id", this.$store.state.member_id);
      params1.append(
        "token",
        sha1(this.$store.state.member_id + this.$store.state.str)
        );
      axios
      .post(_this.$store.state.url + "Api/Ptptrade/kefuRecordsLst", params1, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })
      .then(res => {
        this.ishow = false;
        this.msgLists = res.data;
        setTimeout(function() {
          $("#item:last-child")[0].scrollIntoView();
        }, 1000);
        this.ishow1 = false;
      })
      .catch(err => {});
    },
    getMsg() {
      let _this = this;
      var params = new URLSearchParams();
      params.append("member_id", this.$store.state.member_id);
      params.append(
        "token",
        sha1(this.$store.state.member_id + this.$store.state.str)
        );
      axios
      .post(_this.$store.state.url + "Api/Ptptrade/kefuRecordsLst", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })
      .then(res => {
        this.ishow = false;
        this.msgLists = res.data;
      })
      .catch(err => {});
    }
  },
  updated() {
    var _this = this;
    setTimeout(function() {
      _this.getMsg();
    }, 1000);
  },
  created() {
    let _this = this;
    var params = new URLSearchParams();
    params.append("member_id", this.$store.state.member_id);
    params.append(
      "token",
      sha1(this.$store.state.member_id + this.$store.state.str)
      );
    axios
    .post(_this.$store.state.url + "Api/Ptptrade/kefuRecordsLst", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    })
    .then(res => {
      this.msgLists = res.data;
      setTimeout(function() {
        if($("#item:last-child")[0]) $("#item:last-child")[0].scrollIntoView();
        _this.ishow = false;
      }, 1000);
    })
    .catch(err => {});
  },
  beforeRouteLeave(to, from, next) {
    this.animateName = "slide-right";
    this.$store.commit("cgAnimate", "back");
    setTimeout(function() {
      next();
    }, 0);
  }
};
</script>

<style lang="less" scoped>
  .chat {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .top {
      width: 100%;
      position: fixed;
      top: 0;
      text-align: center;
      height: 46px;
      z-index: 100;
      span {
        line-height: 46px;
        font-size: 18px;
      }
      .left_icon {
        font-size: 25px;
        position: absolute;
        left: 15px;
        top: 5px;
      }
    }
    #wrapper {
      width: 100%;
      height: auto;
      position: absolute !important;
      top: 46px !important;
      bottom: 46px !important;
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch !important;
      .scroll {
        min-height: 101%;
        width: 100%;
        .content {
          width: 100%;
          padding-bottom: 2rem;
          .talkList {
            width: 100%;
            .listText {
              width: 45%;
              border-radius: 0.5rem;
              padding: 20px;
              background-color: rgb(1, 120, 120);
              text-align: center;
            }
            .left {
              float: left;
              background-color: #26263a;
            }
            .right {
              float: right;
            }
            .listTime {
              clear: both;
              padding: 15px;
              text-align: center;
              color: rgb(120, 120, 120);
              span {
                font-size: 12px;
                padding: 0.25rem 0.5rem;
                border-radius: 0.5rem;
                background-color: #1f242a;
              }
            }
          }
        }
      }
    }
    .bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 46px;
      background-color: #1f242a;
      line-height: 46px;
      input {
        text-align: left;
        border-radius: 5px;
        margin-left: 2rem;
        width: 80%;
        color: #1f242a;
        height: 30px;
        font-size: 16px;
        line-height: 30px;
        background-color: #fff !important;
        padding-left: 15px;
        margin-top: 7px;
      }
      .fa-paper-plane {
        font-size: 20px;
        margin-left: 0.5rem;
      }
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
    .tou {
      font-family: "user";
      color: #a3aab4;
      font-size: 25px;
    }
    .pho {
      .tou {
        margin: 10px;
      }
      .left {
        background-color: transparent !important;
      }
    }
  }
</style>
