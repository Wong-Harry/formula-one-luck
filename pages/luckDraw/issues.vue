<template>
  <view>
    <view v-for="(item,index) in issuesList" :key="index" class="issuesItem u-p-20 u-m-b-20">
      <viwe class="u-flex u-row-between">
        <text>问题 {{index+1}}</text>
        <text>{{item.guess_reward}} 分</text>
      </viwe>
      <view>题目：{{item.guess_title}}</view>


      <view v-if="item.guess_type==='真假'">
        <u-select v-model="show" :list="list"></u-select>
      </view>

      <view v-else-if="item.guess_type==='选择'">
        <u-select v-model="show" :list="list"></u-select>
      </view>
      <view v-else-if="item.guess_type==='选择范围'">选择范围</view>

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        issuesList: []
      };
    },
    onLoad: async function(options) {
      await this.getGuessIssues(options.id)
    },
    methods: {
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
          this.issuesList = result.data
        })
      }
    }
  }
</script>

<style lang="scss">
  .issuesItem {
    background-color: #FFFFFF;

  }
</style>
