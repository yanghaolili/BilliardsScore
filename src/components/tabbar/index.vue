<template>
  <u-tabbar
    class="tabbar"
    :placeholder="false"
    :value="activeTab"
    @change="(name) => (activeTab = name)"
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
export default {
  props: {
    tabbarData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: "home",
    };
  },
};
</script>

<style scoped lang="less">
</style>