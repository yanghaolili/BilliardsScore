<template>
  <u-tabbar
    class="tabbar"
    :placeholder="false"
    v-model="activeTab"
    @change="handleChangeTab"
    :fixed="false"
    :safeAreaInsetBottom="false"
  >
    <u-tabbar-item
      v-for="item in tabbarData"
      :key="item.name"
      :text="item.text"
      :icon="item.icon"
      :name="item.name"
    ></u-tabbar-item>
  </u-tabbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      activeTab: "home",
      tabbarData: [
        { name: "home", text: "首页", icon: "home" },
        { name: "category", text: "战绩", icon: "file-text" },
        { name: "mine", text: "我的", icon: "account" },
      ],
    };
  },
  computed: {
    ...mapState(["saveActiveTab"]),
  },
  methods: {
    ...mapMutations(["SET_ActiveTab"]),
    handleChangeTab(name) {
      this.SET_ActiveTab(name);
      let url = "";
      switch (name) {
        case "home":
          url = "/pages/index/index";
          break;
        case "match":
          url = "/pages/match/index";
          break;
        case "mine":
          url = "/pages/mine/index";
          break;
        case "category":
          url = "/pages/category/index";
          break;
        default:
          url = "/pages/index/index";
      }
      uni.redirectTo({
        url: url,
      });
    },
  },
  mounted() {
    this.activeTab = this.saveActiveTab;
  },
};
</script>