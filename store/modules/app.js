const state = {
  baseUrl: 'http://www.daxinghuodong.cn:8081/service/',
  imageUrl: 'http://112.33.40.121:82/',
  localFileDir: '/storage/emulated/0/handheld_devicse',
  // tabbar信息
  tabbar: [
    {
      iconPath: 'shenfenzheng',
      selectedIconPath: 'shenfenzheng-tianchong',
      customIcon: true,
      text: '身份核查',
      pagePath: '/pages/idCard/index',
    },
    {
      iconPath: 'photo',
      selectedIconPath: 'photo-fill',
      text: '人像识别',
      pagePath: '/pages/personRecongnition/index',
    },
  ],
  tabbarActivity: 0,
  // 设备信息
  networkStatus: null,
  networkType: null,
  deviceImei: null,
  deviceMac: null,
  deviceModel: null,
  // 安检门通道信息
  activityId: null,
  activityName: null,
  ajmName: null,
  wayName: null,
  // 读取模式
  readType:'离线库',
}

const mutations = {
  SET_TABBARACTVITY: (state, index) => {
    state.tabbarActivity = index
  },
  SET_DEVICEINFO: (state, { imei, mac, networkType, deviceModel }) => {
    state.deviceImei = imei
    state.deviceMac = mac
    state.networkType = networkType
    state.deviceModel = deviceModel
  },
  SER_NETWORKTYPE: (state, networkType) => {
    state.networkType = networkType
  },
  SER_READTYPE: (state, readType) => {
    state.readType = readType
  },
  SET_NETWORKSTATUS: (state) => {
    if (state.networkType === 'unknown' || state.networkType === 'none') {
      state.networkStatus = '离线'
      state.readType = '离线库'
    } else {
      state.networkStatus = '在线'
      state.readType = '在线库'
    }
  },
  SET_ACTIVITYINFO: (state, { activityId, activityName, ajmName, wayName }) => {
    state.activityId = activityId
    state.activityName = activityName
    state.ajmName = ajmName
    state.wayName = wayName
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
