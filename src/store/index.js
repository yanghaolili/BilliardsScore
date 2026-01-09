const state = {
  userInfo: null,
  token: null,
  isLogin: false
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
  }
}

const actions = {
  // 检查登录状态
  checkLogin({ commit }) {
    const userInfo = uni.getStorageSync('userInfo')
    const token = uni.getStorageSync('token')
    
    if (userInfo && token) {
      commit('SET_USER_INFO', userInfo)
      commit('SET_TOKEN', token)
      return true
    }
    return false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}