import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  userInfo: null,
  token: null,
  isLogin: false,
  expiresAt: null,
  saveActiveTab: "home"
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    state.isLogin = !!userInfo
    // 持久化存储
    uni.setStorageSync('userInfo', userInfo)
  },

  SET_TOKEN(state, token) {
    state.token = token
    uni.setStorageSync('token', token)
  },

  LOGOUT(state) {
    state.userInfo = null
    state.token = null
    state.isLogin = false
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
  },
  SET_ExpiresAt(state, expiresAt) {
    state.expiresAt = expiresAt;
    uni.setStorageSync('expiresAt', expiresAt);
  },
  // 设置Tabbar焦点状态
  SET_ActiveTab(state, tabName) {
    state.saveActiveTab = tabName;
  }
}

const actions = {
  // 检查登录状态
  checkLogin({ commit }) {
    const userInfo = uni.getStorageSync('userInfo')
    const token = uni.getStorageSync('token')
    // 检查token是否过期
    const expiresAt = uni.getStorageSync('expiresAt');
    const now = Date.now();
    if (expiresAt && now > expiresAt) {
      // token已过期，执行登出操作
      commit('LOGOUT');
      return false;
    }
    if (userInfo && token) {
      commit('SET_USER_INFO', userInfo)
      commit('SET_TOKEN', token)
      return true
    }
    return false
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})