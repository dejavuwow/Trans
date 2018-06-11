<template>
  <transition :name="animate">
    <div class="in-record">
      <div class="header">
        <h1>
          <span class="left_icon" @click="jumpBack()">&#xe625;</span>
          {{$t('transfer.tip10')}}
        </h1>
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="record-content">
          <div class="th">
            <span>{{$t('transfer.tip7')}}</span>
            <span>{{$t('transfer.tip8')}}</span>
            <span class="wrap">{{$t('transfer.tip9')}}</span>
            <span class="wrap datee">{{$t('transfer.tip6')}}</span>
            <span>{{$t('transfer.tip11')}}</span>
          </div>
          <div v-for="(item,index) in records" :key='index'>
            <div class="td">       
              <span>{{item.id}}</span>
              <span>{{item.num*1|xiaoshu2}}</span>
              <span class="wrap">{{item.url}}</span>
              <span class="wrap datee">{{item.add_time}}</span>
              <span v-if="item.status==3"><i class="fa fa-check-circle success"></i></span>
              <span v-else><i class="fa fa-times-circle failed"></i></span>
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
  import BScroll from "better-scroll";
  import sha1 from "sha1";
  import vueLoading from "vue-loading-template";
  export default {
    components: {
      vueLoading
    },
    data() {
      return {
        animate: "slide-right",
        records: "",
        loading: true,
        scroll: null,
        page: 0,
        loading7: false,
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
  },
  created() {
    // 请求记录
    this.$http
    .post(
      this.$store.state.url + "Api/Address/currencyToChangeInto",
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
        this.records = res.data.info;
        if (this.records.length == 0) {
          this.$message({
            message: "暂无记录",
            duration: 1500,
            iconClass: ""
          });
        }
      }
    })
    .catch(function(re) {
      this.loading = false;
      this.$message({
        message: this.$t("err.info"),
        duration: 1500
      });
    });
  },
  beforeRouteLeave(to, from, next) {
    if(to.path=='/roll-in'){
      this.$store.commit("changeRes", "in-record");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "in-record");
      this.$router.push("/roll-in");
    },
    init(page) {
      this.$http
      .post(
        this.$store.state.url + "Api/Address/currencyToChangeInto",
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
        this.loading = false;
        this.loading7 = false;
        if (res.data.status == 1) {
          this.records = this.records.concat(res.data.info);
          this.scroll.refresh()
          if (res.data.info < 15) {
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
      .catch(function(re) {
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
  .in-record {
    position: absolute;
    width: 100%;
    .header {
      background-color: rgb(31, 25, 35);
      text-align: center;
      padding-right: 15px;
      position: relative;
      z-index: 100;
      .left_icon {
        top: -7.5px;
        left: 15px;
      }
    }
    .record-content {
      min-height: 101%;
      .th {
        background-color: #333;
        display: flex;
        justify-content: space-around;
        height:40px;
        color: #807c77;
        align-items: center;
        span {
          display: inline-block;
          text-align: center;
        }
        span:nth-of-type(1){
          width:10%;
        }
        span:nth-of-type(2){
          width:18%;
        }
        span:last-of-type{
          width:10%;
        }
        .wrap {
          width:26%;
        }
        .datee{
          width:18%;
        }
      }
      .td {
        height:60px;
        width: 100%;
        border-bottom: 1px solid #44352f;
        height: 80px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        span {
          line-height:1.5;
          color: #fff;
          display: inline-block;
          font-size: 12px;
          word-break: break-all;
          box-sizing: border-box;
          text-align: center;
          .success{
            color:#109e7e;
          }
          .failed{
            color:#e60012;
          }
        }
        span:nth-of-type(1){
          width:10%;
        }
        span:nth-of-type(2){
          width:18%;
        }
        span:last-of-type{
          width:10%;
          font-size:20px;
        }
        .wrap {
          width:26%;
        }
        .datee{
          width:18%;
        }
      }
    }
    .wrapper {
      height: 400px;
    }
    .load-content {
      align-self: auto;
      margin-top: 250px;
    }
  }
</style>
