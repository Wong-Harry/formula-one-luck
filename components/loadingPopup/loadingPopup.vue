<template>
  <u-popup ref="popup" custom-style="" mode="center" border-radius="10" width="300" height="300" mask zoom :mask-close-able="false">
    <view class="popipContent">
      <u-loading mode="flower" size="100" />
      <text class="u-p-t-30 light-color">{{ tips }}</text>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'LoadingPopup',
  props: {
    tips: {
      type: String,
      default: '加载中',
    },
  },
  data() {
    return {}
  },
  methods: {
    /**
     * @description: 弹出层打开
     * @param {*}
     * @return {*}
     */
    open() {
      this.$refs.popup.open()
    },
    /**
     * @description: 弹出层收起
     * @param {*}
     * @return {*}
     */
    close() {
      this.$refs.popup.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.popipContent {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  height: 300rpx;
}
</style>
