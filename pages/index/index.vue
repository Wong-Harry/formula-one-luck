<template>
  <view>
    <view class="u-page">
      <u-tabs :list="tabsList" :is-scroll="false" active-color="#fff" inactive-color="#ececec" bar-height="6"
        bar-width="80" bg-color="#d82718" :current="tabsCurrent" @change="tabChange"></u-tabs>

      <!-- <u-input
        v-model="scheduleInfo.showText"
        placeholder="请选择大奖赛"
        type="select"
        :border="border"
        @click="scheduleInfo.show = true"
      />
      <u-select v-model="scheduleInfo.show" :list="scheduleInfo.scheduleList" @confirm="confirmSchedule"></u-select> -->
      <!-- 车手积分 -->
      <view v-show="tabsCurrent === 0">
        <view v-for="(item, index) in dirvers" :key="index" @click="openDirverInfo(item)"
          class="dirverItem u-flex u-row-between u-font-14 u-main-color">
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
      <!-- 车队积分 -->
      <view v-show="tabsCurrent === 1">
        <view v-for="(item, index) in teamData" :key="index" @click="openTeamInfo(item)"
          class="dirverItem u-flex u-row-between u-font-14 u-main-color">
          <view> {{ index + 1 }}</view>
          <view class="u-flex u-row-between u-flex-1 u-p-r-20 u-p-l-20">
            <view class="content">
              <text>{{ item.team_name }}</text>

              <view class="u-flex">
                <text class="u-tips-color u-font-12 u-m-t-10 u-m-r-10"
                  v-for="(teamDirver, teamDirverIndex) in item.team_deiver_name"
                  :key="teamDirverIndex">{{teamDirver.driver_name}}
                </text>
              </view>
            </view>
            <view class="u-font-12">{{ item.PTSSum }}PTS </view>
          </view>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
    </view>

    <u-toast ref="uToast" />
    <loadingPopup ref="loadingPopup" />
    <u-tabbar v-model="tabbarCurrent" :list="tabbar"></u-tabbar>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  // const mixins = {
  //   methods: {
  //     getWeixinCode() {
  //       return new Promise((resolve, reject) => {
  //         // #ifdef MP-WEIXIN
  //         uni.login({
  //           provider: 'weixin',
  //           success(res) {
  //             resolve(res.code)
  //           },
  //           fail(err) {
  //             reject(new Error('微信登录失败'))
  //           },
  //         })
  //         // #endif
  //       })
  //     },
  //     wxLogin() {
  //       return this.getWeixinCode()
  //         .then((code) => {
  //           return uniCloud.callFunction({
  //             name: 'user-center',
  //             data: {
  //               action: 'loginByWeixin',
  //               params: {
  //                 code,
  //               },
  //             },
  //           })
  //         })
  //         .then(({ result }) => {
  //           console.log('$refs', this.$refs)
  //           if (result.code === 0) {
  //             uni.setStorageSync('userInfo', result.userInfo)
  //             uni.setStorageSync('uni_id_token', result.token)  
  //             uni.setStorageSync('uni_id_token_expired', result.tokenExpired)
  //             return Promise.resolve()
  //           } else {
  //             this.$refs.uToast.show({
  //               title: '微信登录失败',
  //               type: 'error',
  //             })
  //             return Promise.reject()
  //           }
  //         })
  //         .catch((e) => {
  //           this.$refs.uToast.show({
  //             title: '微信登录失败',
  //             type: 'error',
  //           })
  //           console.error(e)
  //         })
  //     },
  //   },
  // }

  export default {
    name: 'PTS',
    // mixins: [mixins],
    data() {
      return {
        // 底部tabbar
        tabbarCurrent: 0,
        // 头部tabs
        tabsList: [{
            name: '车手积分榜',
          },
          {
            name: '车队积分榜',
          },
        ],
        tabsCurrent: 0, // tab 当前下标
        // 数据
        dirvers: [], // 车手列表数据
        teamData: [], // 车队列表数据
        // 搜索信息
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
      // this.$refs.loadingPopup.open()
      // await this.wxLogin()
      console.log('微信登陆完成')
      // this.getScheduleList()
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
      await this.getDirversPTS()
      // await this.getTeamDataPTS()
      uni.hideLoading()
      // this.$refs.loadingPopup.close()
    },
    methods: {
      // tabs change时间
      tabChange(index) {
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
          .then(result => {
            console.log('result', result);
            // const {
            //   data
            // } = result
            // this.scheduleInfo.scheduleList = data.map((item) => ({
            //   label: item.race_name,
            //   value: item._id
            // }))
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
        // this.$refs.loadingPopup.open()
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
          .then(({
            result
          }) => {
            console.log('result', result);
            const {
              data
            } = result
            this.dirvers = data
          })
      },
      /**
       * @description: 查询车队积分信息
       * @param {*}
       * @return {*}
       */
      async getTeamDataPTS() {
        await uniCloud
          .callFunction({
            name: 'drivers-center',
            data: {
              action: 'getTeamsPTS',
              uniIdToken: uni.getStorageSync('uni_id_token'),
              params: {
                searchInfo: {}
              },
            },
          })
          .then(({
            result
          }) => {
            const {
              data
            } = result
            this.teamData = data
            console.log('getTeamsPTS', result)
          })
      },
      openDirverInfo(dirverItem) {
        const {
          driver_name,
          _id
        } = dirverItem
        uni.navigateTo({
          url: `driverInfo?id=${_id}&name=${driver_name}`
        });
      },
      openTeamInfo(dirverItem) {
        console.log('dirverItem', dirverItem);
        const {
          _id,
          team_name
        } = dirverItem
        uni.navigateTo({
          url: `teamInfo?id=${_id}&name=${team_name}`
        });
      }
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
