<template>
  <view>
    <view class="teamInfo u-p-20 ">
      <text>车队名称:{{teamInfo.team_name}}</text>
    </view>
    <view class="dirverInfo u-p-20 u-m-t-40">
      <view class="u-m-b-20">车手</view>
      <view class="u-p-20 u-flex u-flex-nowrap">
        <text v-for="(item,index) in dirverInfo" :key="index" @click="openDirverInfo(item)"
          class="u-flex-1">{{item.driver_name}}</text>
      </view>
    </view>
    <view class="scheduList u-p-20 u-m-t-40">
      <view class="u-p-b-20">分站信息</view>

      <view v-for="(item,index) in scheduList" :key="index" class="u-p-20 u-border-top u-flex u-row-between">
        <text>{{item.race_name}}</text>
        <text>{{item.PTSSum}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        teamInfo: {
          team_name: ''
        },
        dirverInfo: [],
        scheduList: [],
      }
    },
    onLoad: async function(option) {
      const {
        id,
        name
      } = option
      console.log('option', option)
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
      await this.getTeamInfo(id)
      await this.getSchedu(id)
      uni.hideLoading()
      // this.getdirverInfo()
    },
    methods: {
      async getTeamInfo(id) {
        await uniCloud
          .callFunction({
            name: 'drivers-center',
            data: {
              action: 'getTeamsPTS',
              uniIdToken: uni.getStorageSync('uni_id_token'),
              params: {
                searchInfo: {
                  _id: id,
                },
              },
            },
          })
          .then(({
            result
          }) => {
            console.log('getTeamsPTS', result)
            const {
              data
            } = result
            this.teamInfo = data[0]
            console.log('this.teamInfo: ', this.teamInfo)
            this.dirverInfo = data[0].team_deiver_name
            console.log('this.dirverInfo: ', this.dirverInfo)
          })
      },
      async getSchedu() {
        console.log(12312)
        const ids = new Set()
        for (let index = 0; index < this.teamInfo.PTS.length; index++) {
          const {
            race_id
          } = this.teamInfo.PTS[index]
          ids.add(race_id)
        }
        console.log('ids', Array.from(ids))

        await uniCloud.callFunction({
          name: 'drivers-center',
          data: {
            action: 'getScheduleListByIds',
            uniIdToken: uni.getStorageSync('uni_id_token'),
            params: {
              ids: Array.from(ids)
            }
          }
        }).then(({
          result
        }) => {
          this.scheduList = result.data
          for (let i = 0; i < this.scheduList.length; i++) {
            const scheduItem = this.scheduList[i]
            scheduItem.PTSSum = 0
            for (let n = 0; n < this.teamInfo.PTS.length; n++) {
              const PTSInfo = this.teamInfo.PTS[n]
              if (PTSInfo.race_id === scheduItem._id) {
                scheduItem.PTSSum += PTSInfo.PTS
              }
            }
          }
          console.log('this.scheduList', this.scheduList);
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
      // async getdirverInfo() {},
    },
  }
</script>

<style lang="scss">
  .teamInfo,
  .dirverInfo,
  .scheduList {
    background-color: #FFFFFF;
  }
</style>
