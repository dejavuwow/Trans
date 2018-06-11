<template>
  <transition name="slide-right">
    <div class="certify">
      <div class="header">       
        <h1>
          <span class="left_icon" @click="jumpBack()">&#xe625;</span>
          {{$t('certify.tip4')}}
        </h1>
      </div>
      <div class="steps">
        <div class="step">
          <div class="first">
            <span>1</span>
          </div>
          <div class="line"></div>
          <div class="first second">
            <span>2</span>
          </div>
          <div class="line second"></div>
          <div class="first second">
            <span>3</span>
          </div>
        </div>
        <div class="info">
          <div class="gold">{{$t('certify.tip18')}}</div>
          <div>{{$t('certify.tip19')}}</div>
          <div>{{$t('certify.tip20')}}</div>
        </div>
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="input-content">
          <div class="input-item">
            <div class="label">{{$t('certify.tip21')}}</div>
            <input type="text" name="" id="" :placeholder="$t('certify.tip22')" v-model="name">
          </div>
          <div class="input-item">
            <div class="label">{{$t('register.country')}}</div>
            <select name="" id="phone" v-model="country_selected">
              <option v-for="coun in countrys">{{coun.substr(0,coun.lastIndexOf('-'))}}</option>
            </select>
            <div class="select"><span class="fa fa-angle-right"></span></div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('certify.tip23')}}</div>
            <input type="text" name="" id="" :placeholder="$t('certify.tip24')" class="short" disabled v-model="doc_type">
            <span class="icon">
              <span class="fa fa-angle-right"></span>
            </span>
          </div>
          <div class="input-item">
            <div class="label">{{$t('certify.tip25')}}</div>
            <input type="text" name="" id="" :placeholder="$t('certify.tip26')" v-model="card_num">
          </div>
          <div class="input-item espec">
            <div class="label">{{$t('certify.tip27')}}</div>
            <!-- <input type="text" name="" id="" placeholder="请选择性别"  @click="selectSex" v-model="sex"> -->
            <span v-if="sex==''" class="wu" @click="selectSex">请选择性别</span>
            <span v-else-if="sex=='0'" @click="selectSex" class="short">{{$t('certify.tip28')}}</span>
            <span v-else @click="selectSex" class="short">{{$t('certify.tip29')}}</span>
          </div>
          <div class="input-item">
            <div class="label">{{$t('certify.tip30')}}</div>
            <input type="text" name="" id="" v-model="date" :placeholder="$t('certify.tip31')+':'+20180101" >
          </div>
          <div class="input-item">
            <div class="label">{{$t('certify.tip32')}}</div>
            <input type="text" name="" id="" :placeholder="$t('certify.tip33')" v-model="job">
          </div>
          <div class="input-item">
            <div class="label">{{$t('certify.tip34')}}</div>
            <input type="text" name="" id="" :placeholder="$t('certify.tip35')" v-model="address">
          </div>
          <div class="btn">
            <button type="button" id="btn" @click="save">{{$t('certify.tip36')}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import country from "../../assets/js/config";
  import axios from "axios";
  import sha1 from "sha1";
  import md5 from "md5";
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        myScroll: null,
        date: "",
        test3: "11111",
        test2: "1",
        test1: "1",
        timer: null,
        doc_type: this.$t('certify.tip24'),
        countrys: country.country_cn,
        country_selected: "China-中国",
        date: "",
        sex:'0',
        job:'',
        address:'',
        card_num:'',
        name:'',
        idregex:/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/,
      };
    },
    created() {
      if (
        this.$store.state.urlRes == "upload"
        ) {
        this.animateName = "";
    }
    if(this.$store.state.save!=''){
      this.name=this.$store.state.save.name;
      this.country_selected=this.$store.state.save.country;
      this.doc_type=this.$store.state.save.doc_type;
      this.card_num=this.$store.state.save.card_num;
      this.sex=this.$store.state.save.sex;
      this.date=this.$store.state.save.date;
      this.job=this.$store.state.save.job;
      this.address=this.$store.state.save.address;
    }
  },
  mounted() {
    // 滚动
    this.$nextTick(() => {
      if(!this.scroll){
        this.scroll = new BScroll(this.$refs.wrapper, {
          click:true
        })
      }else if(!this.$refs.wrapper){
        return
      }
      else{
        this.scroll.refresh()
      }
    })
    // 防止底部按钮弹起
    let h1 = window.innerHeight;
    window.onresize = function() {
      let h2 = window.innerHeight;
      var foot = document.getElementById("btn");
      if (h1 > h2) {
        foot.style.display = "none";
      } else {
        foot.style.display = "block";
      }
    };
  },
  methods: {
    jumpBack(){
      this.$router.push('/Person');
    },
    iScrollClick() {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent))
        return /Android/i.test(navigator.userAgent);
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        var s = navigator.userAgent.substr(
          navigator.userAgent.indexOf("Android") + 8,
          3
          );
        return parseFloat(s[0] + s[3]) < 44 ? false : true;
      }
    },
    selectSex(){
      var _this = this;
      plus.nativeUI.actionSheet(
      {
        title:_this.$t("my.tip8"),
        cancel: _this.$t("login.option2"),
        buttons: [
        { title: _this.$t("my.tip9")},
        { title: _this.$t("my.tip10") },
        ]
      },
      function(e) {
        if(e.index==1){
          _this.sex='0';
        }else if(e.index==2){
          _this.sex='1';
        }
      }
      );
    },
    save(){
      if(!this.name||!this.country_selected||!this.doc_type||!this.card_num||!this.sex||!this.date||!this.job||!this.address){
        this.$message({
          message: this.$t("alipay.tip"),
          duration: 1500
        });
        return false;
      }
      if(!this.idregex.test(this.card_num)){
       this.$message({
        message: this.$t("alipay.tip2"),
        duration: 1500
      });
       return;
     }
     this.$store.commit('changeSave',{name:this.name,country:this.country_selected,doc_type:this.doc_type,card_num:this.card_num,sex:this.sex,date:this.date,job:this.job,address:this.address})
     this.$router.push('/upload')
   }
 }
};
</script>

<style lang="less">
  .certify {
    height:100%;
    width:100%;
    position: absolute;
    .wu{
      color:rgb(88, 86, 89)!important;
    }
    .header {
      z-index: 101;
      position: relative;
      .left_icon {
        left: 15px;
        top: -7.5px;
      }
    }
    .steps {
      background-color: #333;
      position: relative;
      width: 100%;
      z-index: 100;
      .step {
        padding: 0 45px;
        padding-top:10px;
        white-space: nowrap;
      }
      .first {
        width: 25px;
        height: 25px;
        background-color: #f1b90c;
        color: black;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
        span {
          vertical-align: middle;
          line-height: 25px;
        }
      }
      .second {
        background-color: rgb(142, 153, 168) !important;
      }
      .line {
        height: 1px;
        background-color: #f1b90c;
        display: inline-block;
        width: 34% !important;
      }
    }
    .info {
      display: flex;
      padding: 0 30px 5px 30px;
      justify-content: space-between;
      div {
        color: #a3aab4;
      }
      .gold {
        color: #f1b90c;
      }
    }
    .wrapper {
      overflow: hidden;
      position: absolute;
      top:104px;
      bottom:0;
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
    .input-content {
      white-space: nowrap;
      padding: 0 15px;
      min-height: 101%;
      .input-item {
        padding: 5px 0;
        width: 100%;
        box-sizing: border-box;

        .label {
          width: 25%;
          display: inline-block;
          text-align: left;
          margin-left: 10px;
          color: #a3aab4;
        }
        input {
          width: 75%;
          border: none;
          text-align: left;
          color: #d6e9fc;
        }
        .short {
          width: 55%;
        }
        .icon {
          display: inline-block;
          float: right;
          line-height: 54px;
        }
        .fa-angle-right {
          font-size: 25px;
        }
      }
    }
    #phone {
      width: 55%;
      background: none;
      border: none;
      height: 36px;
      color: #d6e9fc;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      outline: none;
    }
    .select {
      display: inline-block;
      width: 5%;
      float: right;
      margin-top: 9px;
      text-align: right;
      vertical-align: middle;
      span {
        font-size: 18px;
      }
    }
    .label {
      display: inline-block;
      width: 35%;
      color: #97989a;
    }
    .espec {
      span{
        display: inline-block;
        padding:15px 0;
        color: #d6e9fc;
      }
    }
  }
</style>
