<template>
  <transition :name="animate">
    <div class="wallet">
      <div class="header">
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
            {{$t('transfer.tip21')}}
        </h1>
    </div>
    <div class="content">
      <div class="item" v-for="(item,i) in list" :key="i" @click="choose(item.qianbao_url)">
        <span>{{item.name}}：</span>
        <span>{{item.qianbao_url.substr(0,4)}}********{{item.qianbao_url.substr(38,42)}}</span>
        <span class="el-icon-delete" @click="del(item.id,i)"></span>
      </div>
    </div>
    <div class="btn">
        <button type="button" @click="goNext">{{$t('transfer.tip22')}}</button>
    </div>
    <div class="loading" v-show="loading">
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
      list: "",
      loading: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/roll-out") {
      this.$store.commit("changeRes", "wallet");
      this.animate = "slide-right";
    } else {
      this.animate = "slide-left";
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  created() {
    if (this.$store.state.urlRes == "address") {
      this.animate = "slide-left";
    }
  },
  mounted() {
    this.loading = true;
    this.$http
      .post(
        this.$store.state.url + "Api/Address/addressLst",
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
      .catch(function(re) {
        this.loading = false;
        this.$message({
          message: this.$t("err.info"),
          duration: 1500
        });
      });
  },
  methods: {
    goNext() {
      this.$router.push("/add-address");
    },
    jumpBack() {
      this.$store.commit("changeRes", "wallet");
      this.$router.push("/roll-out");
    },
    del(id, i) {
      this.$http
        .post(
          this.$store.state.url + "Api/Address/delAddress",
          {
            id: id,
            token: sha1(id + this.$store.state.str)
          },
          {
            headers: {},
            emulateJSON: true
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            this.list.splice(i, 1);
          }
        })
        .catch(function(re) {
          this.$message({
            message: this.$t("err.info"),
            duration: 1500
          });
        });
    },
    choose(address) {
      this.$store.commit("changeAddress", address);
      this.$store.commit("changeRes", "wallet");
      this.$router.push("/roll-out");
    }
  }
};
</script>

<style lang="less">
.wallet {
  position: absolute;
  width: 100%;
  .header {
    text-align: center;
    padding-right: 15px;
    position: relative;
    .left_icon {
        top: -7.5px;
        left: 15px;
    }
  }
  .btn {
    margin: 30px 15px;
    button {
      border-radius: 4px;
      background-color: #f1b90c;
      color: black;
    }
  }
  .content {
    padding: 15px;
    .item {
      line-height: 45px;
      padding: 0 15px;
      background-color: #333;
      border-radius: 5px;
      border: 1px solid #26263a;
      position: relative;
      margin-top: 20px;
    }
    .el-icon-delete {
      color: #a1968f;
      float: right;
      font-size: 20px;
      margin-top: 12px;
    }
  }
}
</style>
