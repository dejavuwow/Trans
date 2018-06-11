<template>
    <router-view></router-view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      currentPath: "",
      timer: "",
      later: "",
      add: 0,
      time1:'',
      time2:""
    };
  },
  watch: {
    $route: {
      handler: function(v, ov) {
        console.log(v.path + "v");
        this.currentPath = ov.path;
      }
    }
  },
  computed: {
    ...mapGetters(["buyState"])
  },
  mounted() {
    var th = this;
    document.addEventListener("plusready", function() {
      plus.key.addEventListener(
        "backbutton",
        function() {
          if (
            th.$route.path != "/home" &&
            th.$route.path != "/C2C/buyin" &&
            th.$route.path != "/Fund" &&
            th.$route.path != "/Person" &&
            th.$route.path != "/receive" &&
            th.$route.path != "/" &&
            th.$route.path != "/findpwd" &&
            th.$route.path != "/resetpwd" &&
            th.$route.path != "/personInfo" &&
            th.$route.path != "/credit" &&
            th.$route.path != "/updatePwd" &&
            th.$route.path != "/setting" &&
            th.$route.path != "/payPwd" &&
            th.$route.path != "/in-record" &&
            th.$route.path != "/roll-in" &&
            th.$route.path != "/out-record" &&
            th.$route.path != "/roll-out" &&
            th.$route.path != "/wallet" &&
            th.$route.path != "/add-address" &&
            th.$route.path != "/bank" &&
            th.$route.path != "/addBank" &&
            th.$route.path != "/chat" &&
            th.$route.path != "/sellout" &&
            th.$route.path != "/trade" &&
            th.$route.path != "/record" &&
            th.$route.path != "/state"
          ) {
            th.$router.push({ path: th.currentPath });
          } else if (th.$route.path == "/") {
            th.add++;
            if (th.add == 1) {
              th.$message({
                message: th.$t("err.tip13"),
                duration: 1500
              });
              th.timer = Date.parse(new Date());
            } else {
              th.later = Date.parse(new Date());
              if (th.later - th.timer < 1500) {
                plus.runtime.quit();
              } else {
                th.add = 0;
              }
            }
          } else if (th.$route.path == "/Person") {
            th.add++;
            if (th.add == 1) {
              th.$message({
                message: th.$t("err.tip13"),
                duration: 1500
              });
              th.timer = Date.parse(new Date());
            } else {
              th.later = Date.parse(new Date());
              if (th.later - th.timer < 1500) {
                plus.runtime.quit();
              } else {
                th.add = 0;
              }
            }
          } else if (th.$route.path == "/C2C/buyin") {
            th.add++;
            if (th.add == 1) {
              th.$message({
                message: th.$t("err.tip13"),
                duration: 1500
              });
              th.timer = Date.parse(new Date());
            } else {
              th.later = Date.parse(new Date());
              if (th.later - th.timer < 1500) {
                plus.runtime.quit();
              } else {
                th.add = 0;
              }
            }
          } else if (th.$route.path == "/home") {
            th.add++;
            if (th.add == 1) {
              th.$message({
                message: th.$t("err.tip13"),
                duration: 1500
              });
              th.timer = Date.parse(new Date());
            } else {
              th.later = Date.parse(new Date());
              if (th.later - th.timer < 1500) {
                plus.runtime.quit();
              } else {
                th.add = 0;
              }
            }
          } else if (th.$route.path == "/resetpwd") {
            th.$router.push("/findpwd");
          } else if (th.$route.path == "/chat") {
            th.$router.push("/C2C");
          } else if (th.$route.path == "/C2C/record") {
            th.$router.push("/C2C");
          } else if (th.$route.path == "/C2C/trade") {
            th.$router.push("/C2C");
          } else if (th.$route.path == "/C2C/sellout") {
            th.$router.push("/C2C");
          } else if (th.$route.path == "/findpwd") {
            th.$router.push("/");
          } else if (th.$route.path == "/credit") {
            th.$router.push("/personInfo");
          } else if (th.$route.path == "/personInfo") {
            th.$router.push("/Person");
          } else if (th.$route.path == "/updatePwd") {
            th.$router.push("/setting");
          } else if (th.$route.path == "/payPwd") {
            th.$router.push("/setting");
          } else if (th.$route.path == "/setting") {
            th.$router.push("/Person");
          } else if (th.$route.path == "/state") {
            th.$router.push("/Person");
          } else if (th.$route.path == "/in-record") {
            th.$router.push("/roll-in");
          } else if (th.$route.path == "/roll-in") {
            th.$router.push("/Person");
          } else if (th.$route.path == "/out-record") {
            th.$router.push("/roll-in");
          } else if (th.$route.path == "/roll-out") {
            th.$router.push("/Person");
          } else if (th.$route.path == "/wallet") {
            th.$router.push("/roll-out");
          } else if (th.$route.path == "/add-address") {
            th.$router.push("/wallet");
          } else if (th.$route.path == "/addBank") {
            th.$router.push("/bank");
          } else if (th.$route.path == "/bank") {
            th.$router.push("/Person");
          } else {
            plus.runtime.quit();
          }
        },
        false
      );
    });
    // 切换到后台
    document.addEventListener("plusready", this.onPlusReady, false);
  },
  methods: {
    onPlusReady() {
      document.addEventListener("pause", this.onAppPause, false);
      document.addEventListener("resume", this.onAppReume, false);
    },
    onAppPause() {
      this.time1=Date.parse(new Date())
    },
    onAppReume() {
      this.time2=Date.parse(new Date())
      let sum=(this.time2*1/1000)-(this.time1*1/1000)
      if(sum>300){
        plus.runtime.restart();
      }
    }
  }
};
</script>

<style>
#app {
}
</style>
