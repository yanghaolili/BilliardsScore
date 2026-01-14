<template></template>
<script>
export default {
  data() {
    return {};
  },
  onLaunch: function () {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: process.env.VUE_APP_ENV_ID,
        traceUser: true,
      });
    }

    // // 检查登录状态
    this.$store.dispatch("checkLogin");
    if (!this.$store.state.token) {
      wx.redirectTo({
        url: "/pages/login/index",
      });
    }
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
</style>
