<template>
  <view>
    <view class="u-page">
      <u-tabs
        :list="tabsList"
        :is-scroll="false"
        active-color="#fff"
        inactive-color="#e2e2e2"
        bar-height="6"
        bar-width="80"
        bg-color="#d82718"
        :current="tabsCurrent"
        @change="change"
      ></u-tabs>

      <!-- <u-input
        v-model="scheduleInfo.showText"
        placeholder="请选择大奖赛"
        type="select"
        :border="border"
        @click="scheduleInfo.show = true"
      />
      <u-select v-model="scheduleInfo.show" :list="scheduleInfo.scheduleList" @confirm="confirmSchedule"></u-select> -->

      <view v-show="tabsCurrent === 0">
        <view v-for="(item, index) in dirvers" :key="index" class="dirverItem u-flex u-row-between u-font-14 u-main-color">
          <view> {{ index + 1 }}</view>
          <view class="u-flex u-row-between u-flex-1 u-p-r-20 u-p-l-20">
            <view class="content">
              <text>{{ item.driver_name }}</text>
              <text class="u-tips-color u-font-12 u-m-t-10">{{ item.teamInfo[0].team_name }}</text>
            </view>
            <view class="u-font-12">{{ item.PTSSum }}PTS </view>
          </view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view v-show="tabsCurrent === 1"> </view>
    </view>

    <u-toast ref="uToast" />
    <loadingPopup ref="loadingPopup" />
    <u-tabbar v-model="tabbarCurrent" :list="tabbar"></u-tabbar>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

const mixins = {
  methods: {
    getWeixinCode() {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
          provider: 'weixin',
          success(res) {
            resolve(res.code)
          },
          fail(err) {
            reject(new Error('微信登录失败'))
          },
        })
        // #endif
      })
    },
    wxLogin() {
      return this.getWeixinCode()
        .then((code) => {
          return uniCloud.callFunction({
            name: 'user-center',
            data: {
              action: 'loginByWeixin',
              params: {
                code,
              },
            },
          })
        })
        .then(({ result }) => {
          console.log('$refs', this.$refs)
          if (result.code === 0) {
            uni.setStorageSync('userInfo', result.userInfo)
            uni.setStorageSync('uni_id_token', result.token)
            uni.setStorageSync('uni_id_token_expired', result.tokenExpired)
            return Promise.resolve()
          } else {
            this.$refs.uToast.show({
              title: '微信登录失败',
              type: 'error',
            })
            return Promise.reject()
          }
        })
        .catch((e) => {
          this.$refs.uToast.show({
            title: '微信登录失败',
            type: 'error',
          })
          console.error(e)
        })
    },
  },
}

export default {
  name: 'PTS',
  mixins: [mixins],
  data() {
    return {
      // 底部tabbar
      tabbarCurrent: 0,
      // 头部tabs
      tabsList: [
        {
          name: '车手积分榜',
        },
        {
          name: '车队积分榜',
        },
      ],
      tabsCurrent: 0,
      // 数据
      dirvers: [],
      teamData: [],
      searchInfo: {
        race_id: '',
      },
      scheduleInfo: {
        showText: '',
        show: false,
        scheduleList: [],
      },
    }
  },
  computed: {
    ...mapGetters(['tabbar', 'token']),
  },
  async onLoad() {
    this.$refs.loadingPopup.open()
    // await this.wxLogin()
    await this.getDirversPTS()
    console.log('微信登陆完成')
    this.getScheduleList()
    this.getTeamDataPTS()
    this.$refs.loadingPopup.close()
  },
  methods: {
    change(index) {
      this.tabsCurrent = index
    },
    /**
     * @description: 获取分站信息
     * @param {*}
     * @return {*}
     */
    async getScheduleList() {
      await uniCloud
        .callFunction({
          name: 'drivers-center',
          data: {
            action: 'getScheduleList',
            uniIdToken: uni.getStorageSync('uni_id_token'),
            params: {
              searchInfo: {},
            },
          },
        })
        .then(({ result }) => {
          const { data } = result
          this.scheduleInfo.scheduleList = data.map((item) => ({ label: item.race_name, value: item._id }))
          // 设置默认值
          // this.scheduleInfo.showText = this.scheduleInfo.scheduleList[0].label
          // this.searchInfo.race_id = this.scheduleInfo.scheduleList[0].value
          // 获取车手积分排名
          // this.getDirversPTS()
        })
    },
    /**
     * @description: 分站下拉框确认操作
     * @param {*} e
     * @return {*}
     */
    confirmSchedule(e) {
      this.scheduleInfo.showText = e[0].label
      this.searchInfo.race_id = e[0].value
      this.getDirversPTS()
    },
    /**
     * @description: 查询车手积分信息
     * @param {*}
     * @return {*}
     */
    async getDirversPTS() {
      const searchInfo = {}
      if (this.searchInfo.race_id) {
        searchInfo['race_id'] = this.searchInfo.race_id
      }
      this.$refs.loadingPopup.open()
      await uniCloud
        .callFunction({
          name: 'drivers-center',
          data: {
            action: 'getDirversPTS',
            uniIdToken: uni.getStorageSync('uni_id_token'),
            params: {
              searchInfo,
            },
          },
        })
        .then(({ result }) => {
          const { data } = result
          this.dirvers = data
          this.$refs.loadingPopup.close()
          console.log('result', result)
        })
    },
    async getTeamDataPTS() {
      // const searchInfo = {}
      // if (this.searchInfo.race_id) {
      //   searchInfo['race_id'] = this.searchInfo.race_id
      // }
      this.$refs.loadingPopup.open()
      await uniCloud
        .callFunction({
          name: 'drivers-center',
          data: {
            action: 'getTeamsPTS',
            uniIdToken: uni.getStorageSync('uni_id_token'),
            params: {},
          },
        })
        .then(({ result }) => {
          const { data } = result
          // this.dirvers = data
          this.$refs.loadingPopup.close()
          console.log('getTeamsPTS', result)
        })
    },
    // /**
    //  * @description: 设置用户信息 由于没办法在app.vue中调用vuex，采取在进入主页面设置
    //  * @param {*}
    //  * @return {*}
    //  */
    // setUserInfo() {
    //   const userInfo = uni.getStorageSync('userInfo')
    //   const uni_id_token = uni.getStorageSync('uni_id_token')
    //   const uni_id_token_expired = uni.getStorageSync('uni_id_token_expired')
    //   this.$store.commit('user/SET_USERINFO', userInfo)
    //   this.$store.commit('user/SET_TOKEN', uni_id_token)
    //   this.$store.commit('user/SET_TOKENEXPIRED', uni_id_token_expired)
    //   console.log('userInfo: ', userInfo)
    // },
    // addTeam() {
    //   uniCloud
    //     .callFunction({
    //       name: 'drivers-center',
    //       data: {
    //         action: 'addSchedule',
    //         uniIdToken: uni.getStorageSync('uni_id_token'),
    //         params: {
    //           addData: [
    //             {
    //               race_name: '巴林大奖赛',
    //               country: '巴林',
    //               start_time: new Date('2021-03-26'),
    //               end_time: new Date('2021-03-28'),
    //             },
    //           ],
    //         },
    //       },
    //     })
    //     .then(({ result }) => {
    //       const { data } = result
    //       console.log('result', result)
    //     })
    // },
    // setTeam() {
    //   uniCloud
    //     .callFunction({
    //       name: 'drivers-center',
    //       data: {
    //         action: 'setSchedulePTS',
    //         uniIdToken: uni.getStorageSync('uni_id_token'),
    //         params: {
    //           PTSInfo: [
    //             {
    //               race_id: '6064743173c039000128444a',
    //               PTS: 25,
    //               dirver_id: '6061d8ae8b04d50001483a0f',
    //               team_id: '6061d9b852e80f0001a8cd2d',
    //             },
    //             {
    //               race_id: '6064743173c039000128444a',
    //               PTS: 16,
    //               dirver_id: '6061d9104f25170001427781',
    //               team_id: '6061d9b852e80f0001a8cd2d',
    //             },
    //             {
    //               race_id: '6064743173c039000128444a',
    //               PTS: 0,
    //               dirver_id: '6061d7b221bb8600015c7b6d',
    //               team_id: '6061da07d414e300017a0595',
    //             },
    //             {
    //               race_id: '6064743173c039000128444a',
    //               PTS: 0,
    //               dirver_id: '6061d8f759633b0001b4edae',
    //               team_id: '6061d9e98781a50001ef126c',
    //             },
    //           ],
    //         },
    //       },
    //     })
    //     .then(({ result }) => {
    //       const { data } = result
    //       console.log('result', result)
    //     })
    // },
  },
}
</script>

<style lang="scss" scoped>
.dirverItem {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 20rpx;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
