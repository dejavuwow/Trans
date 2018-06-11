<template>
  <transition :name="animate">
    <div class="roll-in"
    v-loading="loading2"
    :element-loading-text="$t('err.tip14')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :fullscreen="false">
    <div class="header">
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
            {{$t('transfer.tip1')}}
            <span class="el-icon-tickets" @click="jump()"></span>
        </h1>
    </div>
    <div class="generate"  @click="generate" v-show="isShow">
        <button type="button">{{$t('transfer.tip2')}}</button>
    </div>
    <div v-show="!isShow">
      <div class="address-info">
        <p>{{$t('transfer.tip3')}}：</p>
        <p class="address">{{url}}</p>
    </div>
    <div class="btn">
        <button type="button" @click="copy">{{$t('transfer.tip4')}}</button>
    </div>
    <div class="img-content">
        <img :src="path" alt="">
        <p>{{$t('transfer.tip5')}}</p>
    </div>
    </div>
    <div class="loading" v-show="ishow">
            <div class="load-content"><vue-loading type="bars" color="rgb(247, 186, 42)" :size="{ width: '50px', height: '50px' }"></vue-loading></div>
      </div>
  </div>
  </transition>
</template>

<script>
import sha1 from "sha1";
import vueLoading from "vue-loading-template";
export default {
  components: {
    vueLoading
  },
  data() {
    return {
      animate: "slide-right",
      isShow: true,
      url: "",
      path: "",
      ishow: true,
      loading2: false
    };
  },
  created() {
    if (this.$store.state.urlRes == "in-record") {
      this.animate = "slide-left";
    }
    this.$http
      .post(
        this.$store.state.url + "Api/Address/isLoadTheAddress",
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
          this.isShow = false;
          this.url = res.data.info.chongzhi_url;
          this.path = this.$store.state.url + res.data.info.chongzhi_code;
        } else {
          this.isShow = true;
        }
      })
      .catch(function(response) {
        plus.nativeUI.toast(this.$t("err.info"), {
          verticalAlign: "center"
        });
      });
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/in-record") {
      this.animate = "slide-left";
    } else {
      this.animate = "slide-right";
    }
    if (to.path == "/Person") {
      this.$store.commit("changeRes", "in");
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "in");
      this.$router.push("/Person");
    },
    jump() {
      this.$router.push("/in-record");
    },
    generate() {
      this.loading2 = true;
      this.$http
        .post(
          this.$store.state.url + "Api/Address/loadTheAddress",
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
          this.loading2 = false;
          if (res.data.status == 0) {
            this.$message({
              message: this.$t("tote.tip2"),
              duration: 1500
            });
          } else if (res.data.status == 1) {
            this.isShow = false;
            this.url = res.data.info.chongzhi_url;
            this.path = this.$store.state.url + res.data.info.chongzhi_code;
            this.loading2 = false;
          } else {
            this.$message({
              message: this.$t("tote.tip2"),
              duration: 1500
            });
          }
        })
        .catch(function(response) {
          this.loading2 = false;
          this.$message({
            message: this.$t("err.info"),
            duration: 1500
          });
        });
    },
    copy() {
      var _this = this;
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        // ios
        var UIPasteboard = plus.ios.importClass("UIPasteboard");
        var generalPasteboard = UIPasteboard.generalPasteboard();
        // 设置/获取文本内容:
        generalPasteboard.setValueforPasteboardType(
          this.url,
          "public.utf8-plain-text"
        );
        var value = generalPasteboard.valueForPasteboardType(
          "public.utf8-plain-text"
        );
        this.$message({
          message: this.$t("chongzhi.tip4"),
          duration: 1500
        });
      } else if (/(Android)/i.test(navigator.userAgent)) {
        // android
        var Context = plus.android.importClass("android.content.Context");
        var main = plus.android.runtimeMainActivity();
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
        plus.android.invoke(clip, "setText", this.url);
        this.$message({
          message: this.$t("chongzhi.tip4"),
          duration: 1500
        });
      }
    }
  }
};
</script>

<style lang="less">
.roll-in {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  .header {
    text-align: center;
    padding-right: 15px;
    position: relative;
    .left_icon {
      left:15px;
      top: -7.5px;
    }
    .el-icon-tickets {
      font-size: 20px;
      position: absolute;
      line-height: 25px;
      right: 0;
    }
  }
  .generate {
    padding: 0 15px;
    margin-top: 100px;
    button {
      background-color: transparent;
      border-radius: 4px;
      border: 1px solid rgb(255, 195, 52);
      color: rgb(255, 195, 52);
    }
  }
  .address-info {
    padding: 0 15px;
    margin-top: 30px;
    p {
      color: #a1968f;
      line-height: 40px;
      white-space: normal;
      word-break: break-all;
    }
    .address{
      color:#fff;
    }
  }
  .line {
    border-bottom: 1px solid #2f3144;
  }
  .btn {
    padding: 30px 15px 0;
    button {
      background-color: rgb(255, 195, 52);
      color: black;
      border-radius: 4px;
    }
  }
  .img-content {
    margin-top: 50px;
    text-align: center;
    img {
      width: 12rem;
      margin-bottom: 5px;
    }
  }
  .load-content {
    align-self: auto;
    margin-top: 250px;
  }
}
</style>
