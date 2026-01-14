<template>
  <view class="page">
    <view class="new-game-page">
      <!-- 顶部标题栏 -->
      <header class="top-header">
        <h1 class="title">选择模式</h1>
        <p class="subtitle">CHOOSE MODE</p>
      </header>
      <view class="mode">
        <view
          v-for="item in modeList"
          :key="item.ename"
          @click="handleChooseMode(item.key)"
          class="mode-item"
        >
          <view class="mode-item-title">{{ item.title }}</view>
          <view class="mode-item-enTitle">{{ item.enTitle }}</view>
          <view class="mode-item-rule">{{ item.rule }}</view>
        </view>
      </view>
      <view class="operate">
        <u-button
          type="primary"
          color="#2D2D2D"
          text="返回"
          @click="handleBack"
        ></u-button>
      </view>
    </view>
    <!-- 底部TabBar -->
    <Tabbar />
  </view>
</template>

<script>
import Tabbar from "@/components/tabbar/index.vue"; // 引入底部TabBar组件
export default {
  name: "BilliardNewGame",
  components: { Tabbar },
  data() {
    return {
      modeList: [
        {
          key: "chineseEightBall",
          title: "中式八球",
          enTitle: "Chinese Eight-ball",
          rule: "共15颗目标球，分全色和花色，先打完自己的一组球，再打进黑八获胜...",
        },
        {
          key: "americanNineBall",
          title: "激情追分",
          enTitle: "Passionate Score Chase",
          rule: "多人竞技，按进球数累计分数，失误扣分，规定局数后分数最高者胜出...",
        },
        {
          key: "snooker",
          title: "斯诺克",
          enTitle: "Snooker",
          rule: "22颗球，先打红球再打彩球，红球落袋得分，彩球落袋需取出，清台后比分高者胜...",
        },
      ],
    };
  },
  methods: {
    handleChooseMode(modeKey) {
      // uni.navigateTo({
      //   url: "/pages/player/index",
      // });
      if(modeKey !== 'chineseEightBall') {
        uni.showToast({
          title: "该模式正在开发中，敬请期待！",
          icon: "none",
        });
      }
    },
    handleBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
}
.new-game-page {
  min-height: calc(100vh - 120rpx);
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
/* 模式列表 */
.mode {
  padding: 40rpx 32rpx;
  margin-top: 24rpx;
  .mode-item {
    background: #fff;
    border-radius: 20rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    box-sizing: border-box;
    width: 100%;
    border: 4rpx solid transparent;
    .mode-item-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }
    .mode-item-enTitle {
      font-size: 24rpx;
      color: $secondary;
      margin-bottom: 16rpx;
    }
    .mode-item-rule {
      font-size: 24rpx;
      color: #666;
      line-height: 1.5;
    }
    &:active {
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
      transform: scale(0.98);
      border-color: #e0e0e0;
      background: linear-gradient(180deg, #e0e0e0 0%, #ffffff 100%);
    }
  }
}
.operate {
  padding: 40rpx 32rpx;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  background: #f8f8f8;
  margin-top: auto;
}
</style>