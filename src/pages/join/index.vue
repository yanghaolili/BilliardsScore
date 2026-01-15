<template>
  <view class="join-room">
    <u-navbar title="加入房间" :autoBack="true"> </u-navbar>
    <view class="content">
      <view class="input-box">
        <u-code-input v-model="roomNumber" :maxlength="6"></u-code-input>
      </view>

      <u-button
        type="primary"
        :loading="loading"
        @click="joinRoom"
        :disabled="!roomNumber || roomNumber.length !== 6"
      >
        加入房间
      </u-button>

      <u-button
        @click="scanQRCode"
        :customStyle="{ marginTop: '40rpx' }"
        icon="scan"
      >
        扫一扫加入
      </u-button>

      <u-modal :show="showRoomInfo" title="房间信息" :showConfirmButton="false">
        <view class="room-info">
          <view class="creator-info">
            <u-avatar :src="roomData.creatorInfo.avatar"></u-avatar>
            <text class="nickname">{{
              roomData.creatorInfo.nickname || "未知用户"
            }}</text>
          </view>
          <view class="game-info">
            <text
              >游戏类型：{{
                gameTypeMap[roomData.gameType] || "中式八球"
              }}</text
            >
            <view class="game-wating"
              >等待房主开始对局中<text class="loading-dots"></text
            ></view>
          </view>

          <!-- <u-button type="success" @click="confirmJoin" :disabled="isJoined">
          {{ isJoined ? "已加入" : "确认加入" }}
        </u-button> -->
        </view>
      </u-modal>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      roomNumber: "",
      loading: false,
      roomData: null,
      isJoined: false,
      gameTypeMap: {
        chineseEightBall: "中式八球",
        snooker: "斯诺克",
      },
      showRoomInfo: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  onLoad(options) {
    if (options.roomNumber) {
      this.roomNumber = options.roomNumber;
      this.joinRoom();
    }
  },

  methods: {
    // 扫描二维码
    scanQRCode() {
      uni.scanCode({
        success: (res) => {
          // 解析二维码中的roomNumber
          const url = res.result;
          const match = url.match(/roomNumber=(\w+)/);
          if (match) {
            this.roomNumber = match[1];
            this.joinRoom();
          }
        },
      });
    },

    // 搜索房间
    async searchRoom() {
      if (!this.roomNumber || this.roomNumber.length !== 6) {
        return;
      }

      this.loading = true;
      try {
        const db = wx.cloud.database();
        const res = await db
          .collection("rooms")
          .where({
            roomNumber: this.roomNumber,
            status: "waiting",
          })
          .get();
        if (res.data.length === 0) {
          uni.showToast({
            title: "房间不存在或已开始",
            icon: "none",
          });
          this.roomData = null;
        } else {
          this.roomData = res.data[0];
        }
      } catch (error) {
        console.error("搜索房间失败:", error);
        uni.showToast({
          title: "查询失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },
    // 加入房间
    async joinRoom() {
      if (!this.roomData) {
        await this.searchRoom();
      }
      // 检查房间是否已满
      const players = this.roomData.playersInfo.length;
      if (players >= this.roomData.maxPlayers - 1) {
        uni.showToast({
          title: "房间已满",
          icon: "none",
        });
        return;
      }

      // 检查是否是自己创建的房间
      if (this.roomData.creatorId === this.userInfo.userId) {
        uni.showToast({
          title: "不能加入自己创建的房间",
          icon: "none",
        });
        return;
      }

      try {
        const db = wx.cloud.database();

        // 更新房间信息
        await db
          .collection("rooms")
          .doc(this.roomData._id)
          .update({
            data: {
              playersInfo: [
                ...this.roomData.playersInfo,
                {
                  ...this.userInfo,
                },
              ],
              lastUpdate: db.serverDate(),
            },
          });

        uni.showToast({
          title: "加入成功",
        });
        this.showRoomInfo = true;
        // 等待房主开始游戏
        this.listenForGameStart();
      } catch (error) {
        console.error("加入房间失败:", error);
        uni.showToast({
          title: "加入失败",
          icon: "none",
        });
      }
    },

    // 监听游戏开始
    listenForGameStart() {
      const db = wx.cloud.database();

      db.collection("rooms")
        .where({ roomNumber: this.roomData.roomNumber })
        .watch({
          onChange: (snapshot) => {
            if (snapshot.docs.length > 0) {
              const room = snapshot.docs[0];
              if (room.status === "playing") {
                this.showRoomInfo = false;
                // 跳转到对战页面
                uni.redirectTo({
                  url: `/pages/${room.gameType}/index?roomId=${room._id}`,
                });
              }
            }
          },
          onError: (err) => {
            console.error("监听失败:", err);
          },
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.join-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 30rpx;
}
.content {
  margin-top: 200rpx;
  height: 800rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin: 260rpx 0;
  text-align: center;
  .input-box {
    margin-bottom: 40rpx;
  }
}
.creator-info {
  display: flex;
  align-items: center;
}
.nickname {
  margin-left: 16rpx;
}
.game-info {
  color: $text-secondary;
  font-size: 28rpx;
  margin-top: 16rpx;
}
.game-wating {
  margin-top: 12rpx;
}
.loading-dots::after {
  content: "...";
  animation: dotsAnimation 1.5s infinite steps(4, end);
  display: inline-block;
  width: 20px;
  text-align: left;
}

@keyframes dotsAnimation {
  0%,
  20% {
    content: ".";
  }
  40%,
  60% {
    content: "..";
  }
  80%,
  100% {
    content: "...";
  }
}
</style>