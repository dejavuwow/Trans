<template>
  <transition :name="animate">
    <div class="setting">
      <div class="header">
        <span class="left_icon" @click="goBack()">&#xe625;</span>
        <span class="title">{{$t('setting.tip')}}</span>
      </div>
      <div class="set-info">
        <router-link to="/updatePwd">
          <div class="bar-short">
            <div>{{$t('setting.tip1')}}</div>
            <div class="info"><span class="fa fa-angle-right"></span></div>
          </div>
        </router-link>
        <router-link to="/payPwd">
          <div class="bar-short">
            <div>{{$t('setting.tip2')}}</div>
            <div class="info"><span class="fa fa-angle-right"></span></div>
          </div>
        </router-link>
        <router-link to="/about" class="bar-short" >
          <div>{{$t('setting.tip3')}}</div>
          <div class="info"><span class="fa fa-angle-right"></span></div>
        </router-link>
        <router-link to="/aboutus" class="bar-short" >
          <div>{{$t('version.title')}}</div>
          <div class="info"><span class="fa fa-angle-right"></span></div>
        </router-link>
        <div class="bar-short" @click="lang()">
          <div>{{$t('setting.tip4')}}</div>
          <div class="info">{{$t('setting.tip5')}}<span class="fa fa-angle-right"></span></div>
        </div>
      </div>
      <div class="quit" @click="quit()">{{$t('setting.tip7')}}</div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        animate: "slide-right"
      };
    },
    methods: {
      goBack() {
        this.$store.commit("changeRes", "setting");
        this.$router.push("/Person");
      },
      quit() {
        var _this = this;
        plus.nativeUI.confirm(
          _this.$t("person.info"),
          function(e) {
            if (e.index == 0) {
              _this.animate = "slide-right";
              _this.$router.push({ path: "/", query: { t: "3" } });
            } else {
            }
          },
          { buttons: [_this.$t("person.sele"), _this.$t("person.sele1")] }
          );
      },
    // 切换语言
    lang(){
      var _this=this
      plus.nativeUI.actionSheet(
      {
        title:_this.$t("login.title"),
        cancel: _this.$t("login.option2"),
        buttons: [{ title: _this.$t("login.option") }, { title: _this.$t("login.option1") }]
      },
      function(e) {
        if(e.index==1){
         _this.$i18n.locale  = 'cn'
         localStorage.setItem('lan','cn')
       }else if(e.index==2){
        _this.$i18n.locale  = 'en'
        localStorage.setItem('lan','en')
      }
    }
    );
    }
  },
  created() {
    // 进入动画
    if (
      this.$store.state.urlRes == "update" ||
      this.$store.state.urlRes == "paypwd" ||
      this.$route.query.path
      ) {
      this.animate = "slide-left";
  }
},
beforeRouteLeave(to, from, next) {
    // 离开动画
    if (to.path == "/updatePwd" || to.path == "/payPwd" || to.path == "/aboutus" || to.path == "/about") {
      this.animate = "slide-left";
    } else {
      this.animate = "";
    }
    if(to.path=='/Person'){
      this.$store.commit("changeRes", "setting");
    }
    setTimeout(function() {
      next();
    }, 50);
  }
};
</script>

<style lang="less">
  .setting {
    position: absolute;
    width: 100%;
    .header {
      text-align: center;
      padding-left: 15px;
      .left_icon {
        font-size: 25px;
        position: absolute;
        left: 15px;
        line-height: 25px;
      }
      .title {
        line-height: 25px;
        font-size: 1.8rem;
      }
    }
    .set-info {
      color: #d6e9fc;
      .bar-short {
        display: flex;
        line-height: 45px;
        padding: 0 15px;
        justify-content: space-between;
        border-bottom: 1px solid #44352f;
        div {
          color: #d6e9fc;
        }
        .info {
          color: #d6e9fc;
          display: flex;
          .fa {
            font-size: 20px;
            align-self: center;
            margin-left: 5px;
          }
        }
      }
      .border-none {
        border: none;
        span {
          margin-left: 10px !important;
        }
      }
    }
    .quit {
      line-height: 45px;
      text-align: center;
      color: #d6e9fc;
      border-bottom: 1px solid #44352f;
      border-top: 1px solid #44352f;
      margin-top:30px;
      width:90%;
      background: #fd5c3f;
      color:#fff;
      margin-left:auto;
      margin-right:auto;
      border-radius:4px;

    }
  }
</style>
