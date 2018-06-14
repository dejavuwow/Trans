<template>
  <div class="code" @click="refreshCode">
    <Identify :identifyCode="identifyCode"></Identify>
  </div>
</template>
<script>
  "use strict";
  import Identify from './identify'//图片验证码组件
  export default {
    name: "codetest",
    components:{Identify},
    data() {
      return {
        identifyCodes: "1234567890",
        identifyCode: "",
      };
    },
    mounted() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    methods: {
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
          ];
        }
        this.$emit("imgMsg",this.identifyCode);
      }
    }
  };
</script>
<style>
</style>