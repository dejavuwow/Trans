<template>
<transition :name="animateName">
  <div class="loginPwd3"
   v-loading="loading2"
    element-loading-text="处理中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :fullscreen="false"
   >
      <div class="header">       
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
              {{$t('payPwd.h1')}}
        </h1>
      </div>
      <div class="content">
          <div class="input-item">
            <span>{{$t('update.old')}}</span>
            <el-input
              :placeholder="$t('update.tip3')"
              type="password"
              
              v-model="oldpwdtrade">
            </el-input>
          </div>
          <div class="input-item">
            <span>{{$t('update.new')}}</span>
            <el-input
              :placeholder="$t('register.tip21')"
              type="password"
              
              v-model="pwdtrade">
            </el-input>
          </div>
          <div class="input-item">
            <span>{{$t('update.new')}}</span>
            <el-input
              :placeholder="$t('update.repwd')"
              type="password"
              
              v-model="repwdtrade">
            </el-input>
          </div>
          <div class="btn">
            <button type="button" @click="confirm">{{$t('mail.tip3')}}</button>
          </div>
      </div>
  </div>
</transition>
</template>
<script>
import md5 from "md5";
import sha1 from "sha1";
export default {
  name: "updatepwd",
  data() {
    return {
      animateName: "slide-right",
      oldpwdtrade: "",
      pwdtrade: "",
      repwdtrade: "",
      loading2:false
    };
  },
  computed: {
    oldMd5() {
      return md5(this.oldpwdtrade);
    },
    pwdMd5() {
      return md5(this.pwdtrade);
    },
    reMd5() {
      return md5(this.repwdtrade);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/setting") {
      this.$store.commit("changeRes", "paypwd");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "paypwd");
      this.$router.push("/setting");
    },
    confirm() {
      var _this = this;
      var reg = /^\d{6}$/;
      if (!this.oldpwdtrade || !this.pwdtrade || !this.repwdtrade) {
        this.$message({
          message: this.$t("alipay.tip"),
          duration: 1500
        });
        return false;
      }
      if (this.pwdtrade != this.repwdtrade) {
        this.$message({
          message: this.$t("register.tip20"),
          duration: 1500
        });
        return false;
      }
      if (!reg.test(this.pwdtrade)) {
        this.$message({
          message: this.$t("register.tip3"),
          duration: 1500
        });
        return false;
      }
      this.loading2=true;
      this.$http
        .post(
          this.$store.state.url + "Api/Login/modifyingTransactionPassword",
          {
            oldpwdtrade: this.oldMd5,
            pwdtrade: this.pwdMd5,
            repwdtrade: this.reMd5,
            member_id: this.$store.state.member_id,
            token: sha1(
              this.oldMd5 +
                this.pwdMd5 +
                this.reMd5 +
                this.$store.state.member_id +
                this.$store.state.str
            )
          },
          {
            headers: {},
            emulateJSON: true
          }
        )
        .then(res => {
          this.loading2=false;
          if (res.data.status == 0) {
            this.$message({
              message: this.$t("update.tip11"),
              duration: 1500
            });
          } else if (res.data.status == 1) {
            this.oldpwdtrade='';
            this.repwdtrade='';
            this.pwdtrade='';
            this.$message({
              message: this.$t("payPwd.tip12"),
              duration: 1500
            });
          } else if (res.data.status == 5) {
            this.$message({
              message: this.$t("findPwd.tip12"),
              duration: 1500
            });
          } else if (res.data.status == 6) {
            this.$message({
              message: this.$t("update.tip8"),
              duration: 1500
            });
          } else if (res.data.status == 8) {
            this.$message({
              message: this.$t("update.tip10"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          this.loading2=false;
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
.loginPwd3 {
  position: absolute;
  width: 100%;
  .header {
    text-align: center;
    .fa {
      font-size: 25px;
      float: left;
      line-height: 25px;
    }
    .left_icon{
      left:15px;
    }
  }
  .content {
    white-space: nowrap;
    padding:30px;
    .input-item {
      span {
        width: 30%;
        display: inline-block;
        color: #a1968f;
      }
      border-bottom: 1px solid #44352f;
    }
    .el-input {
      display: inline-block;
      width: 70%;
    }
    .el-input__inner {
      border: none;
      text-align: left;
      background: transparent;
    }
    .el-input .el-input__clear {
      margin-top: 25px !important;
    }
    .btn {
      margin-top: 50px;
      button {
        border-radius: 5px;
        background-color: rgb(255, 195, 52);
        color: rgb(51, 51, 51);
      }
    }
  }
}
</style>

