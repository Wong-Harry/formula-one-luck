<template>
  <view class="u-p-16">
    <view class="u-page"><u-button type="default" @getuserinfo="getUserInfoBtn" open-type="getUserInfo">123123</u-button></view>
    <!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
    <!-- <u-tabbar v-model="current" :list="list"></u-tabbar> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          iconPath: 'home',
          selectedIconPath: 'home-fill',
          text: '积分榜',
          customIcon: false,
          pagePath: '/pages/index/index'
        },
        {
          iconPath: 'photo',
          selectedIconPath: 'photo-fill',
          text: '竞猜中心',
          customIcon: false,
          pagePath: '/pages/luckDraw/luckDraw'
        },
        {
          iconPath: 'account',
          selectedIconPath: 'account-fill',
          text: '个人中心',
          customIcon: false,
          pagePath: '/pages/center/index'
        }
      ],
      current: 0
    };
  },
  created() {
    // console.log('$store', this.$store);
  },
  methods: {
    getUserInfoBtn(e) {
      // 获取用户信息
      // uni.getUserInfo({
      // 	provider: 'weixin',
      // 	withCredentials: true,
      // 	success: function(infoRes) {
      // 		console.log('用户昵称为：' + infoRes.userInfo.nickName);
      // 	},
      // 	fail: err => {
      // 		console.error(err);
      // 	}
      // });
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped></style>
