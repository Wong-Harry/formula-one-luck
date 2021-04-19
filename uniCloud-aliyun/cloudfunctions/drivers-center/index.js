'use strict'
const uniID = require('uni-id')

exports.main = async (event, context) => {
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
  const db = uniCloud.database()

  switch (action) {
    // 获取车手积分列表
    case 'getDirversPTS':
      const {
        searchInfo
      } = params
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
          const {
            _id,
            PTSSum,
            scheduleInfo
          } = ptsInfo.data[index]
          if (_id === dirversElement._id) {
            dirversElement['PTSSum'] = PTSSum
            dirversElement['scheduleInfo'] = scheduleInfo
          }
        }
      }
      // 结果排序
      dirvers.data = dirvers.data.sort((a, b) => b.PTSSum - a.PTSSum)
      res = {
        msg: '查询成功',
        data: dirvers.data,
        code: 200,
      }
      break

      // 获取车队积分列表
    case 'getTeamsPTS':
      console.log('params', params);
      // const {
      //   searchInfo
      // } = params
      // 聚合车队参与的分站比赛
      const teams = await db
        .collection('teams')
        .aggregate()
        .match({
          ...params.searchInfo
        })
        .lookup({
          from: 'schedulePTS',
          localField: '_id',
          foreignField: 'team_id',
          as: 'PTS',
        })
        .end()
      // 统计车队参与的分站比赛总分 与 查询车手信息
      for (let i = 0; i < teams.data.length; i++) {
        // 统计车队参与的分站比赛总分
        teams.data[i].team_deiver_name = []
        for (let n = 0; n < teams.data[i].team_dirver_id.length; n++) {
          const dirverId = teams.data[i].team_dirver_id[n]
          const {
            result
          } = await uniCloud.callFunction({
            name: 'drivers-center',
            data: {
              action: 'getDirverById',
              uniIdToken,
              params: {
                id: dirverId,
              },
            },
          })
          teams.data[i].team_deiver_name.push(result.data)
        }
        // 查询车手信息
        teams.data[i].PTSSum = 0
        for (let m = 0; m < teams.data[i].PTS.length; m++) {
          teams.data[i].PTSSum += teams.data[i].PTS[m].PTS
        }
      }

      res = {
        msg: '查询成功',
        data: teams.data,
        code: 200,
      }
      break

      // 根据车手id查询车手信息
    case 'getDirverById':
      const {
        id
      } = params
      const dirverInfo = await db
        .collection('drivers')
        .where({
          _id: id,
        })
        .get()
      res = {
        msg: '查询成功',
        data: dirverInfo.data[0],
        code: 200,
      }
      break

      // 根据车手id查询分站信息
    case 'getDirverScheduleList':
      // 获取积分信息
      const {
        data: schedulePtsList
      } = await db
        .collection('schedulePTS')
        .where({
          ...params.searchInfo,
        })
        .get()
      // 获取分站信息
      for (let i = 0; i < schedulePtsList.length; i++) {
        const element = schedulePtsList[i]

        const {
          result
        } = await uniCloud.callFunction({
          name: 'drivers-center',
          data: {
            action: 'getScheduleList',
            uniIdToken: uniIdToken,
            params: {
              searchInfo: {
                _id: element.race_id,
              },
            },
          },
        })
        console.log('scheduInfo', result);
        element.scheduleInfo = result.data
      }

      res = {
        msg: '查询成功',
        data: schedulePtsList,
        code: 200,
      }
      break
      // 根据分站id获取分站列表
    case 'getScheduleList':
      const scheduleList = await db
        .collection('schedule')
        .where({
          ...params.searchInfo,
        })
        .get()
      res = {
        msg: '查询成功',
        code: 200,
        data: scheduleList.data[0],
      }
      break

      // 根据分站id列表获取分站列表
    case 'getScheduleListByIds':
      const dbc = db.command
      const scheduleLists = await db
        .collection('schedule')
        .where({
          // ...params.searchInfo,
          _id: dbc.in(params.ids)
        })
        .get()
        
        console.log();
      res = {
        msg: '查询成功',
        code: 200,
        data: scheduleLists.data,
      }
      break

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
