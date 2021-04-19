'use strict'
const uniID = require('uni-id')

exports.main = async function(event, context) {
  // console.log(event)
  const {
    action,
    params = {},
    uniIdToken
  } = event
  let res = {
    data: null,
    msg: '查询失败',
    code: 500,
  } // 最后返回信息

  // 校验token
  let payload = {} // token信息
  // 如果不是特定接口都需要token
  const noCheckAction = [
    'register',
    'checkToken',
    'encryptPwd',
    'login',
    'loginByWeixin',
    'sendSmsCode',
    'setVerifyCode',
    'loginBySms',
    'loginByEmail',
    'code2SessionWeixin',
    'code2SessionAlipay',
  ]
  if (noCheckAction.indexOf(action) === -1) {
    if (!uniIdToken) {
      return {
        code: 403,
        msg: '缺少token',
      }
    }
    // 校验token
    payload = await uniID.checkToken(uniIdToken, {
      needPermission: true,
    })
    // 获取token失败处理
    if (payload.code && payload.code > 0) {
      return payload
    }
    params.uid = payload.uid
  }

  // serverless处理
  switch (action) {
    case 'loginByWeixin': {
      const {
        code
      } = params
      res = await uniID.loginByWeixin({
        code,
      })
      break
    }
    case 'setUserInfo': {
      res = await uniID.updateUser(params)
      break
    }
    default:
      res = {
        code: 403,
        msg: '非法访问',
      }
      break
  }
  // 返回数据给客户端
  return res
}
