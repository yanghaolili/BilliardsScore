<template>
  <view class="page">
    <view class="home-page">
      <!-- 顶部标题栏 -->
      <header class="top-header">
        <view class="title">个人中心</view>
        <view class="subtitle">PERSON CENTER </view>
      </header>

      <!-- 用户信息区域 -->
      <view class="user-info">
        <view class="avatar">
          <u-avatar :src="userInfo.avatar" shape="square" size="64"></u-avatar>
        </view>
        <view class="user-details">
          <view class="user-info">
            <text class="username">{{ userInfo.nickname }}</text>
            <text class="user-id">ID: {{ userInfo.username }}</text>
          </view>
          <u-tag
            class="user-level"
            :customStyle="{ margin: '32rpx' }"
            :text="`LV.${userInfo.level || 1} 初入茅庐`"
            type="warning"
          ></u-tag>
        </view>
      </view>
      <view class="user-line"></view>
      <!-- 用户操作 -->
      <view class="user-operate"></view>
      <!-- 退出登录按钮 -->
      <view class="logout-btn">
        <u-button
          type="error"
          :customStyle="{ width: '80%', borderRadius: '16rpx' }"
          @click="handleLogout"
          >退出登录</u-button
        >
      </view>
    </view>
    <!-- 底部TabBar -->
    <Tabbar />
  </view>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return (
        this.$store.state.userInfo || {
          name: "游客",
          avatar: "",
        }
      );
    },
  },
  methods: {
    ...mapMutations(["LOGOUT"]),
    handleLogout() {
      this.LOGOUT();
      uni.navigateTo({
        url: "/pages/login/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
}
.home-page {
  min-height: calc(100vh - 60px);
  background: #f8f8f8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
/* 顶部标题栏 */
.top-header {
  background: $primary;
  padding: 80rpx 32rpx;
  text-align: center;
  color: #fff;

  .title {
    font-size: 48rpx;
    font-weight: 600;
    margin: 0 0 8rpx 0;
  }

  .subtitle {
    font-size: 24rpx;
    color: $secondary;
    letter-spacing: 4rpx;
    margin: 0;
  }
}
.user-info {
  padding: 80rpx 32rpx;
  display: flex;
}
// .user-level {
//   /deep/ .u-transition {
//     margin: 32rpx;
//   }
// }
.user-details {
  margin-left: 24rpx;
  display: flex;
  flex: 1;
  .user-info {
    display: flex;
    flex-direction: column;
    padding: 0;
    flex: 1;
  }
  .user-id {
    color: $text-secondary;
  }
  .username {
    font-size: 32rpx;
    font-weight: 500;
    margin-bottom: 12rpx;
  }
}
.user-line {
  height: 16rpx;
  background: #e0e0e0;
}
.user-operate {
  flex: 1;
}
.logout-btn {
  display: flex;
  align-items: center;
  margin-top: auto;
  margin-bottom: 48rpx;
}
</style>