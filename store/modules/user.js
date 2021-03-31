const state = {
  userInfo: {},
  token: '',
  tokenExpired: '',
}

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKENEXPIRED: (state, tokenExpired) => {
    state.tokenExpired = tokenExpired
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
