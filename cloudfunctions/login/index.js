const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const bcrypt = require('bcryptjs')

// 生成登录令牌
function generateToken(userId) {
  // 这里可以使用JWT或其他方式生成token
  // 简单示例：userId + 时间戳 + 随机字符串
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substr(2, 10)
  return `${userId}_${timestamp}_${randomStr}`
}

exports.main = async (event, context) => {
  const { username, password } = event
  
  try {
    // 1. 查找用户
    const userResult = await db.collection('users')
      .where({
        username: username,
        status: 'active'  // 只允许活跃用户登录
      })
      .get()
    
    if (userResult.data.length === 0) {
      return {
        code: 401,
        message: '用户名或密码错误'
      }
    }
    
    const user = userResult.data[0]
    
    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return {
        code: 401,
        message: '用户名或密码错误'
      }
    }
    
    // 3. 生成登录令牌
    const token = generateToken(user._id)
    const tokenExpireAt = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天后过期
    
    // 5. 更新用户登录信息
    await db.collection('users')
      .doc(user._id)
      .update({
        data: {
          lastLoginAt: db.serverDate(),
          loginCount: (user.loginCount || 0) + 1,
          updatedAt: db.serverDate()
        }
      })
    
    // 6. 准备返回的用户信息（不包含敏感信息）
    const userInfo = {
      userId: user._id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
      loginCount: user.loginCount
    }
    
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: token,
        userInfo: userInfo,
        expiresAt: tokenExpireAt
      }
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    return {
      code: 500,
      message: '登录失败，请稍后重试',
      error: error.message
    }
  }
}