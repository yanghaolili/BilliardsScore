<script>
export default {
  onLaunch: function () {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: "你的云环境ID",
        traceUser: true,
      });
    }

    // 检查登录状态
    this.$store.dispatch("user/checkLogin");
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
