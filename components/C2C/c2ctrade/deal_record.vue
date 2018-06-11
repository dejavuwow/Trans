<template>
  <div class="deal-record">
    <div class="wrapper" ref="wrapper">
      <div class="deal-content">
        <div class="th">
          <span>{{$t('history.h15')}}</span>
          <span>{{$t('history.h16')}}</span>
          <span>{{$t('history.h17')}}</span>
          <span>{{$t('history.h18')}}</span>
        </div>
        <div class="td" v-for="(item,i) in list" :key="i">
          <span v-if="id==item.buy_id" class="buy">{{$t('history.h19')}}</span>
          <span v-else class="sell">{{$t('history.h20')}}</span>
          <span>{{(item.num*1)|xiaoshu2}}</span>
          <span>{{(item.money*1)|xiaoshu2}}</span>
          <span class="wrap">{{item.pay_time}}</span>
        </div>
      </div>
    </div>
    <div class="loading" v-show="ishow">
      <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
    </div>
    <div class="loading" v-show="loading7">
      <div class="load-content"><vue-loading type="spin" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
    </div>
  </div>
</template>
<script>
  import vueLoading from "vue-loading-template";
  import sha1 from "sha1";
  import BScroll from "better-scroll";
  export default {
    components: {
      vueLoading
    },
    data() {
      return {
        list: "",
        id: this.$store.state.member_id,
        ishow: true,
        loading7: false,
        page: 0,
        more: false,
        scroll:null
      };
    },
    created() {
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
      this.$http
      .post(
        this.$store.state.url + "Api/Ptptrade/entrustmentHistoryApv",
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
        this.ishow = false;
        if (res.data.status == 1) {
          this.list = res.data.info;
          this.scroll.refresh();
        }
      })
      .catch(function(response) {
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
    },
    methods: {
      init(page) {
        this.$http
        .post(
          this.$store.state.url + "Api/Ptptrade/entrustmentHistoryApv",
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
          this.ishow = false;
          this.loading7 = false;
          if (res.data.status == 1) {
            this.list = this.list.concat(res.data.info);
            this.scroll.refresh()
            if (res.data.info < 15) {
              this.$message({
                message: this.$t("err.tip15"),
                duration: 1500
              });
            }
          } else {
            this.$message({
              message: this.$t("err.tip15"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          this.loading7 = false;
          this.ishow = false;
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
  .deal-record {
    width: 100%;
    height:73%;
    .wrapper {
      height: 100%;
      overflow: hidden; 
      background: #fff;
    }
    .deal-content {
      background: #fff;
      min-height: 101%;
      width: 100%;
      overflow: hidden;
      .th {
        height:50px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        span {
          color: #333;
          display: inline-block;
          width: 25%;
          text-align: center;
        }
        span:first-child{
          width:22%;
        }
        span:last-child {
          width: 28%;
        }
      }
      .td {
        width: 100%;
        border-bottom: 1px solid #eee;
        height: 80px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        span {
          color: #333;
          display: inline-block;
          width: 25%;
          text-align: center;
        }
        .buy{
          color:#e60012;
        }
        .sell{
          color:#109e7e;
          
        }
        span:first-child{
          width:22%;
        }
        span:last-child {
          width: 28%;
        }
      }
    }
    .wrap {
      white-space: normal;
      text-align: center;
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
  }
</style>
