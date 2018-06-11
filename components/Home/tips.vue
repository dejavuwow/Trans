<template>
  <transition name="slide-right">
    <div class="tips">
      <div class="header">       
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
                {{$t('notice.tip1')}}
        </h1>
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="tip-content">
          <div class="tip-item" v-for="(item,index) in list" :key="index">
              <div class="title" v-if="item.r_type==0">{{$t('notice.tip2')}}</div>
              <div class="title" v-else-if="item.r_type==1">{{$t('notice.tip3')}}</div>
              <div class="title" v-else-if="item.r_type==2">{{$t('notice.tip4')}}</div>
              <div class="title" v-else-if="item.r_type==3">{{$t('notice.tip5')}}</div>
              <div class="title" v-else-if="item.r_type==4">{{$t('notice.tip6')}}</div>
              <div class="title" v-else>{{$t('notice.tip7')}}</div>
              <div class="time">{{item.add_time}}</div>
              <div class="info" v-if="item.r_type==0">
                  {{$t('notice.tip8')}}{{$t('notice.tip9')}}{{item.add_time}}{{$t('notice.tip10')}}{{item.num}}{{$t('notice.tip11')}}
              </div>
              <div class="info" v-else-if="item.r_type==1">
                  {{$t('notice.tip8')}}{{$t('notice.tip9')}}{{item.add_time}}{{$t('notice.tip12')}}{{item.num}}{{$t('notice.tip11')}} {{$t('notice.tip13')}}{{item.fee}}{{$t('notice.tip14')}}
              </div>
              <div class="info" v-else-if="item.r_type==2">
                  {{$t('notice.tip15')}}{{item.num}}{{$t('notice.tip14')}}
              </div>
              <div class="info" v-else-if="item.r_type==3">
                  {{$t('notice.tip16')}}{{item.num}}{{$t('notice.tip14')}}
              </div>
              <div class="info" v-else-if="item.r_type==4">
                  {{$t('notice.tip17')}}
              </div>
              <div class="info" v-else>
                  {{$t('notice.tip18')}}
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
import vueLoading from "vue-loading-template";
import sha1 from "sha1";
import BScroll from "better-scroll";
export default {
  components: {
    vueLoading
  },
  data() {
    return {
      loading: true,
      scroll: null,
      list: "",
      loading7: false,
      page: 0,
      more: false
    };
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "tips");
      this.$router.push("/home");
    },
    init(page) {
      this.$http
        .post(
          this.$store.state.url + "Api/Home/messageReminding",
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
          this.loading = false;
          this.loading7 = false;
          this.$message({
            message: this.$t("err.info"),
            duration: 1500
          });
        });
    }
  },
  beforeRouteLeave(to, from, next) {
      if (to.path == "/home") {
        this.$store.commit("changeRes", "tips");
      } else {
      }
      setTimeout(function() {
        next();
      }, 50);
    },
  created() {
    let time=Date.parse(new Date())/1000
    localStorage.setItem('time',time)
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          probeType: 3,
           pullUpLoad: {   // 配置上啦加载
            threshold: -40   //上拉80px的时候加载
          }
        });
        this.scroll.on('pullingUp',()=>{
          this.page++
          this.loading7=true;
          this.scrollFinish = false;
          this.scroll.finishPullUp();
          this.init(this.page)
        })
      } else if (!this.$refs.wrapper) {
        return;
      } else {
        this.scroll.refresh();
      }
    });
    this.$http
      .post(
        this.$store.state.url + "Api/Home/messageReminding",
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
          this.list = res.data.info;
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
};
</script>

<style lang="less" scoped>
.tips {
  position: absolute;
  width: 100%;
  height:100%;
  .header {
    z-index: 101;
    position: relative;
    .left_icon {
      top:-7.5px;
      left: 15px;
    }
    h1{
      margin-bottom:0;
    }
  }
  .wrapper {
    height: 92%;
    overflow: hidden;
  }
  .tip-content {
    min-height: 100.5%;
    .tip-item {
      margin-top: 15px;
      .title {
        line-height: 45px;
        color: #d6e9fc;
        border-bottom: 1px solid #44352f;
        padding: 0 15px;
      }
      .time {
        color: rgb(92, 98, 115);
        font-size: 12px;
        padding: 0 15px;
        line-height: 45px;
      }
      .info {
        color: #d6e9fc;
        padding: 0 15px;
        padding-bottom: 15px;
      }
    }
  }
  .load-content {
    align-self: auto;
    margin-top: 250px;
  }
}
</style>
