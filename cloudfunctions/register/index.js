const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const bcrypt = require('bcryptjs')

// 生成用户ID
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

exports.main = async (event, context) => {
  const { username, password, nickname, avatar } = event
  
  try {
    // 1. 检查用户名是否已存在
    const checkResult = await db.collection('users')
      .where({
        username: username
      })
      .get()
    
    if (checkResult.data.length > 0) {
      return {
        code: 400,
        message: '用户名已存在'
      }
    }
    
    // 2. 密码加密
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // 3. 生成用户ID
    const userId = generateUserId()
    
    // 4. 创建用户记录
    const userData = {
      _id: userId,
      username: username,
      password: hashedPassword,
      nickname: nickname || username,
      avatar: avatar || '',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
      status: 'active', // active, inactive, banned
      lastLoginAt: null,
      loginCount: 0
    }
    
    // 5. 保存到数据库
    const result = await db.collection('users').add({
      data: userData
    })
    
    // 6. 返回成功响应（不返回密码）
    const userInfo = { ...userData }
    delete userInfo.password
    
    return {
      code: 200,
      message: '注册成功',
      data: {
        ...userInfo
      }
    }
    
  } catch (error) {
    console.error('注册失败:', error)
    return {
      code: 500,
      message: '注册失败，请稍后重试',
      error: error.message
    }
  }
}