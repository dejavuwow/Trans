<template>
  <transition name="slide-right">
    <div class="my-coin">
      <div class="header">       
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
                {{$t('my.tip1')}}
        </h1>
      </div>
      <div class="content">
          <div class="title">{{$t('my.tip2')}}<span>{{$t('my.tip3')}} {{av_num*1+frozen*1|xiaoshu2}}{{$t('my.tip4')}}</span></div>
          <div class="info">
              <div class="left">
                  <div> <span class="big">{{av_num*1|xiaoshu2}}</span>{{$t('my.tip4')}}</div>
                  <div class="tip">{{$t('my.tip5')}}</div>
              </div>
              <div class="middle"></div>
              <div class="right">
                  <div> <span class="big">{{frozen*1|xiaoshu2}}</span>{{$t('my.tip4')}}</div>
                  <div class="tip">{{$t('my.tip6')}}</div>
              </div>
          </div>
          <p>{{$t('my.tip7')}}</p>
          <p class="num">￥{{value*1*(av_num*1+frozen*1)|xiaoshu2}}</p>
      </div>
  </div>
  </transition>
</template>

<script>
import sha1 from 'sha1'
export default {
  data() {
    return {
      av_num: this.$store.state.av_num,
      frozen: this.$store.state.frozen_num,
      value: this.$store.state.exchange
    };
  },
  beforeRouteLeave(to, from, next) {
    // 离开动画
    if (to.path =="/Person") {
      this.$store.commit("changeRes", "my");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "my");
      this.$router.push("/Person");
    }
  },
  created() {
    console.log(this)
  }
};
</script>

<style lang="less" scoped>
.my-coin {
  position:absolute;
  width:100%;
  .header {
    z-index: 101;
    background-color: rgb(31, 25, 35);
    position: absolute;
    top: 0;
    .left_icon {
      top: -7.5px;
      left: 15px;
    }
  }
  .content {
    width: 100%;
    margin-top: 45px;
    .title {
      color: #d6e9fc;
      padding: 15px;
      span {
        margin-left: 20px;
      }
    }
    .info {
      width: 100%;
      background-color: rgb(38, 38, 58);
      white-space: nowrap;
      display: flex;
      .right {
        display: inline-block;
        width: 50%;
        padding: 30px;
        box-sizing: border-box;
        text-align: center;
        .big {
          color: #f1b90c;
          font-size: 20px;
        }
        .tip {
          color: #d6e9fc;
          margin-top: 15px;
        }
      }
      .left {
        display: inline-block;
        width: 50%;
        padding: 30px;
        box-sizing: border-box;
        text-align: center;
        .big {
          color: #f1b90c;
          font-size: 20px;
        }
        .tip {
          color: #d6e9fc;
          margin-top: 15px;
        }
      }
      .middle {
        display: inline-block;
        width: 2px;
        height: 90px;
        margin-top: 16px;
        background-image: linear-gradient(
          to bottom,
          rgb(38, 38, 58) 0%,
          #d6e9fc 50%,
          rgb(38, 38, 58) 100%
        );
      }
    }
  }
  p {
    color: #d6e9fc;
    text-align: center;
    margin-top: 20px;
  }
  .num {
    color: #f1b90c;
    font-size: 20px;
  }
}
</style>
