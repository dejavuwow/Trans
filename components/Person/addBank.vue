<template>
  <transition name='slide-right'>
    <div class="add-bank">
      <p class="tips">{{$t('bank.tip4')}}.</p>
      <div class="wrapper" ref="wrapper">
        <div class="input-content">
          <div class="input-item">
            <div class="label">{{$t('bank.tip5')}}</div>
            <!-- <span>{{name}}</span> -->
            <input type="text" name="" id="" v-model="name">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip6')}}</div>
            <!--  <span>{{card}}</span> -->
            <input type="text" name="" id="" v-model="card">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip7')}}</div>
            <!--  <span>{{$t('bank.tip22')}}</span> -->
            <input type="text" name="" id="" v-model="card_type">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip8')}}</div>
            <input type="text" name="" id="" :placeholder="$t('bank.tip9')" v-model="bankname">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip10')}}</div>
            <input type="text" name="" id="" :placeholder="$t('bank.tip11')" v-model="bank_branch">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip12')}}</div>
            <input type="text" name="" id="" :placeholder="$t('bank.tip13')" v-model="cardnum">
          </div>
          <div class="input-item">
            <div class="label">{{$t('bank.tip14')}}</div>
            <input type="text" name="" id="" :placeholder="$t('bank.tip21')" v-model="phone">
          </div>
          <div class="input-item">
            <div class="label">{{$t('register.code')}}</div>
            <input type="text" :placeholder="$t('register.code1')" v-model="sms" class="short">
            <button  @click="sendCode()" :class="timer!=null? 'sms-btn1':'sms-btn'">{{info}}</button>
          </div>
          <div class="btn">
            <button type="button" @click="confirm">{{$t('bank.tip15')}}</button>
          </div>
          <button class="btn2" @click="cancel">{{$t('bank.tip16')}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  export default {
    data() {
      return {
        sms: "",
        info: this.$t("register.tip5"),
        timer: null,
        count: "",
        ctype: 8,
        name: this.$route.query.name,
        card: this.$route.query.card,
        card_type: this.$t("bank.tip22"),
        bankname: "",
        cardnum: "",
        phone: "",
        sms: "",
        bank_branch:"",

      };
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
  beforeRouteLeave(to, from, next) {
    if (to.path == "/bank") {
      this.$store.commit("changeRes", "addbank");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    sendCode() {
      var _this = this;
      if (!_this.$store.state.user) {
        this.$message({
          message: this.$t("register.tip8"),
          duration: 1500
        });
        return false;
      }
      if (!this.timer) {
        _this.$http
        .post(
          _this.$store.state.url + "Api/Sendcode/sendsms",
          {
            ctype: _this.ctype,
            userphone: _this.$store.state.user,
            token: sha1(
              _this.ctype + _this.$store.state.user + _this.$store.state.str
              )
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(response => {
          if (response.data.status == 1) {
            this.$message({
              message: this.$t("register.tip9"),
              duration: 1500
            });
            var TIME_COUNT = 60;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                  this.info =
                  this.$t("register.tip6") + "(" + this.count + "s)";
                } else {
                  this.info = this.$t("register.tip6");
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.$message({
              message: this.$t("register.tip10"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          this.$message({
            message: this.$t("err.info"),
            duration: 1500
          });
          console.log(response);
        });
      }
    },
    cancel() {
      this.$store.commit("changeRes", "addbank");
      this.$router.push("/bank");
    },
    confirm() {
      if (
        !this.bankname ||
        !this.cardnum ||
        !this.phone ||
        !this.sms ||
        !this.bank_branch
        ) {
        this.$message({
          message: this.$t("updateAds.tip1"),
          duration: 1500
        });
      return false;
    }
    this.$http
    .post(
      this.$store.state.url + "Api/Bank/addBank",
      {
        bank_branch:this.bank_branch,
        member_id: this.$store.state.member_id,
        cardname: this.name,
        card_no: this.card,
        card_type: this.card_type,
        cardnum: this.cardnum,
        phone: this.phone,
        smscode: this.sms,
        bankname: this.bankname,
        token: sha1(
          this.bank_branch +
          this.$store.state.member_id +
          this.name +
          this.card +
          this.card_type +
          this.cardnum +
          this.phone +
          this.sms +
          this.bankname +
          this.$store.state.str
          )
      },
      {
        headers: {},
        emulateJSON: true
      }
      )
    .then(res => {
      if (res.data.status == 1) {
        this.name = res.data.info.name;
        this.card = res.data.info.card_no;
        this.$store.commit("changeRes", "addbank");
        this.$message({
          message: this.$t("setBank.tip5"),
          duration: 1500
        });
        this.$router.push("/bank");
      } else if (res.data.status == 2) {
        this.$message({
          message: this.$t("setBank.cer"),
          duration: 1500
        });
      } else if (res.data.status == 3) {
        this.$message({
          message: this.$t("err.tip7"),
          duration: 1500
        });
      } else if (res.data.status == 4) {
        this.$message({
          message: this.$t("payPwd.tip11"),
          duration: 1500
        });
      } else if (res.data.status == 5) {
        this.$message({
          message: this.$t("setBank.tip12"),
          duration: 1500
        });
      } else {
        this.$message({
          message: this.$t("setBank.tip6"),
          duration: 1500
        });
      }
    })
    .catch(function(res) {
      plus.nativeUI.toast(this.$t("err.info"), {
        verticalAlign: "center"
      });
    });
  }
}
};
</script>

<style lang="less">
  .add-bank {
    position: absolute;
    height:100%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .tips {
      color: #f1b90c;
      font-size: 12px;
      line-height: 40px;
      border-bottom: 1px solid #44352f;
      position: relative;
      z-index: 100;
      background: #1d1c1c;
      text-overflow:ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .input-content {
      white-space: nowrap;
      min-height: 101%;
    }
    .input-item {
      padding: 5px 0;
      border-bottom: 1px solid #44352f;
      width: 100%;
      box-sizing: border-box;

      .label {
        width: 25%;
        display: inline-block;
        text-align: left;
        margin-left: 10px;
        color: #a3aab4;
      }
      input {
        width: 75%;
        border: none;
        text-align: left;
        color: #d6e9fc;
      }
      .short {
        width: 55%;
      }
      .icon {
        display: inline-block;
        float: right;
        line-height: 54px;
      }
      .fa-angle-right {
        font-size: 25px;
      }
      span {
        display: inline-block;
        padding: 15px 0;
        color: #d6e9fc;
        width: 75%;
      }
    }
    .sms-btn {
      display: inline-block;
      width: 28%;
      background-color: rgb(255, 195, 52);
      border-radius: 4px;
      color: rgb(51, 51, 51);
      height: 25px;
      line-height: 36px;
      height: 36px;
      margin-top: 5px;
      float: right;
    }
    .sms-btn1 {
      background-color: rgb(175, 188, 204) !important;
      display: inline-block;
      width: 28%;
      border-radius: 4px;
      color: rgb(51, 51, 51);
      height: 25px;
      line-height: 36px;
      height: 36px;
      margin-top: 5px;
      float: right;
    }
    .short {
      width: 35% !important;
    }
    .btn {
      button {
        border-radius: 4px;
        background-color: #f1b90c;
        color: rgb(93, 67, 18);
        margin-top: 20px;
        line-height: 38px;
        font-weight: bold;
      }
    }
    .btn2 {
      background-color: rgb(123, 135, 147);
      border-radius: 4px;
      margin-top: 20px;
    }
    .wrapper {
      position:absolute;
      top:41px;
      bottom:0;
      left:20px;
      right:20px;
      .input-content {
        min-height: 101%;
      }
    }
  }
</style>
