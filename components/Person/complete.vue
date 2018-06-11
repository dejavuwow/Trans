<template>
  <div class="complete">
    <div class="header">       
      <h1>
        <span class="left_icon" @click="jumpBack()">&#xe625;</span>
        {{$t('certify.tip4')}}
      </h1>
    </div>
    <div class="steps">
      <div class="step">
        <div class="first">
          <span>1</span>
        </div>
        <div class="line"></div>
        <div class="first">
          <span>2</span>
        </div>
        <div class="line"></div>
        <div class="first">
          <span>3</span>
        </div>
      </div>
      <div class="info">
        <div class="gold">{{$t('certify.tip18')}}</div>
        <div class="gold">{{$t('certify.tip19')}}</div>
        <div class="gold">{{$t('certify.tip20')}}</div>
      </div>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="item-content">
          <p>{{$t('certify.tip46')}}</p>
          <div class="tips">{{$t('certify.tip47')}}
          </div>
          <div class="select">
            <el-radio v-model="radio" label="1">{{$t('certify.tip50')}}</el-radio>
            <el-radio v-model="radio" label="2">{{$t('certify.tip51')}}</el-radio>
          </div>
        </div>
        <div class="item-content">
          <p>{{$t('certify.tip52')}}</p>
          <div class="tips">
            {{$t('certify.tip48')}}
          </div>
          <div class="select">
            <el-radio v-model="radio1" label="1">{{$t('certify.tip50')}}</el-radio>
            <el-radio v-model="radio1" label="2">{{$t('certify.tip51')}}</el-radio>
          </div>
          <div class="tips">
            {{$t('certify.tip49')}}
          </div>
          <div class="select">
            <el-radio v-model="radio2" label="1">{{$t('certify.tip50')}}</el-radio>
            <el-radio v-model="radio2" label="2">{{$t('certify.tip51')}}</el-radio>
          </div>
        </div>
        <div class="btn">
          <button type="button" @click="goNext">{{$t('certify.tip45')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll";
  import sha1 from "sha1";
  export default {
    data() {
      return {
        radio: "1",
        radio1: "1",
        radio2: "1",
        myScroll: null
      };
    },
    mounted() {
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
    methods: {
      jumpBack() {
        this.$router.push("/upload");
      },
      goNext() {
        if (this.radio != 1 || this.radio1 != 1 || this.radio2 != 1) {
          this.$message({
            message: this.$t("certify.tip15"),
            duration: 1500
          });
          return false;
        }
        this.$http
        .post(
          this.$store.state.url + "Api/Authentication/subAuthentication",
          {
            member_id: this.$store.state.member_id,
            name: this.$store.state.save.name,
            country: this.$store.state.save.country,
            gender: this.$store.state.save.sex,
            birth: this.$store.state.save.date,
            occupation: this.$store.state.save.job,
            address: this.$store.state.save.address,
            card_no: this.$store.state.save.card_num,
            card_front: this.$store.state.front,
            card_con: this.$store.state.back,
            card_hand: this.$store.state.hand,
            certificates_type: this.$store.state.save.doc_type,
            token: sha1(
              this.$store.state.member_id +
              this.$store.state.save.name +
              this.$store.state.save.country +
              this.$store.state.save.sex +
              this.$store.state.save.date +
              this.$store.state.save.job +
              this.$store.state.save.address +
              this.$store.state.save.card_num +
              this.$store.state.front +
              this.$store.state.back +
              this.$store.state.hand +
              this.$store.state.save.doc_type +
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
            this.$router.push("/state");
            this.$store.commit("changeStatus", 0);
          } else if (res.data.status == 2) {
            this.$message({
              message: this.$t("certify.tip16"),
              duration: 1500
            });
          }else if(res.data.status==3){
            this.$message({
              message: this.$t("certify.tip17"),
              duration: 1500
            });
          }else{
            this.$message({
              message: this.$t("certify.tip2"),
              duration: 1500
            });
          }
        })
        .catch(function(re) {
          plus.nativeUI.toast(this.$t("err.info"), {
            verticalAlign: "center"
          });
        });
      },
    }
  };
</script>

<style lang="less" >
  .complete {
    width: 100%;
    height:100%;
    position:absolute;
    .header {
      z-index: 100;
      width: 100%;
      .left_icon {
        top: -7.5px;
        left: 15px;
      }
    }
    .steps {
      background-color: #333;
      width: 100%;
      z-index: 100;
      white-space: nowrap;
      .step {
        padding: 0 45px;
        padding-top:10px;
      }
      .first {
        width: 25px;
        height: 25px;
        background-color: #f1b90c;
        color: black;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
        span {
          line-height: 25px;
          display: inline-block;
          height: 25px;
        }
      }
      .second {
        background-color: rgb(142, 153, 168) !important;
      }
      .line {
        height: 1px;
        background-color: #f1b90c;
        display: inline-block;
        width: 34%;
      }
    }
    .info {
      display: flex;
      padding: 0 30px 5px 30px;
      justify-content: space-between;
      div {
        color: #a3aab4;
      }
      .gold {
        color: #f1b90c;
      }
    }
    .content {
      min-height: 101%;
      padding-bottom: 50px;
      p {
        padding: 15px;
        color: #a1968f;
      }
      .item-content {
        border-top: 1px solid rgb(47, 49, 68);
        p {
          text-align: center;
          padding-top: 20px;
        }
        .tips {
          padding: 0 15px;
          font-size: 12px;
          color: #a1968f;
          line-height: 1.7;
        }
        .select {
          text-align: center;
          padding: 10px 0;
        }
      }
    }
    .btn {
      padding: 30px 15px;
      width: 100%;
      box-sizing: border-box;
      button {
        border-radius: 4px;
        line-height: 45px;
        color: black;
        background: #f1b90c;
      }
    }
    .wrapper {
      overflow: hidden;
      position: absolute;
      top:104px;
      bottom:0;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    background-color: rgb(38, 38, 58) !important;
    border-color: #f1b90c !important;
    border-width: 1px !important;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #f1b90c !important;
  }
  .el-radio__inner::after {
    background-color: #f1b90c !important;
    height: 8px !important;
    width: 8px !important;
  }
</style>
