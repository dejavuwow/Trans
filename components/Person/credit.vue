<template>
<transition :name="animateName">
  <div class="loginPwd">
      <div class="header">       
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
              {{$t('credit.tip')}}
        </h1>
      </div>
      <div class="content">
         <div class="title">{{$t('credit.tip1')}}</div>
         <div class="circle">
             <span class="center">
                <span class="gold">{{all}}</span>
                <span>{{$t('credit.tip2')}}</span>
             </span>
         </div>
      </div>
      <div class="curr">{{$t('credit.tip1')}}</div>
      <div class="wrapper" ref="wrapper">
        <div class="scroll">
          <div class="table">
          <div class="th">
              <span>{{$t('credit.tip3')}}</span>
              <span>{{$t('credit.tip4')}}</span>
              <span>{{$t('credit.tip5')}}</span>
          </div>
          <div class="td" v-for="(item,i) in arr" :key="i">
            <span v-if="item.reason_type==0">{{$t('credit.tip8')}}</span>
            <span v-else-if="item.reason_type==1">{{$t('credit.tip6')}}</span>
            <span v-else-if="item.reason_type==2">{{$t('credit.tip7')}}</span>
            <span v-else-if="item.reason_type==4">{{$t('credit.tip10')}}</span>
            <span v-else-if="item.reason_type==5">{{$t('credit.tip11')}}</span>
            <span v-else>{{$t('credit.tip9')}}</span>
            <span>{{item.addtime}}</span>
            <span v-if="item.change_type==0">+{{item.num}}</span>
            <span v-else>-{{item.num}}</span>
          </div>
        </div>
        </div>
      </div>
      <div class="loading" v-show="loading">
            <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
      <div class="loading" v-show="loading7">
            <div class="load-content"><vue-loading type="spin" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
  </div>
</transition>
</template>
<script>
import md5 from "md5";
import sha1 from "sha1";
import BScroll from "better-scroll";
import vueLoading from "vue-loading-template";
export default {
  components: {
    vueLoading
  },
  name: "credit",
  data() {
    return {
      animateName: "slide-right",
      scroll: null,
      loading: true,
      loading7: false,
      all: "",
      arr: "",
      page: 0,
      more: false
    };
  },
  mounted() {
    // 滚动
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          probeType: 3,
          pullUpLoad: {
            // 配置上啦加载
            threshold: -40 //上拉80px的时候加载
          }
        });
        this.scroll.on("pullingUp", () => {
          this.page++;
          this.loading7 = true;
          this.scrollFinish = false;
          this.scroll.finishPullUp();
          this.init(this.page);
        });
      } else if (!this.$refs.wrapper) {
        return;
      } else {
        this.scroll.refresh();
      }
    });
    // 请求信息
    this.$http
      .post(
        this.$store.state.url + "Api/PersonalCenter/reputationRecord",
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
        if (res.data.status == 1) {
          this.all = res.data.info.reputation;
          this.arr = res.data.info.loginfo;
        }
      })
      .catch(function(response) {
        this.loading = false;
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
  },
  beforeRouteLeave(to, from, next) {
    // 离开动画
    if (to.path == "/personInfo") {
      this.$store.commit("changeRes", "credit");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "credit");
      this.$router.push("/personInfo");
    },
    init(page) {
      this.$http
        .post(
          this.$store.state.url + "Api/PersonalCenter/reputationRecord",
          {
            member_id: this.$store.state.member_id,
            page: page,
            token: sha1(
              this.$store.state.member_id + page + this.$store.state.str
            )
          },
          {
            headers: {},
            emulateJSON: true
          }
        )
        .then(res => {
          this.loading7 = false;
          this.loading = false;
          this.more = false;
          if (res.data.status == 1) {
            this.arr = this.arr.concat(res.data.info.loginfo);
            this.scroll.refresh()
            if (res.data.info.loginfo < 15) {
              this.$message({
                message: this.$t("err.tip15"),
                duration: 1500
              });
            } else {
              this.$message({
                message: this.$t("err.tip15"),
                duration: 1500
              });
            }
          }
        })
        .catch(function(response) {
          this.loading = false;
          this.loading7 = false;
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
.loginPwd {
  background:linear-gradient(0deg,#352c25 0,#1d1c1c 100%);
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  .header {
    position: relative;
    z-index: 100;
    text-align: center;
    .left_icon {
      font-size: 25px;
      // float: left;
      line-height: 25px;
      left: 15px;
    }
  }
  .content {
    white-space: nowrap;
    padding: 30px;
    position: relative;
    z-index: 100;
    .title {
      text-align: center;
      margin-bottom: 10px;
      color: #d6e9fc;
    }
    .circle {
      width: 100px;
      height: 100px;
      border: 1px solid #f1b90c;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      .center {
        color: #d6e9fc;
        .gold {
          color: #f1b90c;
          font-size: 22px;
        }
      }
    }
  }
  .curr {
    border-bottom: 1px solid rgb(38, 38, 58);
    padding: 0 30px 10px 30px;
    color: #d6e9fc;
    position: relative;
    z-index: 100;
  }
  .wrapper {
    position: relative;
    z-index: 99;
    height: 300px;
    overflow: hidden;
  }
  .table {
    min-height: 101%;
    padding: 0 30px;
    margin-top: 10px;
    .th {
      display: flex;
      justify-content: space-between;
      color: #d6e9fc;
      span:nth-child(1) {
        display: inline-block;
        width: 20%;
      }
      span:nth-child(2) {
        display: inline-block;
        text-align: center;
        width: 60%;
      }
      span:nth-child(3) {
        display: inline-block;
        width: 20%;
        text-align: right;
      }
    }
    .td {
      display: flex;
      justify-content: space-between;
      color: #d6e9fc;
      line-height: 45px;
      span:nth-child(1) {
        display: inline-block;
        width: 20%;
      }
      span:nth-child(2) {
        display: inline-block;
        text-align: center;
        width: 60%;
      }
      span:nth-child(3) {
        display: inline-block;
        width: 20%;
        text-align: right;
      }
    }
  }
  .scroll {
    min-height: 100.5%;
  }
  .load-content {
    align-self: auto;
    margin-top: 250px;
  }
}
</style>
