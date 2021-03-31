const state = {
  // tabbar信息
  tabbar: [
    {
      iconPath: 'home',
      selectedIconPath: 'home-fill',
      text: '积分榜',
      customIcon: false,
      pagePath: '/pages/index/index',
    },
    {
      iconPath: 'photo',
      selectedIconPath: 'photo-fill',
      text: '竞猜中心',
      customIcon: false,
      pagePath: '/pages/luckDraw/luckDraw',
    },
    {
      iconPath: 'account',
      selectedIconPath: 'account-fill',
      text: '个人中心',
      customIcon: false,
      pagePath: '/pages/center/index',
    },
  ],
  tabbarActivity: 0,
  // // 设备信息
  // networkStatus: null,
  // networkType: null,
  // deviceImei: null,
  // deviceMac: null,
  // deviceModel: null,
  // // 安检门通道信息
  // activityId: null,
  // activityName: null,
  // ajmName: null,
  // wayName: null,
  // // 读取模式
  // readType: '离线库',
}

const mutations = {
  SET_TABBARACTVITY: (state, index) => {
    state.tabbarActivity = index
  },
  // SET_DEVICEINFO: (state, { imei, mac, networkType, deviceModel }) => {
  //   state.deviceImei = imei
  //   state.deviceMac = mac
  //   state.networkType = networkType
  //   state.deviceModel = deviceModel
  // },
  // SER_NETWORKTYPE: (state, networkType) => {
  //   state.networkType = networkType
  // },
  // SER_READTYPE: (state, readType) => {
  //   state.readType = readType
  // },
  // SET_NETWORKSTATUS: (state) => {
  //   if (state.networkType === 'unknown' || state.networkType === 'none') {
  //     state.networkStatus = '离线'
  //     state.readType = '离线库'
  //   } else {
  //     state.networkStatus = '在线'
  //     state.readType = '在线库'
  //   }
  // },
  // SET_ACTIVITYINFO: (state, { activityId, activityName, ajmName, wayName }) => {
  //   state.activityId = activityId
  //   state.activityName = activityName
  //   state.ajmName = ajmName
  //   state.wayName = wayName
  // },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
