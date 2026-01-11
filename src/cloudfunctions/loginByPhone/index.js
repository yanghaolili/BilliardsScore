const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const usersCollection = db.collection('users')

// 短信验证码验证（这里需要配合短信服务）
exports.main = async (event, context) => {
  const { phone, code } = event
  
  try {
    // 1. 验证短信验证码（实际开发中需要对接短信服务商）
    const verifyResult = await verifySmsCode(phone, code)
    
    if (!verifyResult.success) {
      return {
        success: false,
        message: '验证码错误或已过期'
      }
    }
    
    // 2. 查找或创建用户
    let user = await usersCollection.where({
      phone: phone
    }).get()
    
    const wxContext = cloud.getWXContext()
    
    if (user.data.length === 0) {
      // 新用户注册
      const newUser = {
        phone: phone,
        openid: wxContext.OPENID,
        userInfo: {},
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
        status: 'active'
      }
      
      const result = await usersCollection.add({
        data: newUser
      })
      
      user.data[0] = {
        _id: result._id,
        ...newUser
      }
    }
    
    // 3. 生成token
    const token = await cloud.callFunction({
      name: 'generateToken',
      data: {
        userId: user.data[0]._id
      }
    })
    
    return {
      success: true,
      userInfo: user.data[0],
      token: token.result
    }
    
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

// 验证短信验证码函数
async function verifySmsCode(phone, code) {
  // 这里实际应该查询数据库中的验证码记录
  // 简化实现，实际开发中需要存储验证码并设置过期时间
  return { success: true }
}