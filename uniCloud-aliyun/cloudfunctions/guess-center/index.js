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
  // 打开数据库连接
  const db = uniCloud.database()
  // serverless处理
  switch (action) {
    case 'addGuessItem':
      // res = await uniID.updateUser(params)
      const insertData = db.collection('guess-PTS').add({
        ...params.insertData,
        create_time: new Date(),
      })
      res = {
        msg: '插入成功',
        code: 200,
      } // 最后返回信息

      break

    case 'getGuessList':
      const $ = db.command.aggregate

      const guessList = await db
        .collection('guess-PTS')
        .aggregate()
        .group({
          _id: '$schedule_id',
          schedule_name: $.first('$schedule_name'),
          issues: $.push({
            schedule_id: '$schedule_id',
            schedule_name: '$schedule_name',
            guess_title: '$guess_title',
            guess_type: '$guess_type',
            guess_reward: '$guess_reward',
            create_time: '$create_time',
          }),
        })
        .end()

      console.log('guessList', guessList)
      res = {
        data: guessList.data,
        code: 200,
        msg: '查询成功',
      }
      break

    case 'getGuessIssuesByScheduId':
      const issuesList = await db.collection('guess-PTS').where({
        schedule_id: params.scheduleId
      }).get()

      res = {
        data: issuesList.data,
        code: 200,
        msg: '查询成功',
      }
      break

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
