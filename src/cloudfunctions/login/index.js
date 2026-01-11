const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const usersCollection = db.collection('users')

// 微信登录云函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 1. 获取用户openid
    const { OPENID, APPID, UNIONID } = wxContext
    
    // 2. 查询用户是否存在
    let user = await usersCollection.where({
      openid: OPENID
    }).get()
    
    // 3. 如果用户不存在，创建新用户
    if (user.data.length === 0) {
      const newUser = {
        openid: OPENID,
        unionid: UNIONID,
        userInfo: event.userInfo || {},
        phone: '',
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
        lastLoginAt: db.serverDate(),
        status: 'active'
      }
      
      const result = await usersCollection.add({
        data: newUser
      })
      
      user.data[0] = {
        _id: result._id,
        ...newUser
      }
    } else {
      // 更新最后登录时间
      await usersCollection.doc(user.data[0]._id).update({
        data: {
          lastLoginAt: db.serverDate()
        }
      })
    }
    
    // 4. 生成自定义登录态token
    const token = await cloud.callFunction({
      name: 'generateToken',
      data: {
        openid: OPENID,
        userId: user.data[0]._id
      }
    })
    
    return {
      success: true,
      userInfo: user.data[0],
      token: token.result,
      openid: OPENID
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}