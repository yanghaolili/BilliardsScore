<template>
  <view class="login-container">
    <!-- 背景图 -->
    <image 
      class="background-image" 
      src="/static/images/login-bg.jpg" 
      mode="aspectFill"
    />
    
    <!-- 登录卡片 -->
    <view class="login-card">
      <!-- 台球主题Logo -->
      <view class="logo-section">
        <image 
          class="logo" 
          src="/static/images/logo.png" 
          mode="aspectFit"
        />
        <text class="app-name">台球大师</text>
        <text class="app-subtitle">专业计分 · 实时对战</text>
      </view>
      
      <!-- 登录表单 -->
      <view class="form-section">
        <!-- 微信一键登录 -->
        <u-button
          type="primary"
          shape="circle"
          size="large"
          icon="weixin-fill"
          icon-color="#fff"
          @click="handleWechatLogin"
          :loading="wechatLoading"
          :customStyle="{ background: '#07C160', color: '#fff', fontSize: '24rpx' }"
          class="wechat-btn"
          v-if="!showPhoneLogin"
        >
          微信一键登录
        </u-button>
        
        <!-- 手机号登录 -->
        <view class="phone-login-section" v-if="showPhoneLogin">
          <u-line color="#e4e7ed" v-if="!showPhoneLogin"/>
          <view class="phone-title" v-if="!showPhoneLogin">或使用手机号登录</view>
          
          <u-form labelPosition="top" labelWidth="150px" :model="formData" ref="uForm" class="phone-form">
            <u-form-item label="手机号" prop="phone" borderBottom>
              <u-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                type="number"
                border="none"
              />
            </u-form-item>
            
            <u-form-item label="验证码" prop="code" borderBottom>
              <u-input
                v-model="formData.code"
                placeholder="请输入验证码"
                border="none"
              />
              <template #right>
                <u-button
                  size="mini"
                  @click="getSmsCode"
                  :disabled="codeTimer > 0"
                  type="primary"
                  plain
                >
                  {{ codeTimer > 0 ? `${codeTimer}s后重试` : '获取验证码' }}
                </u-button>
              </template>
            </u-form-item>
          </u-form>
          
          <u-button
            type="primary"
            shape="circle"
            @click="handlePhoneLogin"
            :loading="phoneLoading"
            class="phone-login-btn"
          >
            手机号登录
          </u-button>
        </view>
        
        <!-- 切换登录方式 -->
        <view class="switch-login-type" @click="showPhoneLogin = !showPhoneLogin">
          <text>{{ showPhoneLogin ? '返回微信登录' : '使用手机号登录' }}</text>
          <u-icon name="arrow-right" size="14"></u-icon>
        </view>
        
        <!-- 用户协议 -->
        <view class="agreement">
          <checkbox-group @change="handleAgreementChange">
            <label class="agreement-label">
              <checkbox :checked="agreed" />
              我已阅读并同意
              <text class="agreement-link" @click.stop="showAgreement('user')">《用户协议》</text>
              和
              <text class="agreement-link" @click.stop="showAgreement('privacy')">《隐私政策》</text>
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
import { mapMutations } from 'vuex'
import { loginByWechat, loginByPhone, sendSmsCode } from '@/common/api.js'

export default {
  data() {
    return {
      // 登录方式
      showPhoneLogin: false,
      wechatLoading: false,
      phoneLoading: false,
      
      // 表单数据
      formData: {
        phone: '',
        code: ''
      },
      
      // 表单验证规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              return /^1[3-9]\d{9}$/.test(value)
            },
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              return /^\d{6}$/.test(value)
            },
            message: '验证码为6位数字',
            trigger: 'blur'
          }
        ]
      },
      
      // 验证码倒计时
      codeTimer: 0,
      timer: null,
      
      // 用户协议
      agreed: false,
      showAgreementModal: false,
      agreementTitle: '',
      agreementContent: ''
    }
  },
  
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  
  methods: {
    ...mapMutations(['SET_USER_INFO', 'SET_TOKEN']),
    
    // 微信登录
    async handleWechatLogin() {
      console.log(this.$refs.uToast);
      
      if (!this.agreed) {
        this.$refs.uToast.show({
          message: '请先阅读并同意用户协议',
          type: 'warning'
        })
        return
      }
      
      this.wechatLoading = true
      
      try {
        // 微信登录获取code
        const { code } = await uni.login({
          provider: 'weixin'
        })
        
        // 调用云函数登录
        const result = await loginByWechat(code)
        
        if (result.success) {
          // 保存用户信息到store
          this.SET_USER_INFO(result.userInfo)
          this.SET_TOKEN(result.token)
          
          // 登录成功跳转
          uni.switchTab({
            url: '/pages/home/home'
          })
          
          this.$refs.uToast.show({
            message: '登录成功',
            type: 'success'
          })
        } else {
          throw new Error(result.message || '登录失败')
        }
      } catch (error) {
        console.error('微信登录失败:', error)
        this.$refs.uToast.show({
          message: error.message || '登录失败，请重试',
          type: 'error'
        })
      } finally {
        this.wechatLoading = false
      }
    },
    
    // 获取短信验证码
    async getSmsCode() {
      if (!this.formData.phone) {
        this.$refs.uToast.show({
          message: '请输入手机号',
          type: 'warning'
        })
        return
      }
      
      try {
        await sendSmsCode({ phone: this.formData.phone })
        
        // 开始倒计时
        this.codeTimer = 60
        this.timer = setInterval(() => {
          if (this.codeTimer > 0) {
            this.codeTimer--
          } else {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
        
        this.$refs.uToast.show({
          message: '验证码已发送',
          type: 'success'
        })
      } catch (error) {
        this.$refs.uToast.show({
          message: error.message || '验证码发送失败',
          type: 'error'
        })
      }
    },
    
    // 手机号登录
    async handlePhoneLogin() {
      this.$refs.uForm.setRules(this.rules)
      // 表单验证
      const valid = await this.$refs.uForm.validate()
      if (!valid) return
      
      if (!this.agreed) {
        this.$refs.uToast.show({
          message: '请先阅读并同意用户协议',
          type: 'warning'
        })
        return
      }
      
      this.phoneLoading = true
      
      try {
        const result = await loginByPhone(this.formData)
        
        if (result.success) {
          this.SET_USER_INFO(result.userInfo)
          this.SET_TOKEN(result.token)
          
          uni.switchTab({
            url: '/pages/home/home'
          })
          
          this.$refs.uToast.show({
            title: '登录成功',
            type: 'success'
          })
        }
      } catch (error) {
        this.$refs.uToast.show({
          message: error.message || '登录失败',
          type: 'error'
        })
      } finally {
        this.phoneLoading = false
      }
    },
    
    // 用户协议处理
    handleAgreementChange(e) {
      this.agreed = e.detail.value.length > 0
    },
    
    showAgreement(type) {
      this.agreementTitle = type === 'user' ? '用户协议' : '隐私政策'
      this.agreementContent = type === 'user' 
        ? '这里是用户协议内容...' 
        : '这里是隐私政策内容...'
      this.showAgreementModal = true
    },
    
    confirmAgreement() {
      this.agreed = true
      this.showAgreementModal = false
    }
  }
}
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
        background: #07C160;
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
          margin-top: 20rpx;
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