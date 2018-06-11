<template>
  <transition :name="animate">
    <div :class="banks==''? 'bank1':'bank'">
      <div class="header">       
        <h1>
          <span class="left_icon" @click="jumpBack()">&#xe625;</span>
          {{$t('bank.tip1')}}
          <span class="change" @click="edit" v-show="!isShow">&#xe624;</span>
          <span class="change1" @click="complete" v-show="isShow">{{$t('bank.tip18')}}</span>
        </h1>
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="content">
          <div class="bank-info" v-for="(bank,index) in banks" :key='index'>
            <p class="order">{{$t('bank.tip17')}}{{index+1}}</p>
            <div class="card">
              <p>{{bank.bankname}}</p>
              <p class="num">{{bank.cardnum}}</p>
            </div>
            <div class="left" v-show='isShow' @click="def(bank.id,index)">{{$t('bank.tip19')}}</div>
            <div class="right" v-show='isShow' @click="del(bank.id,index)">{{$t('bank.tip20')}}</div>
            <div class="check" v-show="icon==index" v-if="bank.bdefault==0">
              <span class="el-icon-check"></span>
            </div>
            <div class="check" v-else>
              <span class="el-icon-check"></span>
            </div>
          </div>
          <div class="btn">
            <button type="button" @click="goNext" :disabled='disable' :class="disable==true? 'gray':'gold'">+{{$t('bank.tip2')}}</button>
          </div>
          <p class="tips">{{$t('bank.tip3')}}</p>
        </div>
      </div>
      <div class="loading" v-show="loading">
        <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
    </div>
  </transition>
</template>

<script>
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  import vueLoading from "vue-loading-template";
  export default {
    components: {
      vueLoading
    },
    data() {
      return {
        isShow: false,
        name: "",
        card: "",
        animate: "slide-right",
        banks: "",
        disable: false,
        icon: null,
        loading: true
      };
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/addBank") {
        this.animate = "slide-left";
      } else {
        this.$store.commit("changeRes", "bank");
        this.animate = "slide-right";
      }
      setTimeout(function() {
        next();
      }, 50);
    },
    mounted() {
    // 滚动
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true
        });
      } else if (!this.$refs.wrapper) {
        return;
      } else {
        this.scroll.refresh();
      }
    });
  },
  created() {
    if (this.$store.state.urlRes == "addbank") {
      this.animate = "slide-left";
    }
    this.init();
  },
  methods: {
    init() {
      this.$http
      .post(
        this.$store.state.url + "Api/Bank/bankInfolst",
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
        this.loading = false;
        this.name = res.data.info.name;
        this.card = res.data.info.card_no;
        if (res.data.info.banks == null) {
          this.banks = "";
        } else {
          this.banks = res.data.info.banks;
        }
        if (this.banks.length == 3) {
          this.disable = true;
        }
      })
      .catch(function(res) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    jumpBack() {
      this.$store.commit("changeRes", "bank");
      this.$router.push("/Person");
    },
    edit() {
      this.isShow = !this.isShow;
    },
    complete() {
      this.isShow = !this.isShow;
    },
    goNext() {
      this.$router.push({
        path: "/addBank",
        query: { name: this.name, card: this.card }
      });
    },
    del(id, index) {
      this.$http
      .post(
        this.$store.state.url + "Api/Bank/bankDel",
        {
          member_id: this.$store.state.member_id,
          id: id,
          token: sha1(
            this.$store.state.member_id + id + this.$store.state.str
            )
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: this.$t("setBank.tip14"),
            duration: 1500
          });
          this.banks.splice(index, 1);
        } else {
          this.$message({
            message: this.$t("setBank.tip16"),
            duration: 1500
          });
        }
      })
      .catch(function(re) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    def(id, index) {
      this.$http
      .post(
        this.$store.state.url + "Api/Bank/bankDefault",
        {
          member_id: this.$store.state.member_id,
          id: id,
          token: sha1(
            this.$store.state.member_id + id + this.$store.state.str
            )
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: this.$t("setBank.tip13"),
            duration: 1500
          });
          this.icon = index;
          this.init();
        } else {
          this.$message({
            message: this.$t("setBank.tip15"),
            duration: 1500
          });
        }
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
  .bank1 {
    position: absolute;
    width: 100%;
  }
  .bank,
  .bank1 {
    position: absolute;
    width: 100%;
    height:100%;
    .header {
      z-index: 100;
      width: 100%;
      position: absolute;
      top: 0;
      .left_icon {
        top: -7.5px;
        left: 15px;;
      }
      .change {
        font-family: "bank";
        font-size: 25px;
        position: absolute;
        right: 15px;
        top: -5px;
      }
      .change1 {
        position: absolute;
        right: 15px;
        top: -5px;
        line-height: 35px;
      }
    }
    .bank-info:nth-child(1) {
      margin-top: 20px;
    }
    .bank-info {
      margin-top: 25px;
      padding: 0 20px;
      position: relative;
      .order {
        margin: 10px 0;
      }
      .card {
        background:linear-gradient(135deg,rgba(157,141,119,0.9) 0,rgba(62,55,48,0.3) 100%),url(../../assets/img/transout.png) no-repeat 110% 0; 
        background-size:contain;
        width: 100%;
        height: 180px;
        border-radius: 6px;
        padding: 30px;
        box-sizing: border-box;
        position:relative;
        &::after{
          width:50%;
          content:"";
          display: block;
          height:1px;
          background: linear-gradient(90deg,rgba(161,150,143,1) 0,rgba(62,55,48,0) 100%);
          position:absolute;
          top:50%;
          left:0;
        }
        p {
          color: #fff;
          height:50%;
          line-height:60px;
          font-size:16px;
        }
      }
      .left {
        width: 44%;
        color: rgb(167, 161, 139);
        background-color: rgb(240, 228, 204);
        line-height: 35px;
        position: absolute;
        left: 20px;
        bottom: 0;
        border-bottom-left-radius: 6px;
        text-align: center;
      }
      .right {
        width: 44%;
        color: rgb(167, 161, 139);
        background-color: rgb(240, 228, 204);
        line-height: 35px;
        position: absolute;
        right: 20px;
        bottom: 0;
        border-bottom-right-radius: 6px;
        text-align: center;
      }
    }
    .btn {
      margin: 0 20px;
      button {
        border-radius: 4px;
        background-color: #f1b90c;
        color: rgb(93, 67, 18);
        margin-top: 30px;
        line-height: 45px;
        font-weight: bold;
      }
    }
    .tips {
      color: #a1968f;
      text-align: center;
      margin-top: 10px;
    }
    .check {
      position: absolute;
      top: 27px;
      right: 20px;
      width: 20px;
      height: 20px;
      background-color: #f1b90c;
      border-radius: 50%;
      text-align: center;
    }
    .gray {
      background-color: rgb(123, 135, 147) !important;
    }
    .gold {
      background-color: #f1b90c;
      color: rgb(93, 67, 18);
    }
    .wrapper {

      position:absolute;
      width:100%;
      top:45px;
      bottom:0;
      overflow: hidden;
      .content {
        min-height: 101%;
      }
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
  }
</style>
