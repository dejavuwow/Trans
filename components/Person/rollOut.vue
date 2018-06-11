<template>
  <transition :name="animate">
    <div class="roll-out"
    v-loading="loading2"
    :element-loading-text="$t('err.tip14')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :fullscreen="false">
    <div class="header">
      <h1>
        <span class="left_icon" @click="jumpBack()">&#xe625;</span>
        {{$t('transfer.tip14')}}
        <span class="el-icon-tickets" @click="jump()"></span>
      </h1>
    </div>
    <div class="coin-info">
      <p><span>{{$t('transfer.tip15')}}:</span><span class="big-font">{{av_num*1|xiaoshu2}}</span></p>
      <p><span>{{$t('transfer.tip16')}}:</span><span class="big-font">{{frozen_num*1|xiaoshu2}}</span></p>
    </div>
    <div class="inputs" @click="goNext()">
      <div class="label">{{$t('transfer.tip17')}}</div>
      <span class="address" v-if="address==''"></span>
      <span class="address" v-else>{{address.substr(0,8)}}********{{address.substr(34,42)}}</span>
      <span class="fa fa-angle-right"></span>
    </div>
    <div class="input-item">
      <input type="text" :placeholder="$t('transfer.tip18')" v-model="num">
    </div>
    <div class="input-item">
      <input type="password" :placeholder="$t('transfer.tip19')" v-model="pwd">
    </div>
    <div class="btn">
      <button type="button" @click="out()">{{$t('transfer.tip20')}}</button>
    </div>
  </div>
</transition>
</template>

<script>
  import sha1 from "sha1";
  import md5 from "md5";
  export default {
    data() {
      return {
        animate: "slide-right",
        address: this.$store.state.address,
        num: "",
        pwd: "",
        loading2: false
      };
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/wallet" || to.path == "/out-record") {
        this.animate = "slide-left";
      } else {
        this.animate = "slide-right";
      }
      if (to.path == "/Person") {
        this.$store.commit("changeRes", "out");
        this.$store.commit("changeAddress", "");
      }
      setTimeout(function() {
        next();
      }, 50);
    },
    created() {
      if (
        this.$store.state.urlRes == "wallet" ||
        this.$store.state.urlRes == "out-record"
        ) {
        this.animate = "slide-left";
    }
  },
  computed: {
    pwdMd5() {
      return md5(this.pwd);
    },
    av_num() {
      return this.$store.state.av_num;
    },
    frozen_num() {
      return this.$store.state.frozen_num;
    }
  },
  methods: {
    goNext() {
      this.$router.push("/wallet");
    },
    jumpBack() {
      this.$store.commit("changeRes", "out");
      this.$store.commit("changeAddress", "");
      this.$router.push("/Person");
    },
    jump() {
      this.$router.push("/out-record");
    },
    out() {
      var th = this;
      plus.nativeUI.confirm(th.$t("tixian.tip25"),function(e){
        if(e.index==0){
        if (!th.address) {
          th.$message({
            message: th.$t("tixian.tip22"),
            duration: 1500
          });
          return false;
        }
        if (!th.num) {
          th.$message({
            message: th.$t("tixian.tip23"),
            duration: 1500
          });
          return false;
        }
        if (!th.pwd) {
          th.$message({
            message: th.$t("tixian.tip24"),
            duration: 1500
          });
          return false;
        }
        th.loading2 = true;
        th.$http
        .post(
          th.$store.state.url + "Api/PersonalCenter/subTurnOutApv",
          {
            member_id: th.$store.state.member_id,
            num: th.num,
            address: th.address,
            pwdtrade: th.pwdMd5,
            token: sha1(
              th.$store.state.member_id +
              th.num +
              th.address +
              th.pwdMd5 +
              th.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(res => {
          th.loading2 = false;
          if (res.data.status == 13) {
            th.num = "";
            th.pwd = "";
            th.$message({
              message: th.$t("tixian.tip17"),
              duration: 1500
            });
          } else if (res.data.status == 1) {
           th.num = "";
           th.pwd = "";
           th.$message({
            message: th.$t("tixian.tip13"),
            duration: 1500
          });
         } else if (res.data.status == "03") {
          th.$message({
            message: th.$t("tixian.tip8"),
            duration: 1500
          });
        } else if (res.data.status == "04") {
          th.$message({
            message: th.$t("tixian.tip9"),
            duration: 1500
          });
        } else if (res.data.status == "05") {
          th.$message({
            message: th.$t("tixian.tip10"),
            duration: 1500
          });
        } else if (res.data.status == "06") {
          th.$message({
            message: th.$t("tixian.tip12"),
            duration: 1500
          });
        } else if (res.data.status == 11) {
          th.$message({
            message: th.$t("tixian.tip13"),
            duration: 1500
          });
        } else if (res.data.status == 10) {
          th.$message({
            message: th.$t("tixian.tip16"),
            duration: 1500
          });
        } else {
          th.$message({
            message: th.$t("tixian.tip15"),
            duration: 1500
          });
        }

        th.again();
      })
        .catch(function(re) {
          th.loading2 = false;
          th.$message({
            message: th.$t("err.info"),
            duration: 1500
          });
        });
        }
      }); 
      
    },
    again() {
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
    }
  }
};
</script>

<style lang="less">
  .roll-out {
    position: absolute;
    width: 100%;
    .header {
      background-color: rgb(31, 25, 35);
      text-align: center;
      padding-right: 15px;
      position: relative;
      .left_icon {
        left: 15px;
        top: -7.5px;
      }
      .el-icon-tickets {
        font-size: 20px;
        position: absolute;
        line-height: 25px;
        right: 0;
      }
    }
    .coin-info {
      border-radius: 6px;
      margin:15px;
      height:170px;
      position: relative;
      background:#3e3730 url(../../assets/img/transout.png) no-repeat 110% 0; 
      background-size:contain;
      &::after{
        width:50%;
        content:"";
        display: block;
        height:1px;
        background: linear-gradient(90deg,#a1968f 0,#3e3730 100%);
        position:absolute;
        top:50%;
      }
      p {
        height:50%;
        width:40%;
        text-align: center;
        color: #a1968f;
        padding:10px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction:column;
        justify-content: space-around;
        align-items: center;
        .big-font {
          color: #fff;
          font-size: 20px;
          font-weight: 500;
        }
        span {
          display:block;
          margin-right: 10px;
        }
        span:nth-child(1) {
          min-width: 65px;
        }
      }
    }
    .inputs {
      line-height: 45px;
      border-bottom: 1px solid  #44352f;
      margin: 0 15px;
      .label {
        display: inline-block;
        color: #a1968f;
      }
      .address {
        margin-left: 25px;
        display: inline-block;
      }
      .fa {
        font-size: 25px;
        float: right;
        margin-top: 10px;
        color: #a1968f;
      }
    }
    .input-item {
      border-bottom: 1px solid  #44352f;
      margin: 0 15px;
      input {
        color: #a1968f;
      }
    }
    .btn {
      margin: 40px 15px;
      button {
        border-radius: 4px;
        background-color: #f1b90c;
        color: black;
      }
    }
  }
</style>
