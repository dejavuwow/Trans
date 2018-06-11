<template>
  <transition name="slide-right">
  <div class="register"
  v-loading="loading2"
    :element-loading-text="$t('err.tip14')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :fullscreen="false">
      <h1>
        <span class="left_icon" @click="back()">&#xe625;</span>
        {{$t('findPwd.h1')}}</h1>
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
              <input type="text" :placeholder="$t('findPwd.phone')" id="phone" v-model="user">
          </div>
          <div class="input-item">
                <div class="label">{{$t('register.code')}}</div>
                <input type="text" :placeholder="$t('findPwd.code')" v-model="verify_code" class="short">
                <img :src="url" alt="" @click="getImg()" class="img">
          </div>
          <div class="input-item">
                <div class="label">{{$t('register.code1')}}</div>
                <input type="text" :placeholder="$t('findPwd.code1')" v-model="sms" class="short">
                <button  @click="sendCode()" :class="timer!=null? 'sms-btn1':'sms-btn'">{{info}}</button>
          </div>
      </div>
      <div>
              <button class="register1 btn-gold" @click="updatePwd()">{{$t('findPwd.h1')}}</button>
      </div>
  </div>
  </transition>
</template>
<script>
import md5 from "md5";
import sha1 from "sha1";
import country from "../../assets/js/config";
export default {
  name: "updatePwd",
  data() {
    return {
      info: this.$t("findPwd.tip1"),
      timer: null,
      count: "",
      user: "",
      verify_code: "",
      url: this.$store.state.url + "Api/Reg/verificationCode",
      ctype: "5",
      sms: "",
      countrys: country.country_cn,
      country_selected: "China-中国-86",
      loading2: false
    };
  },
  mounted() {},
  computed: {
    qu_num() {
      return this.country_selected.substring(
        this.country_selected.lastIndexOf("-") + 1
      );
    },
    com_user() {
      return this.qu_num + this.user;
    },
    pwdMd5() {
      return md5(this.pwd);
    },
    repwdMd5() {
      return md5(this.repwd);
    },
    weiMd5() {
      return md5(this.verify_code.toLowerCase() + "AICup");
    },
    token() {
      return sha1(
        this.qu_num +
          this.user +
          this.verify_code +
          this.weiMd5 +
          this.sms +
          this.$store.state.str
      );
    },
    token1() {
      return sha1(this.ctype + this.qu_num + this.user + this.$store.state.str);
    }
  },
  methods: {
    updatePwd() {
      var _this = this;
      var reg = /^\d{5,20}$/;
      if (!reg.test(_this.user)) {
        this.$message({
          message: this.$t("findPwd.tip3"),
          duration: 1500
        });
        return false;
      }
      if (!_this.verify_code) {
        this.$message({
          message: this.$t("findPwd.tip6"),
          duration: 1500
        });
        return false;
      }
      if (!_this.sms) {
        this.$message({
          message: this.$t("findPwd.tip7"),
          duration: 1500
        });
        return false;
      }
      this.$http
        .post(
          this.$store.state.url + "Api/Login/forgetpassword",
          {
            user: _this.qu_num + _this.user,
            verify_code: _this.verify_code,
            weiyistr: _this.weiMd5,
            smsCode: _this.sms,
            token: _this.token
          },
          {
            headers: {},
            emulateJSON: true
          }
        )
        .then(response => {
          this.loading2 = false;
          if (response.data.status == 1) {
            _this.pwd = "";
            _this.repwd = "";
            _this.verify_code = "";
            _this.sms = "";
            _this.info = _this.$t("findPwd.tip1");
            clearInterval(_this.timer);
            _this.timer = null;
            _this.$router.push({
              path: "/resetPwd",
              query: { user: _this.com_user }
            });
            _this.user = "";
          } else if (response.data.status == '01') {
            this.$message({
              message: this.$t("findPwd.tip9"),
              duration: 1500
            });
          } else if (response.data.status == '02') {
            this.$message({
              message: this.$t("findPwd.tip10"),
              duration: 1500
            });
          } else if (response.data.status == '03') {
            this.$message({
              message: this.$t("findPwd.tip11"),
              duration: 1500
            });
          } else if (response.data.status == '04') {
            this.$message({
              message: this.$t("findPwd.tip12"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("findPwd.tip13"),
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
    getImg() {
      var num = Math.random();
      this.url = this.$store.state.url + "Api/Reg/verificationCode/" + num;
    },
    sendCode() {
      var _this = this;
      var reg = /^\d{5,20}$/;
      if (!reg.test(_this.user)) {
        this.$message({
          message: this.$t("register.tip8"),
          duration: 1500
        });
        return false;
      }
      if (!_this.timer) {
        _this.$http
          .post(
            _this.$store.state.url + "Api/Sendcode/sendsms",
            {
              ctype: _this.ctype,
              userphone: _this.qu_num + _this.user,
              token: _this.token1
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
                      this.$t("findPwd.tip2") + "(" + this.count + "s)";
                  } else {
                    this.info = this.$t("findPwd.tip2");
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
    back() {
      this.$router.push({ name: "login", params: { t: "2" } });
    }
  }
};
</script>
<style lang="less">
.register {
  padding: 0 15px;
  position: absolute;
  z-index: 99;
  h1 {
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 40px;
  }
  input {
    margin: 0;
    padding: 15px 0;
    width: 65%;
    text-align: left;
    border: none;
    color: #d6e9fc;
  }
  .line {
    height: 1px;
    background-color: #898f8f;
    margin: 20px 0px;
  }
  .login1 {
    background-color: #898f8f;
    border: 1px solid #898f8f;
    color: #feffff;
    opacity: 0.8;
  }
  .short {
    width: 25%;
  }
  .input-item {
    border-bottom: 1px solid #44352f;
    white-space: nowrap;
    height: 46px;
  }
  .label {
    display: inline-block;
    width: 35%;
    color: #97989a;
    line-height: 46px;
  }
  .img {
    width: 30%;
    vertical-align: middle;
    float: right;
    height: 36px;
    margin-top: 5px;
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
  select::-ms-expand {
    display: none;
  }
  #phone {
    width: 55%;
    background: none;
    border: none;
    height: 36px;
    color: #d6e9fc;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
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
  .btn-gold {
    margin-top: 50px;
    background-color: rgb(255, 195, 52);
    border-radius: 4px;
    color: rgb(51, 51, 51);
  }
  .back {
    position: absolute;
    left: 0;
    top: 10px;
    font-size: 25px;
  }
}
.register .half button {
  width: 48%;
  float: right;
}
.register .intl-tel-input.allow-dropdown input,
.intl-tel-input.allow-dropdown input[type="text"] {
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
