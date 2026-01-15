<template>
  <view class="login-container">
    <!-- 背景图 -->
    <!-- <image 
      class="background-image" 
      src="/static/images/login-bg.jpg" 
      mode="aspectFill"
    /> -->

    <!-- 登录卡片 -->
    <view class="login-card">
      <!-- 台球主题Logo -->
      <view class="logo-section">
        <!-- <image 
          class="logo" 
          src="/static/images/logo.png" 
          mode="aspectFit"
        /> -->
        <text class="app-name">台球大师</text>
        <text class="app-subtitle">专业计分 · 实时对战</text>
      </view>

      <!-- 登录表单 -->
      <view class="form-section">
        <!-- 账号密码 -->
        <view class="phone-login-section">
          <u-form
            labelPosition="top"
            labelWidth="150px"
            :model="loginFormData"
            ref="loginForm"
            class="phone-form"
            v-if="!isRegister"
          >
            <u-form-item label="账号" prop="username" borderBottom>
              <u-input
                v-model="loginFormData.username"
                placeholder="请输入账号"
                border="none"
              />
            </u-form-item>

            <u-form-item label="密码" prop="password" borderBottom>
              <u-input
                v-model="loginFormData.password"
                placeholder="请输入密码"
                border="none"
                password
              />
            </u-form-item>
          </u-form>
          <u-form
            labelPosition="top"
            labelWidth="150px"
            :model="registerFormData"
            ref="registerForm"
            class="phone-form"
            v-else
          >
            <u-form-item label="账号" prop="username" borderBottom>
              <u-input
                v-model="registerFormData.username"
                placeholder="请输入账号"
                border="none"
              />
            </u-form-item>

            <u-form-item label="昵称" prop="nickname" borderBottom>
              <u-input
                v-model="registerFormData.nickname"
                placeholder="请输入昵称"
                border="none"
              />
            </u-form-item>

            <u-form-item label="密码" prop="password" borderBottom>
              <u-input
                v-model="registerFormData.password"
                placeholder="请输入密码"
                border="none"
                password
              />
            </u-form-item>
            <u-form-item label="确认密码" prop="confirmPassword">
              <u-input
                v-model="registerFormData.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                border="none"
                password
              />
            </u-form-item>
          </u-form>
          <!-- 登录页按钮组 -->
          <view v-if="!isRegister">
            <u-button
              type="primary"
              shape="circle"
              @click="handleLogin"
              :loading="loginLoading"
              :customStyle="{
                marginTop: '40rpx',
                marginBottom: '20rpx',
                background: '#2979ff',
              }"
            >
              登录
            </u-button>
            <u-button
              type="warning"
              shape="circle"
              :hairline="false"
              @click="handleRegister"
              :loading="registerLoading"
              :customStyle="{ marginBottom: '20rpx', background: '#D4AF37' }"
            >
              注册
            </u-button>
          </view>
          <!-- 注册页按钮组 -->
          <view v-else>
            <u-button
              type="primary"
              shape="circle"
              @click="handleRegisterSubmit"
              :loading="registerLoading"
              :customStyle="{
                marginTop: '40rpx',
                marginBottom: '20rpx',
                background: '#2979ff',
              }"
            >
              注册
            </u-button>
            <u-button
              type="default"
              shape="circle"
              :hairline="false"
              @click="handleBackToLogin"
              :customStyle="{ marginBottom: '20rpx' }"
            >
              返回登录
            </u-button>
          </view>
        </view>

        <!-- 用户协议 -->
        <view class="agreement" v-if="!isRegister">
          <checkbox-group @change="handleAgreementChange">
            <label class="agreement-label">
              <checkbox :checked="agreed" />
              我已阅读并同意
              <text class="agreement-link" @click.stop="showAgreement('user')"
                >《用户协议》</text
              >
              和
              <text
                class="agreement-link"
                @click.stop="showAgreement('privacy')"
                >《隐私政策》</text
              >
            </label>
          </checkbox-group>
        </view>
      </view>
    </view>

    <!-- 加载提示 -->
    <u-toast ref="uToast"></u-toast>

    <!-- 用户协议弹窗 -->
    <u-modal
      v-model="showAgreementModal"
      :title="agreementTitle"
      :content="agreementContent"
      showCancelButton
      confirmText="同意"
      cancelText="取消"
      @confirm="confirmAgreement"
    ></u-modal>
  </view>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      // 登录方式
      registerLoading: false,
      loginLoading: false,
      // 表单数据
      loginFormData: {
        username: "",
        password: "",
      },
      registerFormData: {
        username: "",
        nickname: "",
        password: "",
        confirmPassword: "",
      },

      // 表单验证规则
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      //注册表单验证规则
      registerRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 20, message: "账号长度3-20个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度6-20个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.registerFormData.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      // 用户协议
      agreed: false,
      showAgreementModal: false,
      agreementTitle: "",
      agreementContent: "",
      isRegister: false,
    };
  },
  watch: {
    isRegister: {
      handler() {
        this.$nextTick(() => {
          if (!this.isRegister) {
            this.$refs.loginForm.setRules(this.loginRules);
          } else {
            this.$refs.registerForm.setRules(this.registerRules);
          }
        });
      },
      immediate: true,
    },
  },

  methods: {
    ...mapMutations([
      "SET_USER_INFO",
      "SET_TOKEN",
      "SET_ExpiresAt",
      "SET_ActiveTab",
    ]),

    // 用户协议处理
    handleAgreementChange(e) {
      this.agreed = e.detail.value.length > 0;
    },

    showAgreement(type) {
      this.agreementTitle = type === "user" ? "用户协议" : "隐私政策";
      this.agreementContent =
        type === "user" ? "这里是用户协议内容..." : "这里是隐私政策内容...";
      this.showAgreementModal = true;
    },

    confirmAgreement() {
      this.agreed = true;
      this.showAgreementModal = false;
    },
    // 注册
    handleRegister() {
      this.isRegister = true;
      this.$nextTick(() => {
        this.$refs.registerForm.setRules(this.registerRules);
      });
    },
    //注册
    async handleRegisterSubmit() {
      const valid = await this.$refs.registerForm.validate();

      if (!valid) {
        return;
      }
      try {
        // 调用云函数
        this.registerLoading = true;
        const { username, nickname, password } = this.registerFormData;
        const result = await wx.cloud.callFunction({
          name: "register",
          data: {
            username,
            password,
            nickname,
            avatar: "",
          },
        });
        this.registerLoading = false;
        if (result.result.code === 200) {
          uni.showToast({
            title: "注册成功",
            icon: "success",
          });

          // 自动登录或跳转到登录页面
          setTimeout(() => {
            this.isRegister = false;
            this.registerFormData = {
              username: "",
              nickname: "",
              password: "",
              confirmPassword: "",
            };
            this.loginFormData = {
              username: username || "",
              password: "",
            };
          }, 1000);
        } else {
          uni.showToast({
            title: result.result.message,
            icon: "none",
          });
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: "注册失败",
          icon: "none",
        });
        console.error("注册错误:", error);
      }
    },
    // 返回登录
    handleBackToLogin() {
      this.isRegister = false;
      this.registerFormData = {
        username: "",
        nickname: "",
        password: "",
        confirmPassword: "",
      };
      this.$set(this.loginFormData, {
        username: "",
        password: "",
      });
      this.$nextTick(() => {
        this.$refs.loginForm.setRules(this.loginRules);
      });
    },
    // 登录
    async handleLogin() {
      const valid = await this.$refs.loginForm.validate();
      if (!valid) return;
      if (!this.agreed) {
        uni.showToast({
          title: "请同意用户协议和隐私政策",
          icon: "none",
        });
        return;
      }
      const { username, password } = this.loginFormData;
      this.loginLoading = true;
      const result = await wx.cloud.callFunction({
        name: "login",
        data: {
          username,
          password,
        },
      });
      this.loginLoading = false;
      if (result.result.code === 200) {
        uni.showToast({
          title: "登录成功",
          icon: "success",
        });
        const { token, userInfo, expiresAt } = result.result.data;
        this.SET_TOKEN(token);
        this.SET_USER_INFO(userInfo);
        this.SET_ExpiresAt(expiresAt);
        // 跳转首页
        setTimeout(() => {
          uni.redirectTo({
            url: "/pages/index/index",
          });
        }, 1000);
      } else {
        uni.showToast({
          title: result.result.message,
          icon: "none",
        });
      }
    },
  },
  onShow: function () {
    this.SET_ActiveTab("home");
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  position: relative;

  .background-image {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: brightness(0.7);
  }

  .login-card {
    position: relative;
    margin: 200rpx 40rpx 0;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 30rpx;
    padding: 60rpx 40rpx;
    // box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);

    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 60rpx;

      .logo {
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 20rpx;
      }

      .app-name {
        font-size: 48rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }

      .app-subtitle {
        font-size: 24rpx;
        color: #666;
      }
    }

    .form-section {
      .wechat-btn {
        background: #07c160;
        margin-bottom: 40rpx;
      }

      .phone-login-section {
        .phone-title {
          text-align: center;
          color: #999;
          font-size: 28rpx;
          margin: 30rpx 0;
        }

        .phone-form {
          margin-bottom: 40rpx;
        }

        .phone-login-btn {
          margin-top: 40rpx;
        }
      }

      .switch-login-type {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2979ff;
        font-size: 28rpx;
        margin: 40rpx 0;

        text {
          margin-right: 10rpx;
        }
      }

      .agreement {
        text-align: center;
        font-size: 24rpx;
        color: #999;

        .agreement-label {
          display: flex;
          align-items: center;
          justify-content: center;

          checkbox {
            margin-right: 10rpx;
          }
        }

        .agreement-link {
          color: #2979ff;
        }
      }
    }
  }
}
</style>