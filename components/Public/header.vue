<template>
  <div class="pub_head">
    <slot name="left"></slot>
    <span class="he_title">{{title}}</span>
    <slot name="right"></slot>
  </div>
</template>
<script>
  import axios from "axios";
  import md5 from "md5";
  export default {
    props:["title"],
  };
</script>
<style lang="scss">
  @import "../../assets/sass/index.scss";
  .pub_head{
    @include flex(row,space-between);
    color:#fff;
    height:.9rem;
    width:100%;
    i{
      @include fl(.7rem,.9rem,#fff);
      width:0.9rem;
      display:block;
      @include flex(row,center);
      align-items: center;
    }
    span{
      @include fl(0.3rem,.9rem,#fff);
    }
    .he_title{
      font-size: 0.35rem;
    }
  }
</style>


