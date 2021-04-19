<template>
  <view>
    <view class="dirverInfo u-p-l-20 u-p-r-20 u-p-t-80 u-p-b-80 u-flex">
      <text class="u-flex-1">{{ dirverInfo.driver_name }}</text>
      <text class="u-flex-1">{{ dirverInfo.dirver_team }}</text>
    </view>

    <view class="scheduList u-p-20 u-border-top u-flex u-row-between" v-for="(item, index) in scheduList" :key="index">
      <text>{{ item.scheduleInfo.race_name || '未知大奖赛' }}</text>
      <text>{{ item.PTS }}分</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        dirverInfo: {},
        scheduList: [],
      }
    },
    onLoad: async function(option) {
      const {
        id,
        name
      } = option
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
      await this.getDirverInfo(id)
      await this.getScheduInfoByDirverId(id)
      uni.hideLoading()
    },
    methods: {
      // 获取车手信息
      async getDirverInfo(id) {
        await uniCloud
          .callFunction({
            name: 'drivers-center',
            data: {
              action: 'getDirverById',
              uniIdToken: uni.getStorageSync('uni_id_token'),
              params: {
                id,
              },
            },
          })
          .then(({
            result
          }) => {
            this.dirverInfo = result.data
          })
      },
      // 获取车手参与分站详细信息
      async getScheduInfoByDirverId(dirver_id) {
        await uniCloud
          .callFunction({
            name: 'drivers-center',
            data: {
              action: 'getDirverScheduleList',
              uniIdToken: uni.getStorageSync('uni_id_token'),
              params: {
                searchInfo: {
                  dirver_id,
                },
              },
            },
          })
          .then(({
            result
          }) => {
            this.scheduList = result.data
            console.log('this.scheduList: ', this.scheduList)
          })
      },
    },
  }
</script>

<style lang="scss">
  .dirverInfo,
  .scheduList {
    background-color: #ffffff;
  }
</style>
