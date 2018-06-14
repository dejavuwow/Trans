<template>
 <transition name="slide-right">
  <div class="body_wrap register" 
  v-loading="loading2"
  :element-loading-text="$t('register.tip7')"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0)"
  :fullscreen="false">
  <Header :title="title">
    <router-link :to="path" slot="left" class="fa fa-angle-left" tag="i"></router-link>
    <i slot="right"></i>
  </Header>
  <div class="maincontent1">
    <div>
      <div class="input-item">
        <div class="label">{{$t('register.country')}}</div>
        <select name="" id="phone" v-model="country_selected">
          <option v-for="coun in countrys">{{coun}}</option>
        </select>
        <div class="select"><span class="el-icon-arrow-right"></span></div>
      </div>
      <div class="input-item">
        <div class="label">+{{qu_num}}</div>
        <input type="text" :placeholder="$t('register.phone')" v-model="user">
      </div>
      <div class="input-item">
        <div class="label">{{$t('register.img')}}</div>
        <input type="text" :placeholder="$t('register.img')" v-model="imgcode" class="short">
        <Ide @imgMsg="showImg" class="sms-btn"></Ide>
      </div>
      <div class="input-item">
        <div class="label">{{$t('register.code')}}</div>
        <input type="text" :placeholder="$t('register.code1')" v-model="sms" class="short">
        <button  @click="sendCode()" :class="timer!=null? 'sms-btn1':'sms-btn'">{{info}}</button>
      </div>
      <div class="input-item">
        <div class="label">{{$t('register.pwd')}}</div>
        <input type="password" :placeholder="$t('register.tip2')" v-model="pwd">
      </div>
      <div class="input-item">
        <div class="label">{{$t('register.repwd')}}</div>
        <input type="password" :placeholder="$t('register.repwd')" v-model="pwd_sure">
      </div>
      <div class="input-item">
        <div class="label">{{$t('register.ppwd')}}</div>
        <input type="password" :placeholder="$t('register.tip21')" v-model="pwdtrade">
      </div>
      <div class="input-item">
        <div class="label long">{{$t('register.reppwd')}}</div>
        <input type="password" :placeholder="$t('register.reppwd')" v-model="re_pwdtrade" class="middle">
      </div>
    </div>
    <div>
      <router-link to="/register">
        <button class="register1 btn-gold" @click="postMsg()">{{$t('register.reg')}}</button>
      </router-link>
    </div>
    <div class="align-center"><i class="protocol fa fa-check-circle-o iconcheck"></i> {{$t('register.tip17')}}<div class="protocol">《{{$t('register.tip18')}}》</div></div> 
  </div>
</div>
</transition>
</template>
<script>
  import $ from "jquery";
  import md5 from "md5";
  import sha1 from "sha1";
  import country from "../../assets/js/config";
  import Ide from "./idenrun"; 
  import Header from "../Public/header";
  export default {
   // linear-gradient(to right, yellow 0%,white 100%)
   components:{Ide,Header},
   data() {
    return {
      title:this.$t("login.register"),
      show: true,
      info: this.$t("register.tip5"),
      timer: null,
      count: "",
      pwd: "",
      user: "",
      pwdtrade: "",
      re_pwdtrade: "",
      pwd_sure: "",
      url: this.$store.state.url + "Api/Reg/verificationCode",
      sms: "",
      countrys: country.country_cn,
      country_selected: "China-中国-86",
      loading2: false,
      imgTxt:"",
      imgcode:"",
    };
  },
  mounted() {},
  computed: {
    path(){
      return this.$route.query.path + "?path=register"
    },
    msgType(){
      return this.$i18n.locale === "zh-CN"?"msg_ch":"msg_en";
    },
    type(){
      return  this.$i18n.locale === "zh-CN"?1:2
    },
    qu_num() {
      return this.country_selected.substring(
        this.country_selected.lastIndexOf("-") + 1
        );
    },
    country() {
      return this.country_selected.substring(
        this.country_selected.indexOf("-") + 1,
        this.country_selected.lastIndexOf("-")
        );
    },
    pwdMd5() {
      return md5(this.pwd);
    },
    pwdtradeMd5() {
      return md5(this.pwdtrade);
    },
    token() {
      return md5(
        this.user + "," +
        this.qu_num + ","+
        this.pwd + "," +
        this.pwd_sure + ","+
        this.pwdtrade + ","+
        this.re_pwdtrade + ","+
        this.sms + "," +
        this.country +","+
        this.$store.state.str
        );
    },

    // phone: _this.user,
    // area: _this.qu_num,
    // logpwd: _this.pwd,
    // logpwd_confirm: _this.pwd_sure,
    // tradepwd: _this.pwdtrade,
    // tradepwd_confirm: _this.re_pwdtrade,
    // code: _this.sms,
    // country: _this.country,
    // accessToken: _this.token
    token1() {
      return md5(this.type +","+ this.user +"," + this.$store.state.str);
    }
  },
  created() {},
  methods: {
    showImg(txt){
      this.imgTxt = txt; 
    },
    back() {
      this.$router.push({ name: this.$route.params.path, params: { t: "1" } });
    },
    toggle() {
      this.show = !this.show;
    },
    postMsg() {
      var _this = this;
      var reg = /^\d{5,20}$/;
      var reg1 = /^\d{6}$/;
      var reg2 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (!reg.test(_this.user)) {
        this.$message({
          message: this.$t("register.tip1"),
          duration: 1500
        });
        return false;
      }
      if(this.imgcode !== this.imgTxt){
        this.$message({
          message: this.$t("register.tip13"),
          duration: 1500
        });
        return false;
      }
      if (!reg2.test(_this.pwd)) {
        this.$message({
          message: this.$t("register.tip22"),
          duration: 1500
        });
        return false;
      }
      if (!reg1.test(_this.pwdtrade)) {
        this.$message({
          message: this.$t("register.tip3"),
          duration: 1500
        });
        return false;
      }
      if (_this.pwdtrade != _this.re_pwdtrade) {
        this.$message({
          message: this.$t("register.tip20"),
          duration: 1500
        });
        return false;
      }
      if (_this.pwd != _this.pwd_sure) {
        this.$message({
          message: this.$t("register.tip19"),
          duration: 1500
        });
        return false;
      }
      if (!_this.sms) {
        this.$message({
          message: this.$t("register.tip4"),
          duration: 1500
        });
        return false;
      }
      this.loading2 = true;
      this.$http
      .post(
        this.$store.state.url + "api/Login/register",
        {
          phone: _this.user,
          area: _this.qu_num,
          logpwd: _this.pwd,
          logpwd_confirm: _this.pwd_sure,
          tradepwd: _this.pwdtrade,
          tradepwd_confirm: _this.re_pwdtrade,
          code: _this.sms,
          country: _this.country,
          accessToken: _this.token
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(response => {
        this.loading2 = false;
        response = response.body;
        if (response.error_code == 0) {
          this.$message({
            message: response.data[this.msgType],
            duration: 1500
          });
          _this.$router.push({ path: "/", params: { t: "1" } });
          _this.user = "";
          _this.pwd = "";
          _this.pwdtrade = "";
          _this.verify_code = "";
          _this.sms = "";
          _this.info = _this.$t("register.tip5");
          clearInterval(_this.timer);
          _this.timer = null;
        }else {
          this.$message({
            message: response.data[this.msgType],
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
        console.log(response);
      });
    },
    sendCode() {
      var _this = this;
      if (!_this.user) {
        _this.$message({
          message: _this.$t("register.tip8"),
          duration: 1500
        });
        return false;
      }
      if (!this.timer) {
        _this.$http
        .post(
          _this.$store.state.url + "api/code/getcode",
          {
            type: _this.type,
            phone:_this.user,
            accessToken: _this.token1
          },
          {
            headers: {},
            emulateJSON: true
          }
          )
        .then(response => {
         response = response.body;
         if (response.error_code == 0) {
          _this.$message({
            message: _this.$t("register.tip9"),
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
          _this.$message({
            message: response.data[this.msgType],
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
    }
  }
};
</script>
<style lang="less">
  .intl-tel-input {
    margin: 0;
  }
  .register {
  
    position: absolute;
    z-index: 99;
    width: 100%;
    box-sizing: border-box;
    .maincontent1{
      padding:0 15px;
    }
    h1 {
      font-size: 16px;
      margin-bottom: 20px;
      line-height: 40px;
    }
    input {
      padding: 15px 0;
      margin: 0;
      width: 65%;
      text-align: left;
      border: none;
      white-space: nowrap;
      color: #d6e9fc;
    }
    .login1 {
      background-color: #898f8f;
      border: 1px solid #898f8f;
      color: #feffff;
      opacity: 0.8;
      border-radius: 4px;
      margin-top: 30px;
    }
    .label {
      display: inline-block;
      width: 35%;
      color: #97989a;
    }
    .input-item {
      border-bottom: 1px solid  #44352f;
      white-space: nowrap;
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
      width: 35%;
    }
    .long {
      width: 35%;
    }
    .middle {
      width: 65%;
    }
    .btn-gold {
      margin-top: 30px;
      background-color: rgb(255, 195, 52);
      border-radius: 4px;
      color: rgb(51, 51, 51);
    }
    .align-center {
      font-size:11px;
      margin-top: 10px;
      color: rgb(214, 233, 252);
    }
    .protocol {
      color: rgb(255, 195, 52);
      display: inline-block;
    }
    .iconcheck{
      font-size:14px;
    }
    .back {
      position: absolute;
      left: 0;
      top: 10px;
      font-size: 25px;
    }
    #phone {
      width: 55%;
      background: none;
      border: none;
      height: 46px;
      color: #d6e9fc;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      outline: none;
    }
    .select {
      display: inline-block;
      width: 5%;
      float: right;
      text-align: right;
      vertical-align: middle;
      line-height: 46px;
      margin-right: 5px;
      span {
        font-size: 18px;
        color: rgb(255, 195, 52);
      }
    }
  }
  .intl-tel-input.allow-dropdown input {
    padding-left: 0 !important;
  }
  .intl-tel-input {
    display: block !important;
    margin-bottom: 20px;
  }
  .intl-tel-input .country-list .country-name {
    color: rgb(0, 0, 0);
  }
</style>





