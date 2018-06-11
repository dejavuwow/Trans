<template>
  <transition :name="slideName">
    <div class="body_wrap">
      <div class="logbg">

      </div>
      <div class="login" 
      v-loading="loading2"
      :element-loading-text="$t('login.tip7')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :fullscreen="false">

      <div class="input-items">
        <div class="input-item">
          <div class="label">{{$t('register.country')}}</div>
          <select name="" id="phone" v-model="country_selected">
            <option v-for="(coun,i) in countrys" :key="i">{{coun}}</option>
          </select>
          <div class="select"><span class="el-icon-arrow-right"></span></div>
        </div>
        <div class="relative">
          <input type="number" :placeholder="$t('login.phone')"  v-model="user">
        </div>
        <div class="relative">
          <input type="password" :placeholder="$t('login.pwd')" v-model="pwd">
        </div>

      </div>
      <div class="forget">
       <router-link to="/findpwd"> <span class="find">{{$t('login.forget')}}</span></router-link>
     </div>
     <button class="btn-gold" @click="login()">{{$t('login.log')}}</button>
     <div>
      <router-link :to="{name:'register',params:{path:'login'}}">
        <button class="register1">{{$t('login.register')}}</button>
      </router-link>
    </div>
    <div class="langu" @click="qiehuan()">
      <i class="fa fa-exchange"></i>
      <span class="lan">{{$t('login.lan')}}</span>
      <span>{{$t('login.lan1')}}</span>

    </div>
  </div>
</div>
</transition>
</template>
<script>
  import md5 from "md5";
  import sha1 from "sha1";
  import country from "../../assets/js/config";
  export default {
    data() {
      return {
        show: true,
        pwd: "",
        user: "",
        slideName: "slide-left",
        up: true,
        version: "V1.0.0",
        regAgent: /(iPhone|iPad|iPod|iOS|Android)/i,
        phone_style: "",
        version_num: "1",
        countrys: country.country_cn,
        country_selected: "China-中国-86",
        loading2: false,
        need: false
      };
    },
    mounted() {
      document.addEventListener(
        "touchmove",
        function(e) {
          e.returnValue = true;
        },
        false
        );
    },
    created() {
      var _this = this;
      this.animate();
      if (localStorage.getItem("phone") != "") {
        this.user = localStorage.getItem("phone");
      }
      if (localStorage.getItem("lang") === "zh-CN") {
        this.$i18n.locale = "zh-CN";
      } else {
        this.$i18n.locale = "en-US";
      }
    },
    computed: {
      msgType(){
        return this.$i18n.locale === "zh-CN"?"msg_ch":"msg_en";
      },
      qu_num() {
        return this.country_selected.substring(
          this.country_selected.lastIndexOf("-") + 1
          );
      },
      token() {
        return md5(
          this.user + ","+
          this.pwd + ","+
          this.$store.state.str
          );
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/register" || to.path == "/findpwd") {
        this.slideName = "slide-left";
      }
      setTimeout(function() {
        next();
      }, 0);
    },
    methods: {
      animate() {
        if (
          this.$route.params.t == "1" ||
          this.$route.params.t == "2" ||
          this.$route.params.t == "3" ||
          this.$route.params.t == "4"
          ) {
          this.slideName = "slide-left";
      }else{
        this.slideName = "slide-right";
      }
    },
    login() {
      var _this = this;
      if (this.need == true) {
        this.$message({
          message: this.$t("err.tip17"),
          duration: 1500
        });
        return false;
      }
      var userAgent = navigator.userAgent.match(this.regAgent)[1];
      this.phone_style = userAgent;
      var reg = /^\d{5,20}$/;
      if (!reg.test(_this.user)) {
        this.$message({
          message: this.$t("login.tip1"),
          duration: 1500
        });
        return false;
      }
      if (!_this.pwd) {
        this.$message({
          message: this.$t("login.tip2"),
          duration: 1500
        });
        return false;
      }
      this.loading2 = true;
      this.$http
      .post(
        this.$store.state.url + "api/login/login",
        {
          phone:_this.user,
          logpwd: _this.pwd,
          accessToken: _this.token
        },
        {
          headers: {},
          emulateJSON: true
        }
        )
      .then(response => {
        this.loading2 = false;
        if (response.data.error_code == 0) {
          console.log(response)
            // _this.slideName = "slide-bottom";
            localStorage.setItem("uid", response.data.data.data.uid);
            localStorage.setItem("phone", response.data.data.data.phone);
            _this.$router.push({ name: "Home", params: { res: "Home" } });
            this.$message({
              message: this.$t("login.tip3"),
              duration: 1500
            });
          }else{
             console.log(response)
            this.$message({
              message: response.data.data[this.msgType],
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
    },
    // 切换语言
    qiehuan() {
      var _this = this;
      plus.nativeUI.actionSheet(
      {
        title: _this.$t("login.title"),
        cancel: _this.$t("login.option2"),
        buttons: [
        { title: _this.$t("login.option") },
        { title: _this.$t("login.option1") }
        ]
      },
      function(e) {
        if (e.index == 1) {
          _this.$store.commit("changeLan", "1");
          localStorage.setItem("lan", "cn");
          _this.$i18n.locale = "cn";
        } else if (e.index == 2) {
          _this.$store.commit("changeLan", "0");
          _this.$i18n.locale = "en";
          localStorage.setItem("lan", "en");
        }
      }
      );
    }
  }
};
</script>
<style lang="less">
  .logmain{
    width:100%;
    height:100%;
    position:absolute;
  }
  .logbg{
    width:100%;
    height:34vh;
    background-image:url(../../assets/img/loginbg.png);
    background-color:rgba(0,0,0,.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size:100% auto;
    background-blend-mode: overlay;
  }
  .login {
    padding: 0 15px;
    position: absolute;
    z-index: 99;
    width: 100%;
    box-sizing: border-box;
    .langu {
      text-align: center;
      position: relative;
      margin-top: 25px;
      color:#fff;
      i{
        display: block;
        font-size: 20px;
        margin-bottom:2px;
      }
    }
    .langu .lan {
      margin-right: 5px;
    }
    
    .input-items {
      margin-top: 10px;
    }
    .logo img {
      width: 15rem;
    }
    h1 {
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 20px;
      line-height: 40px;
    }
    input {
      margin-bottom: 0 !important;
      text-align: left;
      border-bottom: none !important;
      padding: 15px 0;
      color:  #a1968f;
    }
    .find {
      float: right;
      margin-top: 10px;
    }
    .register1 {
      background-color: rgb(31, 25, 35);
      border: 1px solid rgb(255, 195, 52);
      color: rgb(255, 195, 52);
      margin-top:15px !important;
      border-radius: 4px;
    }
    .btn-gold {
      margin-top: 15px !important;
      background-color: rgb(255, 195, 52);
      border-radius: 4px;
      color: rgb(51, 51, 51);
    }
    .relative {
      border-bottom: 1px solid  #44352f;
    }
    .label {
      display: inline-block;
      width: 35%;
      color: #97989a;
    }
    .input-item {
      border-bottom: 1px solid  #44352f;
      white-space: nowrap;
      line-height: 46px;
      height: 46px;
    }
    .select {
      display: inline-block;
      width: 5%;
      float: right;
      text-align: right;
      vertical-align: middle;
      // line-height: 46px;
      margin-right: 5px;
      margin-top: 4px;
      span {
        font-size: 18px;
        color: rgb(255, 195, 52);
      }
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
  .login .forget,
  .login a {
    color: #898f8f;
  }
</style>


