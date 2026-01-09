// 云函数调用封装
const callCloudFunction = async (name, data) => {
  try {
    const result = await uniCloud.callFunction({
      name,
      data
    })
    
    if (result.result.success === false) {
      throw new Error(result.result.message)
    }
    
    return result.result
  } catch (error) {
    console.error(`调用云函数${name}失败:`, error)
    throw error
  }
}

// 微信登录
export const loginByWechat = (code, userInfo) => {
  return callCloudFunction('login', {
    code,
    userInfo
  })
}

// 手机号登录
export const loginByPhone = ({ phone, code }) => {
  return callCloudFunction('loginByPhone', {
    phone,
    code
  })
}

// 发送短信验证码
export const sendSmsCode = ({ phone }) => {
  return callCloudFunction('sendSmsCode', {
    phone
  })
}

// 检查登录状态
export const checkLoginStatus = () => {
  return callCloudFunction('checkLoginStatus', {})
}

// 退出登录
export const logout = () => {
  return callCloudFunction('logout', {})
}