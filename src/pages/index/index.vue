<template>
  <view class="page">
    <view class="home-page">
      <!-- 顶部标题栏 -->
      <header class="top-header">
        <h1 class="title">台球计分助手</h1>
        <p class="subtitle">POCKET SCORE</p>
      </header>

      <!-- 快速开始区域 -->
      <view class="quick-start">
        <view class="start-card">
          <!-- <img src="@/assets/images/8ball.png" alt="黑八" class="ball-icon" /> -->
          <view class="start-text">
            <text class="main-text">快速开始</text>
            <text class="sub-text">新比赛</text>
          </view>
          <u-button size="small" class="color-tag" @click="handleOpenNewGame"
            >立即开始</u-button
          >
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="function-section">
        <h2 class="section-title">功能入口</h2>
        <view class="func-cards">
          <view class="func-card" @click="toStatistics">
            <u-icon name="order" color="#0A3D2E" size="32"></u-icon>
            <text class="func-name">数据统计</text>
          </view>
          <view class="func-card" @click="toPlayerManage">
            <u-icon name="man-add-fill" color="#0A3D2E" size="32"></u-icon>
            <text class="func-name">球员管理</text>
          </view>
        </view>
      </view>

      <!-- 最近比赛 -->
      <view class="match-section">
        <h2 class="section-title">最近比赛</h2>
        <view
          v-for="item in recentMatch"
          :key="item.id"
          class="match-card"
          @click="toMatchDetail"
        >
          <view class="match-info">
            <text class="player-score"
              >{{ item.playerA }}<text class="vs"> VS</text>
              {{ item.playerB }}</text
            >
            <text class="match-date">{{ item.date }}</text>
          </view>
          <view class="match-detail">
            <text class="match-time"
              >{{ item.scoreA }} : {{ item.scoreB }}</text
            >
            <view class="match-type">
              <text class="type">{{ item.type }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部TabBar -->
    <Tabbar :tabbarData="tabbarData" />
  </view>
</template>

	<script>
import Tabbar from "@/components/tabbar/index.vue"; // 引入底部TabBar组件
export default {
  name: "BilliardHome",
  components: { Tabbar },
  data() {
    return {
      // 模拟最近比赛数据
      recentMatch: [
        {
          playerA: "张三",
          scoreA: 3,
          playerB: "李四",
          scoreB: 2,
          date: "2026/01/06 ",
          time: "15:30",
          type: "中式黑八",
        },
      ],
      tabbarData: [
        { name: "home", text: "首页", icon: "home" },
        { name: "category", text: "战绩", icon: "file-text" },
        { name: "cart", text: "我的", icon: "account" },
      ],
    };
  },
  methods: {
    // 跳转计分页
    toScorePage() {
      //   this.$router.push('/score')
    },
    // 跳转数据统计
    toStatistics() {
      //   this.$router.push('/statistics')
    },
    // 跳转球员管理
    toPlayerManage() {
      //   this.$router.push('/player')
    },
    // 跳转比赛详情
    toMatchDetail() {
      //   this.$router.push('/match-detail')
    },
    // 打开新比赛弹窗
    handleOpenNewGame() {
		uni.navigateTo({
			url: '/pages/newGame/index'
		});
	},
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/theme.less"; // 引入主题色变量
.page {
  min-height: 100vh;
}
.home-page {
  min-height: calc(100vh - 60px);
  background: #f8f8f8;
  box-sizing: border-box;
}

/* 顶部标题栏 */
.top-header {
  background: @primary;
  padding: 40rpx 32rpx;
  text-align: center;
  color: #fff;

  .title {
    font-size: 48rpx;
    font-weight: 600;
    margin: 0 0 8rpx 0;
  }

  .subtitle {
    font-size: 24rpx;
    color: @secondary;
    letter-spacing: 4rpx;
    margin: 0;
  }
}

/* 快速开始区域 */
.quick-start {
  padding: 0 32rpx;
  margin-top: -40rpx;

  .start-card {
    background: @primary;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    border: 4rpx solid @secondary;
    box-shadow: 0 8rpx 24rpx rgba(10, 61, 46, 0.15);

    .ball-icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 24rpx;
    }

    .start-text {
      flex: 1;

      .main-text {
        font-size: 36rpx;
        color: #fff;
        font-weight: 500;
        display: block;
      }

      .sub-text {
        font-size: 24rpx;
        color: #eee;
        margin-top: 4rpx;
      }
    }

    .color-tag {
      width: 140rpx;
      background: @secondary;
      color: #fff;
      font-size: 24rpx;
      padding: 8rpx 16rpx;
      border-radius: 16rpx;
    }
  }
}

/* 功能入口区域 */
.function-section {
  padding: 0 32rpx;
  margin-top: 60rpx;

  .section-title {
    font-size: 32rpx;
    color: @text-main;
    font-weight: 600;
    margin-bottom: 24rpx;
  }

  .func-cards {
    display: flex;
    gap: 32rpx;

    .func-card {
      flex: 1;
      background: #fff;
      border-radius: 24rpx;
      padding: 48rpx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 8rpx 24rpx rgba(10, 61, 46, 0.1);
      }

      .func-icon {
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 16rpx;
      }

      .func-name {
        font-size: 28rpx;
        color: @text-main;
      }
    }
  }
}

/* 最近比赛区域 */
.match-section {
  padding: 0 32rpx;
  margin-top: 40rpx;

  .section-title {
    font-size: 32rpx;
    color: @text-main;
    font-weight: 600;
    margin-bottom: 24rpx;
  }

  .match-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    cursor: pointer;

    .match-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32rpx;
      padding-bottom: 24rpx;
      border-bottom: 1px solid @border-color;

      .player-score {
        font-size: 32rpx;
        font-weight: 500;
        color: @text-main;
      }
      .vs {
        color: @secondary;
        font-weight: 700;
        margin: 0 8rpx;
      }

      .match-date {
        font-size: 24rpx;
        color: @text-secondary;
      }
    }

    .match-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .match-time {
        font-size: 48rpx;
        font-weight: 600;
        color: @secondary;
      }

      .match-type {
        text-align: right;

        .time {
          font-size: 28rpx;
          color: @text-secondary;
          display: block;
        }

        .type {
          font-size: 24rpx;
          color: @text-secondary;
          margin-top: 4rpx;
        }
      }
    }
  }
}
</style>