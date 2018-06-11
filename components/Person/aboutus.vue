<template>
  <transition :name="animate">
    <div class="aboutmain">
      <div class="header">
        <router-link to="/setting?path=aboutus" class="left_icon" tag="span">&#xe625;</router-link>
        <span class="title">{{$t('version.title')}}</span>
      </div>
      <div class="contwrap">
        <img src="../../assets/img/guide.png" alt="">
        <p>{{$t('about.info')}}: 1.0</p>
      </div>
    </div>
  </transition>
</template>

<script>
  "use strict";
  export default {
    data() {
      return {
        animate: "slide-right"
      };
    },
  };
</script>

<style lang="less">
  .aboutmain {
    position: absolute;
    width: 100%;
    height:100%;
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
    .contwrap{
      width:100%;
      position:absolute;
      top:25%;
      left:50%;
      transform:translate3d(-50%,0,0); 
      img{
        width:33.33%;
        height:auto;
        display: block;
        margin-left:auto;
        margin-right:auto;

      }
      p{
        margin-top:10px;
        text-align: center;
      }
    }

  }
</style>
