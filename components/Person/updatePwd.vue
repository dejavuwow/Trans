<template>
  <transition :name="animateName">
    <div class="loginPwd2"
    v-loading="loading2"
    :element-loading-text="$t('err.tip14')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :fullscreen="false">
    <div class="header">       
      <h1>
        <span class="left_icon" @click="jumpBack()">&#xe625;</span>
        {{$t('update.h1')}}
      </h1>
    </div>
    <div class="content">
      <div class="input-item">
        <span>{{$t('update.old')}}</span>
        <el-input
        :placeholder="$t('update.tip14')"
        type="password"
        clearable
        v-model="oldpwd">
      </el-input>
    </div>
    <div class="input-item">
      <span>{{$t('update.new')}}</span>
      <el-input
      :placeholder="$t('register.tip2')"
      type="password"
      clearable
      v-model="pwd">
    </el-input>
  </div>
  <div class="input-item">
    <span>{{$t('update.new')}}</span>
    <el-input
    :placeholder="$t('update.repwd')"
    type="password"
    clearable
    v-model="repwd">
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
        oldpwd: "",
        pwd: "",
        repwd: "",
        loading2: false
      };
    },
    computed: {
      oldMd5() {
        return md5(this.oldpwd);
      },
      pwdMd5() {
        return md5(this.pwd);
      },
      reMd5() {
        return md5(this.repwd);
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/setting") {
        this.$store.commit("changeRes", "update");
      }
      setTimeout(function() {
        next();
      }, 50);
    },
    methods: {
      jumpBack() {
        this.$store.commit("changeRes", "update");
        this.$router.push("/setting");
      },
      confirm() {
        var _this = this;
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
        if (!this.oldpwd || !this.pwd || !this.repwd) {
          this.$message({
            message: this.$t("alipay.tip"),
            duration: 1500
          });
          return false;
        }
        if (this.pwd != this.repwd) {
          this.$message({
            message: this.$t("findPwd.tip5"),
            duration: 1500
          });
          return false;
        }
        if (!reg.test(this.pwd)) {
          this.$message({
            message: this.$t("findPwd.tip4"),
            duration: 1500
          });
          return false;
        }
        this.loading2 = true;
        this.$http
        .post(
          this.$store.state.url + "Api/Login/modifyloginpassword",
          {
            oldpwd: this.oldMd5,
            pwd: this.pwdMd5,
            repwd: this.reMd5,
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
          this.loading2 = false;
          if (res.data.status == 0) {
            this.$message({
              message: this.$t("update.tip11"),
              duration: 1500
            });
          } else if (res.data.status == 1) {
            setTimeout(function() {
              _this.$router.push({ path: "/", params: { t: "4" } });
            }, 1000);
            this.$message({
              message: this.$t("update.tip7"),
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
  .loginPwd2 {
    position: absolute;
    width: 100%;
    .header {
      text-align: center;
      .left_icon{
        font-size: 25px;
        left: 15px;
        line-height: 25px;
      }
    }
    .content {
      input {
        height: 46px;
        line-height: 46px;
      }
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
        background-color: transparent;
        border: none;
        text-align: left;
        color:#a1968f;
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


