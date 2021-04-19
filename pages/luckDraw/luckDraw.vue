<template>
  <view class="u-p-16">
    <view>
      <!-- <view class="u-page">
        <button type="default" @click="getGuessList">参与抽奖</button>
      </view> -->

      <view v-for="(item,index) in guessList" :key="index" class="guessItem" @click="openIssuesInfo(item)">
        {{item.schedule_name}}
      </view>
    </view>
    <!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
    <u-tabbar v-model="current" :list="tabbar"></u-tabbar>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'LuckDraw',
    data() {
      return {
        current: 1,
        guessList: []
      }
    },
    computed: {
      ...mapGetters(['tabbar', 'token']),
    },
    onLoad() {
      this.getGuessList()
    },
    methods: {
      addData() {
        uniCloud.callFunction({
          name: 'guess-center',
          data: {
            action: 'addGuessItem',
            uniIdToken: uni.getStorageSync('uni_id_token'),
            params: {
              insertData: {
                schedule_id: "607d15fe21576100016b4971",
                schedule_name: "巴林大奖赛1",
                guess_title: "第八名是谁",
                guess_type: "选择",
                guess_reward: "12",
              }
            }
          }
        })
      },
      async getGuessList() {
        await uniCloud.callFunction({
          name: 'guess-center',
          data: {
            action: 'getGuessList',
            params: {}
          }
        }).then(({
          result
        }) => {
          console.log('result', result);
          this.guessList = result.data
        })
      },
      openIssuesInfo(item) {
        console.log('item', item);
        const {
          _id,
        } = item
        uni.navigateTo({
          url: `issues?id=${_id}`
        });
      },
      async getGuessIssues(id) {
        await uniCloud.callFunction({
          name: 'guess-center',
          data: {
            action: 'getGuessIssuesByScheduId',
            params: {
              scheduleId: id
            }
          }
        }).then(({
          result
        }) => {
          console.log('result', result);
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .guessItem {
    padding: 100rpx 40rpx;
    margin-bottom: 40rpx;
    background: #FFFFFF;
    border-radius: 40rpx;
  }
</style>
