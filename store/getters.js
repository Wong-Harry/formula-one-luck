const getters = {
  tabbar: (state) => state.app.tabbar,
  tabbarActivity: (state) => state.app.tabbarActivity,
  baseUrl: (state) => state.app.baseUrl,
  localFileDir: (state) => state.app.localFileDir, // 本地存储文件位置
  readType: (state) => state.app.readType, // 获取读取模式
  // 设备信息
  deviceInfo: (state) => {
    const info = {
      networkStatus: state.app.networkStatus,
      networkType: state.app.networkType,
      deviceImei: state.app.deviceImei,
      deviceMac: state.app.deviceMac,
      deviceModel: state.app.deviceModel,
    }
    return info
  },
  // 活动信息
  activityInfo: (state) => {
    const info = {
      activityId: state.app.activityId,
      activityName: state.app.activityName,
      ajmName: state.app.ajmName,
      wayName: state.app.wayName,
    }
    return info
  },
}
export default getters
