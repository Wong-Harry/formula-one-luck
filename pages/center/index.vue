<template>
  <view class="">
    <view class="avatar  u-flex u-row-center ">
      <button class="u-reset-button" @getuserinfo="getUserInfo" open-type="getUserInfo">
        <u-avatar :src="src" :text="text"></u-avatar>
        <text>请登陆</text>
      </button>
    </view>

    <view class="context u-flex u-row-center">
      <view class="btns">
        <u-cell-item icon="setting-fill" title="积分明细"></u-cell-item>
        <u-cell-item icon="setting-fill" title="个人信息"></u-cell-item>
        <u-cell-item icon="setting-fill" title="消息"></u-cell-item>
        <!-- <view class="u-p-20 u-border-top"><text>积分明细</text></view> -->
        <!-- <view class="u-p-20 u-border-top"><text>个人信息</text></view> -->
        <!-- <view class="u-p-20 u-border-top"><text>消息</text></view> -->
      </view>
    </view>

    <!-- <view class="u-p-20">123123</view> -->
    <!-- <u-tabbar v-model="current" :list="list"></u-tabbar> -->
    <!-- 
    <u-mask :show="show" @click="show = false">
      <view class="warp"><view class="rect" @tap.stop></view></view>
    </u-mask> -->
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
      current: 3,
      src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
      text: '无头像',
      show: true
    };
  },
  methods: {
    getUserInfo() {
      uni.showLoading({
        title: '获取用户信息中',
        mask: true
      });
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code);
            wx.getUserInfo({
              success: function(res) {
                console.log(res);
                uni.hideLoading();
              },
              fail: err => {
                console.error(err);
                uni.hideLoading();
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        },
        fail(e) {
          console.error(err);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  height: 400rpx;
  background-color: #fadb5d;
  border-radius: 0 0 20% 20%;
}
.context {
  position: relative;
  .btns {
    background-color: #ffffff;
    position: absolute;
    top: -80rpx;
    width: 90%;
    border-radius: 20rpx;
  }
}
</style>
