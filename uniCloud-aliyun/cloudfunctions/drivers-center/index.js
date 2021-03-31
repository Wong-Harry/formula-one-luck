'use strict'
const uniID = require('uni-id')

exports.main = async (event, context) => {
  console.log(event)
  const { action, params = {}, uniIdToken } = event
  let res = {} // 最后返回信息

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
  const db = uniCloud.database()
  switch (action) {
    // 获取车手积分列表-带分站搜索
    case 'getDirversPTS':
      const { searchInfo } = params
      // 查询车手和车队信息
      const dirvers = await db
        .collection('drivers')
        .aggregate()
        .lookup({
          from: 'teams',
          localField: 'dirver_team_id',
          foreignField: '_id',
          as: 'teamInfo',
        })
        .end()
      // 查询车手积分信息
      const $ = db.command.aggregate
      const ptsInfo = await db
        .collection('schedulePTS')
        .aggregate()
        .match({
          ...searchInfo,
        })
        .group({
          _id: '$dirver_id',
          PTSSum: $.sum('$PTS'),
          scheduleInfo: $.push({
            dirver_id: '$dirver_id',
            team_id: '$team_id',
            race_id: '$race_id',
            PTS: '$PTS',
          }),
        })
        .end()
      // 合并两个集合
      const dirversLength = dirvers.data.length
      const ptsInfoLength = ptsInfo.data.length
      for (let index = 0; index < dirversLength; index++) {
        const dirversElement = dirvers.data[index]
        for (let index = 0; index < ptsInfoLength; index++) {
          const { _id, PTSSum, scheduleInfo } = ptsInfo.data[index]
          if (_id === dirversElement._id) {
            dirversElement['PTSSum'] = PTSSum
            dirversElement['scheduleInfo'] = scheduleInfo
          }
        }
      }
      // 结果排序
      dirvers.data = dirvers.data.sort((a, b) => b.PTSSum - a.PTSSum)
      res = dirvers
      break
    // 获取车队积分列表
    case 'getTeamsPTS':
      const teams = db.collection('teams').aggregate().lookup({
        from: 'schedulePTS',
        localField: '_id',
        foreignField: 'team_id',
        as: 'PTS',
      }).end()
      res = teams
      break
    // 获取分站列表
    case 'getScheduleList':
      res = db.collection('schedule').get()
      break
    //   // 添加分站
    // case 'addSchedule':
    //   const {
    //     addData
    //   } = params
    //   res = await db.collection('schedule').add(addData)
    //   break
    //   // 设置分站积分
    // case 'setSchedulePTS':
    //   const {
    //     PTSInfo
    //   } = params
    //   res = await db.collection('schedulePTS').add(PTSInfo)
    //   break
    // 非法访问
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
