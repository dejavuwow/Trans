<template>
  <transition :name="animateName">
    <div class="trade">
      <div class="hdbar">{{$t('excenter')}}</div>
      <div class="nav-content">
        <div class="nav">
          <router-link to="/C2C/buyin">
            <span>{{$t('trade.tip1')}}</span>
          </router-link>
          <router-link to="/C2C/trade">
            <span>{{$t('trade.tip2')}}</span>
          </router-link> 
          <router-link to="/C2C/sellout">
            <span>{{$t('trade.tip3')}}</span>
          </router-link>
          <router-link to="/C2C/record">
            <span>{{$t('trade.tip4')}}</span>
          </router-link>
        </div>
        <div class="swiper">
          <div class="new_trade">{{$t('trade.tip5')}}:</div>
          <div id="box" class="swiper-container">
            <ul id="con1" ref="con1" class="swiper-wrapper">
              <li v-if="!!listImg[0] && listImg[0].price" v-for='(item,i) in listImg' :key="i" class="swiper-slide">
                <span>{{item.price*1|xiaoshu2}}</span>
                <span>{{item.num*1|xiaoshu2}}</span>
                <span>{{item.apay_time}}</span>
                <span v-if="item.updown>=0" class="ratio">+{{item.updown*100|xiaoshu2}}%</span>
                <span v-else class="ratio downr" >{{item.updown*100|xiaoshu2}}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <router-view></router-view>
      <footer1 :isTrades="isTrades" :footname="footname"></footer1>
    </div>
  </transition>
</template>
<script>
  import Footer1 from "../../Public/foot";
  import sha1 from "sha1";
  import axios from "axios";
  import Swiper from "swiper";
  export default {
    name: "trade",
    components: {
      Footer1
    },
    data() {
      return {
        footname:"active2",
        animateName: "",
        animate: false,
        isTrades:this.$store.state.isTrades,
      };
    },
    mounted() {
      let h1 = window.innerHeight;
      window.onresize = function() {
        let h2 = window.innerHeight;
        var foot = document.getElementById("foot");
        if (h1 > h2) {
          foot.style.display = "none";
        } else {
          foot.style.display = "block";
        }
      };  
      this.$nextTick(function () {
        var mySwiper = new Swiper('.swiper-container', {
          autoplay: 5000,
          loop:true,
          direction:"vertical",
          speed:1000
        })
      })
    },
    created() {
    },
    computed: {
      listImg() {
        return [
        this.$store.state.now,
        this.$store.state.now,
        this.$store.state.now
        ];
      }
    },
    watch:{
      // listImg(v,ov){
      //   console.log(v)
      //   var mySwiper = new Swiper('.swiper-container', {
      //     autoplay: 5000,
      //     loop:true,
      //     direction:"vertical",
      //     speed:1000
      //   })
      //   console.log(mySwiper)
      // }
    },
    methods: {
      go() {
        this.$router.push("/buyin");
      }
    }
  };
</script>
<style lang="less">
  .trade {
    position: absolute;
    width: 100%;
    height:100%;
    .hdbar{
      width:100%;
      height:45px;
      text-align: center;
      line-height: 45px;
      background: #1d1c1c;
      font-size: 16px;
    }
    .header {
      background-color: rgb(31, 25, 35);
      text-align: center;
      position: fixed;
      z-index: 100;
      top: 0;
      padding: 0 15px;
      .fa-line-chart {
        color: #fff;
        float: left;
        line-height: 45px;
      }
    }
    .nav-content {
      background-color: #1d1c1c;
      position: relative;
      z-index: 100;
    }
    .nav {
      height: 40px;
      background-color: #333;
      padding: 0 10px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 100;
      .gold {
        color: #f1b90c;
      }
      a {
        color: rgb(131, 153, 168);
      }
    }
    .trade-content {
      width: 100%;
      display: flex;
      #left {
        display: inline-block;
        width: 60%;
        padding: 0 5px 0 10px;
        background-color: #fff;
        height: 72vh;
        position: relative;
        overflow: auto;
        z-index: 99;
        .scroll {
          min-height: 101%;
        }
        .th {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          padding-bottom: 5px;
        }
      }
      .right {
        width: 44%;
        height: 72vh;
        display: inline-block;
        overflow-y: scroll;
        background-color: #fff;
        box-sizing: border-box;
        border-left:1px solid #ccc;
        .scroll {
          padding: 10px;
          padding-bottom: 10px;
          padding-top: 0;
          border-radius: 8px;
          min-height: 101%;
          .up {
            background-color: rgb(38, 38, 58);
            border-radius: 4px;
            padding: 10px;
            padding-top: 0;
            box-sizing: border-box;
            height: 36vh;
          }
          .down {
            background-color: rgb(38, 38, 58);
            border-radius: 8px;
            padding: 10px;
            height: 36vh;
          }
          .line {
            background-color: #1f1923;
            height: 10px;
          }
        }
      }
    }
    .el-input__inner {
      background-color: #fff !important;
      height: 35px;
      border: 1px solid #ccc !important;
      margin-top: 4px;
      line-height: 35px;
    }
    .el-input__icon {
      margin-top: 5px !important;
    }
    .buy-btn {
      height: 35px;
      line-height: 35px;
      margin-top: 10px;
      background-color: red;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .sell-btn {
      height: 35px;
      line-height: 35px;
      margin-top: 10px;  
      background-color: rgb(59, 164, 71);
      border-radius: 4px;
    }
    .refresh {
      text-align: center;
      color: rgb(90, 90, 90);
    }
    .all-load {
      text-align: center;
      color: rgb(90, 90, 90);
    }
  }
  .swiper {
    white-space: nowrap;
    background-color: #1d1c1c;
    padding: 0 10px;
    position: relative;
    z-index: 100;
  }
  #box {
    width: 80%;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    display: inline-block;
    transition: all 0.5s;
    color: #fff;
    text-align: center;
    background-color: #1d1c1c;
    vertical-align: middle;
  }
  .new_trade {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
  }
  .anim {
    transition: all 1.5s;
    margin-top: -34px;
  }
  #con1 li {
    list-style: none;
    line-height: 40px;
    height: 40px;
    color: #fff;
    span {
      margin-left: 10px;
      display: inline-block;
    }
  }
  .router-link-active {
    color: #f1b90c !important;
    border-bottom:2px solid #f1b90c;
  }
  .ratio{
    border-radius: 2px;
    background: #00AA00;
    height:25px;
    line-height: 25px;
    padding-right:3px;
  }
  .downr{

    background: #FF0000;
  }
</style>

