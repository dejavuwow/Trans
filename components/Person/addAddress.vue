<template>
  <transition :name="animate">
    <div class="add-address">
    <div class="header">
        <h1>
            <span class="left_icon" @click="jumpBack()">&#xe625;</span>
            {{$t('transfer.tip23')}}
        </h1>
    </div>
    <div class="address-content">
        <div class="input-item">
            <label>{{$t('transfer.tip24')}}：</label>
            <input type="text"  class="middle" v-model="name">
        </div>
        <div class="input-item">
            <div class="bg">
                <label>{{$t('transfer.tip25')}}：</label>
                <textarea name="" id="" cols="2" rows="2" class="short" v-model="address"></textarea>
            </div>
            <router-link to="out-record">
              <span class="watch">{{$t('transfer.tip26')}}</span>
            </router-link>
        </div>
        <div class="input-item">
            <label>{{$t('transfer.tip27')}}：</label>
            <input type="text" class="middle" v-model="note">
        </div>
        <div class="btn">
            <button type="button" @click="confirm">{{$t('transfer.tip28')}}</button>
        </div>
    </div>
  </div>
  </transition>
</template>

<script>
import sha1 from "sha1";
export default {
  data() {
    return {
      animate: "slide-right",
      name: "",
      address: "",
      note: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/wallet") {
      this.$store.commit("changeRes", "address")
    }
    setTimeout(function() {
      next();
    }, 50);
  },
  methods: {
    jumpBack() {
      this.$store.commit("changeRes", "address");
      this.$router.push("/wallet");
    },
    confirm() {
      if (!this.name || !this.address || !this.note) {
        this.$message({
          message: this.$t("updateAds.tip1"),
          duration: 1500
        });
        return false;
      }
      this.$http
        .post(
          this.$store.state.url + "Api/Address/addAddress",
          {
            member_id: this.$store.state.member_id,
            name: this.name,
            qianbao_url: this.address,
            remarks: this.note,
            token: sha1(
              this.$store.state.member_id +
                this.name +
                this.address +
                this.note +
                this.$store.state.str
            )
          },
          {
            headers: {},
            emulateJSON: true
          }
        )
        .then(res => {
          if (res.data.status == 1) {
            this.$store.commit("changeRes", "address");
            this.$router.push("/wallet");
            this.$message({
              message: this.$t("updateAds.tip2"),
              duration: 1500
            });
          } else if (res.data.status == "04") {
            this.$message({
              message: this.$t("updateAds.tip8"),
              duration: 1500
            });
          } else {
            this.$message({
              message: this.$t("updateAds.tip7"),
              duration: 1500
            });
          }
        })
        .catch(function(re) {
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
.add-address {
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
  .address-content {
    margin-top: 30px;
  }
  .input-item {
    border-bottom: 1px solid #44352f;
    margin: 0 15px;
    label {
      display: inline-block;
      color: #a1968f;
    }
    .short {
      width: 50%;
      background-color: transparent;
      border: none;
      outline: none;
      resize: none;
      color: #97989a;
      margin-top: 4px;
      color: #a1968f;
    }
    .bg {
      margin: 15px 0;
      display: inline-block;
      width: 60%;
      label {
        display: inline-block;
        vertical-align: top;
        margin-top: 6px;
      }
    }
    .watch {
      display: inline-block;
      width: 20%;
      float: right;
      padding: 5px;
      color: #f1b90c;
      border: 1px solid #f1b90c;
      text-align: center;
      border-radius: 4px;
      margin-top: 8px;
    }
    .middle {
      width: 80%;
      color: #a1968f;
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
}
</style>
