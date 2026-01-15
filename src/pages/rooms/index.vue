<template>
  <view class="create-room">
    <header class="top-header">
      <u-icon
        name="arrow-left"
        :customStyle="{
          color: '#ffffff',
          position: 'absolute',
          left: '64rpx',
          top: '100rpx',
        }"
        size="28"
        class="top-header-back"
        @click="handleBack"
      ></u-icon>
      <view class="title">创建房间</view>
      <view class="subtitle">CREATE ROOM</view>
    </header>

    <view class="content">
      <view class="room-info">
        <view class="title">房间已创建</view>
        <view class="room-number">{{ roomNumber }}</view>
        <view class="tips">分享房间号给好友</view>

        <view class="qrcode-box">
          <canvas
            id="qrcode"
            canvas-id="qrcode"
            style="width: 200px; height: 200px"
          ></canvas>
        </view>
      </view>
      <view class="join-players">
        <view class="title">已加入玩家 ({{ playerNum }})</view>
        <u-avatar-group :urls="urls" size="35" gap="0.4"></u-avatar-group>
      </view>
      <view class="action-buttons" v-if="roomNumber">
        <u-button type="success" @click="startGame" :disabled="!playerNum">
          开始比赛
        </u-button>
        <u-button type="warning" open-type="share" @click="shareRoom"
          >邀请好友</u-button
        >
      </view>
    </view>
  </view>
</template>

<script>
import UQRCode from "uqrcodejs";
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      roomId: "",
      playerNum: 0,
      roomNumber: null,
      // 监听房间变化
      roomWatcher: null,
      isDrawing: false,
      gameType: "",
      players: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    urls() {
      return this.players.map((player) => player.avatar);
    },
  },
  mounted() {
    // 页面加载时创建房间
    this.createRoom();
  },
  onLoad(options) {
    this.gameType = options.gameType || "chineseEight";
    // 开启分享
    uni.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
  onUnload() {
    // 离开页面时停止监听
    if (this.roomWatcher) {
      this.roomWatcher.close();
    }
  },

  methods: {
    // 生成随机房间号
    generateRoomNumber() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    // 创建房间
    async createRoom() {
      this.loading = true;
      try {
        const db = wx.cloud.database();
        console.log(db);

        const userInfo = this.userInfo;

        // 生成房间号
        let roomNumber = this.generateRoomNumber();
        let isUnique = false;

        // 确保房间号唯一（最多尝试5次）
        for (let i = 0; i < 5; i++) {
          const checkRes = await db
            .collection("rooms")
            .where({ roomNumber })
            .count();
          if (checkRes.total === 0) {
            isUnique = true;
            break;
          }
          roomNumber = this.generateRoomNumber();
        }

        if (!isUnique) {
          uni.showToast({
            title: "创建失败，请重试",
            icon: "none",
          });
          return;
        }
        console.log(userInfo);

        // 创建房间数据
        const roomData = {
          roomNumber,
          creatorId: userInfo.userId,
          creatorInfo: {
            ...userInfo,
          },
          playersInfo: [],
          gameType: this.gameType,
          status: "waiting",
          maxPlayers: this.gameType === "americanNineBall" ? 4 : 2,
          currentPlayer: "creator",
          lastUpdate: db.serverDate(),
          createdAt: db.serverDate(),
        };

        // 保存到数据库
        const res = await db.collection("rooms").add({
          data: roomData,
        });

        this.roomNumber = roomNumber;
        this.roomId = res._id;

        // 生成二维码
        this.generateQRCode(roomNumber);

        // 监听房间变化
        this.watchRoom();

        uni.showToast({
          title: "房间创建成功",
        });
      } catch (error) {
        console.error("创建房间失败:", error);
        uni.showToast({
          title: "创建失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 监听房间变化
    watchRoom() {
      const db = wx.cloud.database();
      const _ = db.command;

      this.roomWatcher = db
        .collection("rooms")
        .where({ _id: this.roomId })
        .watch({
          onChange: (snapshot) => {
            if (snapshot.docs.length > 0) {
              const room = snapshot.docs[0];
              this.playerNum = room.playersInfo.length;
              this.players = room.playersInfo;
              // 如果房间状态变为playing，跳转到对战页面
              if (room.status === "playing") {
                uni.redirectTo({
                  url: `/pages/battle/battle?roomId=${this.roomId}`,
                });
              }
            }
          },
          onError: (err) => {
            console.error("监听失败:", err);
          },
        });
    },
    // 生成二维码
    generateQRCode(text) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = text;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 200;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
    },
    // 分享房间
    shareRoom() {
      uni.showModal({
        title: "分享房间",
        content: `房间号：${this.roomNumber}\n\n请点击右上角"···"分享给好友`,
        showCancel: false,
      });
    },

    onShareAppMessage() {
      return {
        title: `房间号：${this.roomNumber}`,
        path: `/pages/join/index?roomNumber=${this.roomNumber}`,
        imageUrl: "/static/share.jpg", // 可选
      };
    },
    // 开始比赛
    async startGame() {
      if (!this.playerNum) {
        uni.showToast({
          title: "请先邀请对手",
          icon: "none",
        });
        return;
      }

      const db = wx.cloud.database();

      try {
        await db
          .collection("rooms")
          .doc(this.roomId)
          .update({
            data: {
              status: "playing",
              startedAt: db.serverDate(),
              lastUpdate: db.serverDate(),
            },
          });

        uni.showToast({
          title: "比赛开始",
        });

        // 跳转到对战页面
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/${this.gameType}/battle?roomId=${this.roomId}`,
          });
        }, 1500);
      } catch (error) {
        uni.showToast({
          title: "开始失败",
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
.create-room {
  min-height: 100vh;
  background-color: #f5f5f5;
}
/* 顶部标题栏 */
.top-header {
  background: $primary;
  padding: 80rpx 32rpx;
  text-align: center;
  color: #fff;
  position: relative;
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
.content {
  padding: 30rpx;
}

.room-info {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin: 40rpx 0;
  text-align: center;
}

.room-info .title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.room-info .room-number {
  font-size: 64rpx;
  font-weight: bold;
  color: #2979ff;
  letter-spacing: 10rpx;
  margin: 20rpx 0;
}

.room-info .tips {
  font-size: 28rpx;
  color: #999;
  margin: 20rpx 0;
}

.qrcode-box {
  display: flex;
  justify-content: center;
  margin: 40rpx 0;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-buttons .u-button {
  flex: 1;
}
</style>