<template>
  <div class="footerbar" id="foot" :class="footname">
    <ul>
      <router-link to="/home" exact >
        <li>
          <span class="footicon homeicon"></span>
          <span class="title">{{$t('foot.trade')}}</span>
        </li>
      </router-link>
      <router-link to="/C2C">
        <li>
          <span class="footicon c2cicon"></span>
          <span class="title">{{$t('foot.c2c')}}</span>
          <i v-if="isTrades=='0'" class="fa fa-commenting msgicon"></i>
        </li>
      </router-link>

      <router-link to="/Person">
        <li>
          <span class="footicon personicon"></span>
          <span class="title">{{$t('foot.account')}}</span>
        </li>
      </router-link>
    </ul>
  </div> 
</template>
<script>
  export default {
    name: "footer",
    props:["isTrades","footname"],
    data() {
      return {};
    }
  };
</script>


<style lang="less">
  .footerbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    white-space: nowrap;
    height: 50px;
    z-index: 100;
    background-color: #352c24;
  }
  .footerbar li {
    position:relative;
    text-align: center;
    height: 50px;
    width:100%;
  }

  .footerbar ul {
    padding-top: 5px;
  }
  .footerbar a {
    color: #a3aab4;
    display: inline-block;
    width: calc(100%/3);
    text-align: center;
    height: 50px;
  }
  .footerbar .footicon{
    display: block;
    width:2rem;
    height:2rem;   
    margin:0 auto;
    overflow: hidden;
  }
  .footerbar .footicon{
    display: block;
    background:url(../../assets/img/home_n.png) no-repeat center;
    background-size:contain;
  }
  .footerbar .c2cicon{
    background-image: url(../../assets/img/trade_n.png);
  }
  .footerbar .personicon{
    background-image: url(../../assets/img/my_n.png);
  }
  .footerbar .title {
    font-size: 1.2rem;
  }
/*  .footerbar .router-link-active{
    color:#f1b90c;
  }
  .footerbar .router-link-active li .footicon i{
    color: #f1b90c !important;
    position: relative;
    left:-2rem;
    border-right: 2rem solid transparent;
    overflow: hidden;
    -webkit-filter: drop-shadow(2rem 0 #f1b90c);
    filter: drop-shadow(2rem 0 #f1b90c);    
  }*/
  .footerbar .qianbao {
    font-family: "qianbao";
    font-size: 18px;
    margin-left: 3px;
  }
  .msgicon{
    color:red;
    font-size:12px;
    position:absolute;
    top:0;
    left:65%;
  }
  .active1 a:nth-of-type(1){
    color:#f1b90c;
    .footicon{
      background-image:url("../../assets/img/home_a.png");
    }
  }
  .active2 a:nth-of-type(2){
    color:#f1b90c;
    .footicon{
      background-image:url("../../assets/img/trade_a.png");
    }
  }
  .active3 a:nth-of-type(3){
    color:#f1b90c;
    .footicon{
      background-image:url("../../assets/img/my_a.png");
    }
  }
</style>
