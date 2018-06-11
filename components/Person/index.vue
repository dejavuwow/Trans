<template>
  <transition :name='animateName'>
    <div class="person">
      <div class="header">
        <router-link to="/personInfo"><span class="fa fa-user-circle-o"></span></router-link>
        <router-link to="/setting"><span class="fa fa-gear"></span></router-link>
      </div>
      <div id="wrapper" class="wrapper" ref="wrapper">
        <div class="person-content">
          <div class="person-info">
            <div class="user-icon">
              <span v-show="!picurl">&#xe65c;</span>
              <img :src="headpic" alt="" v-show="picurl">
            </div>
            <div class="user-info">
              <div>{{user}}
                <span class="indenty" v-if="state==1">{{$t('person.sure2')}}</span>
                <span class="indenty" v-else>{{$t('person.sure1')}}</span>
              </div>
              <div class="gold" @click="goNext">{{$t('person.sure')}}<span class="fa fa-angle-right"></span></div>
            </div>
          </div>
          <div class="fund-info">
            <router-link to="/myCoin">
              <div class="rest">
                <div>APV</div>
                <div class="orange">{{num*1|xiaoshu2}}</div>
              </div>
            </router-link>
            <div class="middle"></div>
            <router-link to="/C2C">
              <div class="order">
                <div>{{$t('person.tip3')}}</div>
                <div class="orange">{{order}} <span class="small">{{$t('person.tip4')}}</span></div>
              </div>
            </router-link>
          </div>
          <div class="bar-items">
            <!-- <router-link to="/roll-in"> -->
            <div class="bar" @click="go('/roll-in')">
              <div class="fa fa-long-arrow-right"></div>
              <div class="in">{{$t('person.tip5')}}<span class="fa fa-angle-right"></span></div>
            </div>
            <!-- </router-link> -->
            <!-- <router-link to="/roll-out"> -->
            <div class="bar" @click="go('/roll-out')">
              <div class="fa fa-long-arrow-left"></div>
              <div class="in">{{$t('person.tip6')}}<span class="fa fa-angle-right"></span></div>
            </div>
            <!-- </router-link> -->
            <!-- <router-link to="/C2C/record"> -->
            <div class="bar" @click="go('/C2C/record')">
              <div class="fa fa-refresh"></div>
              <div class="in">{{$t('person.tip7')}}<span class="fa fa-angle-right"></span></div>
            </div>
            <!-- </router-link> -->
            <!-- <router-link to="bank"> -->
            <div class="bar" @click="go('/bank')">
              <div class="fa fa-credit-card"></div>
              <div class="in none">{{$t('person.tip8')}}<span class="fa fa-angle-right"></span></div>
            </div>
            <!-- </router-link> -->
          </div>
          <router-link to="/service">
            <div class="bar help">
              <div class="fa fa-question-circle"></div>
              <div class="in">{{$t('person.tip9')}}<span class="fa fa-angle-right"></span></div>
            </div>
          </router-link>
        </div>
      </div>
      <Footer1 :isTrades="isTrades" :footname="footname"></Footer1>
      <div class="loading" v-show="ishow">
        <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Footer1 from "../Public/foot";
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  import vueLoading from "vue-loading-template";
  export default {
    name: "Person",
    components: { Footer1, vueLoading },
    data() {
      return {
        footname:"active3",
        scroll: null,
        animateName: "",
        ishow: true,
        num: "",
        user: "",
        state: "",
        order: "",
        headpic:"",
        picurl:"",
        isTrans:"",
        isTrades:this.$store.state.isTrades,
      };
    },
    computed: {},
    mounted() {
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
    },
    beforeRouteLeave(to, from, next) {
      if (
        to.path == "/setting" ||
        to.path == "/personInfo" ||
        to.path == "/roll-out" ||
        to.path == "/bank" ||
        to.path == "/state" ||
        to.path == "/myCoin"
        ) {
        this.animateName = "slide-left";
    } else {
      this.$store.commit("changeRes", "");
      this.animateName = "";
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  created() {
    // 进入页面动画判断
    if (
      this.$store.state.urlRes == "setting" ||
      this.$store.state.urlRes == "info" ||
      this.$store.state.urlRes == "out" ||
      this.$store.state.urlRes == "in" ||
      this.$store.state.urlRes == "bank" ||
      this.$store.state.urlRes == "my"
      ) {
      this.animateName = "slide-left";
  }
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
      if(!!res.data.info.head){
        this.picurl = res.data.info.head;
        this.headpic = this.$store.state.url + res.data.info.head;
      }
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
    // 账户财务信息
    this.$http
    .post(
      this.$store.state.url + "Api/PersonalCenter/turnOutApv",
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
      this.ishow = false;
      this.$store.commit("changeAv", res.data.info.num);
      this.$store.commit("changeFrozen", res.data.info.forzen_num);
      this.$store.commit("changeExchange", res.data.info.price);
    })
    .catch(function(re) {
      this.$message({
        message: this.$t("err.info"),
        duration: 1500
      });
    });
  },
  methods: {
    goNext() {
      if (this.state == "") {
        this.$router.push("certify");
      } else {
        this.$router.push("/state");
      }
    },
    go(data) {
      if (this.$store.state.status != 1) {
        this.$message({
          message: this.$t("err.tip5"),
          duration: 1500
        });
      } else {
        this.$router.push(data);
      }
    }
  }
};
</script>
<style lang="less">
  .person {
    position: absolute;
    width: 100%;
    z-index: 99;
    height: 100%;
    background:linear-gradient(0deg,#352c25 0,#1d1c1c 100%);
    .none {
      border-bottom: none !important;
    }
    #wrapper {
      width:100%;
      position:absolute;
      top:45px;
      bottom:0;
      overflow: hidden;
    }
    .header {
      padding: 0 15px;
      line-height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .fa {
        font-size: 20px;
      }
    }
    .person-content {
      height: 101%;
      padding-bottom: 50px;
      .person-info {
        padding-top:20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        .user-icon {
          position:relative;
          span {
            font-family: "user";
            color: #a3aab4;
            font-size: 80px;
          }
          img{
            width:80px;
            height:80px;
            display: block;
          }
        }
        .user-info {
          margin-top:15px;
          .gold {
            color: #f1b90c;
            margin-top: 5px;
            text-align: center;
          }
          .indenty {
            background-color: rgb(38, 38, 58);
            color: #a3aab4;
            display: inline-block;
            min-width: 50px;
            text-align: center;
            border-radius: 8px;
          }
          .fa-angle-right {
            font-size: 20px;
            margin-left: 10px;
            vertical-align: middle;
            margin-bottom: 3px;
          }
        }
      }
      .bar-items {
        .fa {
          color: #a1968f;
        }
      }
      .bar {
        display: flex;
        line-height: 45px;
        border-bottom: 1px solid #44352f;
        .fa-long-arrow-right,
        .fa-long-arrow-left,
        .fa-refresh,
        .fa-credit-card,
        .fa-question-circle {
          font-size: 18px;
          display: inline-block;
          width: 15%;
          text-align: center;
          margin-top: 12px;
        }
        .fa-refresh {
          font-size: 20px;
          display: inline-block;
          width: 15%;
          text-align: center;
          margin-top: 13px;
        }
        .in {
          display: inline-block;
          width: 89%;
          color: #a1968f;
          .fa {
            font-size: 25px;
            float: right;
            line-height: 45px;
            margin-right: 15px;
          }
        }
      }
      .help {
        color: #a1968f;
        .in {
          border: none;
        }
      }
    }
    .middle {
      display: inline-block;
      width: 2px;
      height: 60px;
      background-image: linear-gradient(
        to bottom,
        rgb(38, 38, 58) 0%,
        #44352f,
        rgb(38, 38, 58) 100%
        );
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
  }
  .fund-info {
    display: flex;
    margin-top: 10px;
    border:1px solid #44352f;
    border-left:none;
    border-right:none;
    padding:5px 0;
    a {
      display: block;
      width: 50%;
      text-align: center;
    }
    .rest {
      width: 50%;
      text-align: center;
      display: inline-block;
      color: #a1968f;
      div{
        margin-top:5px;
      }
    }
    .order {
      text-align: center;
      display: inline-block;
      color: #a1968f;
      div{
        margin-top:5px;
      }
    }
    .orange {
      color: #f1b90c;
      margin-top: 5px;
      font-size: 20px;
    }
    .small {
      font-size: 12px;
      color: #a1968f;
    }
  }
</style>


