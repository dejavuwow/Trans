<template>
<transition :name="animateName">
  <div class="loginPwd">
      <div class="header">       
        <h1>
            <span class="fa fa-long-arrow-left  back" @click="jumpBack()"></span>
              {{$t('mail.tip')}}
        </h1>
      </div>
      <div class="content">
          <div class="input-item">
            <span>{{$t('mail.tip1')}}</span>
            <el-input
              :placeholder="$t('mail.tip2')"
              type="text"
              clearable>
            </el-input>
          </div>
          <div class="btn">
            <button type="button" disabled>{{$t('mail.tip3')}}</button>
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
      animateName:'slide-right'
    };
  },
  methods: {
    jumpBack(){
      this.$store.commit("changeRes", "mail");
      this.$router.push('/personInfo')
    }
  }
};
</script>
<style lang="less">
.loginPwd {
  position: absolute;
  width: 100%;
  .header {
    background-color: rgb(31, 25, 35);
    text-align: center;
    .fa {
      font-size: 25px;
      float: left;
      line-height: 25px;
    }
  }
  .content {
    white-space: nowrap;
    padding: 80px 30px;
    .input-item {
      span {
        width: 20%;
        display: inline-block;
        color: #a3aab4;
      }
      border-bottom: 1px solid rgb(38, 38, 58);
    }
    .el-input {
      display: inline-block;
      width: 80%;
    }
    .el-input__inner {
      background-color: rgb(31, 25, 35);
      border: none;
      text-align: left;
    }
    .el-input .el-input__clear {
      margin-top: 12px;
    }
    .btn {
      margin-top: 50px;
      button {
        border-radius: 5px;
        background-color: rgb(255,195,52);
      }
    }
  }
}
</style>

