<template>
  <transition name="slide-right">
    <div class="state">
      <div class="header">       
        <h1>
            <span class="fa fa-long-arrow-left back" @click="jumpBack()"></span>
                {{$t('certify.tip4')}}
        </h1>
      </div>
      <div class="pending" v-show="isShow==0">
        <div class="icon">
            <span class="tips">&#xe648;</span>
        </div>
        <div class="i_state">{{$t('state.tip1')}}！</div>
        <div class="info">
          {{$t('state.tip2')}}
         </div>
        <div class="info">
          {{$t('state.tip3')}}
        </div>
      </div>
      <div class="fail" v-show="isShow==2">
        <div class="icon">
            <span class="fail">&#xe624;</span>
        </div>
        <div class="i_state">{{$t('state.tip4')}}！</div>
        <div class="info">
          {{$t('state.tip5')}}
         </div>
        <div class="info">
          {{$t('state.tip6')}}！
        </div>
        <div class="btn">
            <button type="button" @click="goCertify">{{$t('state.tip7')}}</button>
        </div>
      </div>
      <div class="fail" v-show="isShow==1">
        <div class="icon">
            <span class="fail">&#xe625;</span>
        </div>
        <div class="i_state">{{$t('state.tip8')}}！</div>
        <div class="info">
          {{$t('state.tip9')}}
         </div>
        <div class="info">
          {{$t('state.tip10')}}！
        </div>
      </div>
  </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: this.$store.state.status
    };
  },
  beforeRouteLeave(to, from, next) {
    if(to.path=='/Person'){
      this.$store.commit("changeRes", "setting");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "setting");
      this.$router.push("/Person");
    },
    goCertify(){
      this.$router.push('/certify')
    }
  },
};
</script>

<style lang="less">
.state {
  position: absolute;
  width: 100%;
  .header {
    z-index: 100;
    width: 100%;
    position: absolute;
    top: 0;
    .fa-long-arrow-left {
      font-size: 25px;
    }
  }
  .icon {
    margin: 0 auto;
    margin-top: 95px;
    width: 100px;
    height: 100px;
    border: 2px solid #f1b90c;
    border-radius: 50%;
    text-align: center;
    line-height: 100px;
  }
  .tips {
    font-family: "tips";
    font-size: 50px;
    color: #f1b90c;
  }
  .i_state {
    color: #f1b90c;
    text-align: center;
    margin-top: 15px;
  }
  .info {
    color: #a1968f;
    text-align: center;
    margin-top: 5px;
  }
  .fail {
    font-family: "shenfen";
    font-size: 50px;
    color: #f1b90c;
  }
  .btn {
    padding: 30px 15px;
    width: 100%;
    box-sizing: border-box;
    button {
      border-radius: 4px;
      background-color: #f1b90c;
      line-height: 45px;
      color: black;
    }
  }
}
</style>
