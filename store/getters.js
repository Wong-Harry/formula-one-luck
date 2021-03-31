const getters = {
  // app基础信息
  tabbar: (state) => state.app.tabbar,
  tabbarActivity: (state) => state.app.tabbarActivity,
  // 用户信息
  userInfo: (state) => state.user.userInfo,
  token: (state) => state.user.token,
}
export default getters
