<template>
  <transition name="slide-right">
      <div class="note">
      <div class="header">
          <h1>
                <span class="left_icon" @click="back1()">&#xe625;</span>
                {{$t('note.title')}}
          </h1>
      </div>
      <div class="h1">
          {{title}}
      </div>
      <div class="time">
          {{time}}
      </div>
      <div class="content">
          <img :src="img" alt="">
      </div>
      <div class="info">
          {{content}}
      </div>
  </div>
  </transition>
</template>
<script>
import $ from "jquery";
import sha1 from "sha1";
export default {
  data() {
    return {
      content: this.$route.query.content,
      time: this.$route.query.time,
      img: this.$store.state.url + this.$route.query.img,
      title:this.$route.query.title,
    };
  },
  methods: {
    back1() {
      this.$store.commit("changeRes", "note");
      this.$router.push("/home");
    }
  },
  computed: {
    token() {
      return sha1(
        this.$store.state.note_id + this.$i18n.locale + this.$store.state.str
      );
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.note .h1 {
  padding: 8px 15px;
}
.note .content {
  padding: 15px;
  img {
    width: 100%;
  }
}
.note {
  .header {
    border-bottom: 0.1px solid rgb(47, 49, 68);
    text-align: center;
    .left_icon{
      font-size: 25px;
      left: 15px;
      line-height: 25px;
    }
  }
  .time {
    color: #5b6172;
    padding-left: 15px;
  }
  .info {
    padding: 15px;
  }
}
</style>


