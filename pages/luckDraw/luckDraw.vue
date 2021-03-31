<template>
  <view class="u-p-16">
    <view class="u-page">
      <button type="default">产于抽奖</button>
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
      }
    },
    computed: {
      ...mapGetters(['tabbar', 'token']),
    },
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
