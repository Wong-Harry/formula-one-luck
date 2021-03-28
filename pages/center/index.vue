<template>
  <view class="">
    <view class="avatar u-flex u-row-center">
      <button class="u-reset-button" @getuserinfo="getUserInfo" open-type="getUserInfo">
        <u-avatar :src="userInfo.avatar" text="无" bg-color="#ccc" size="large"></u-avatar>
        <view class="u-m-t-20">
          <text>请登陆</text>
        </view>
      </button>
    </view>

    <view class="context u-flex u-row-center">
      <view class="btns">
        <u-cell-item icon="setting-fill" title="积分明细"></u-cell-item>
        <u-cell-item icon="setting-fill" title="个人信息"></u-cell-item>
        <u-cell-item icon="setting-fill" title="消息"></u-cell-item>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'center',
    data() {
      return {
        list: [{
            iconPath: 'home',
            selectedIconPath: 'home-fill',
            text: '积分榜',
            customIcon: false,
            pagePath: '/pages/index/index',
          },
          {
            iconPath: 'photo',
            selectedIconPath: 'photo-fill',
            text: '竞猜中心',
            customIcon: false,
            pagePath: '/pages/luckDraw/luckDraw',
          },
          {
            iconPath: 'account',
            selectedIconPath: 'account-fill',
            text: '个人中心',
            customIcon: false,
            pagePath: '/pages/center/index',
          },
        ],
        current: 3,
        // 个人信息
        userInfo: {
          avatar: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
          userName: '',
          userId: '',
        },
      }
    },
    onLoad() {
      // this.wxLogin()
      const userInfo = uni.getStorageSync('userInfo')
      console.log('userInfo', userInfo);
    },
    methods: {
      /**
       * @description: 获取用户信息
       * @param {*}
       * @return {*}
       */
      getUserInfo() {
        uni.showLoading({
          title: '获取用户信息中',
          mask: true,
        })
        wx.getUserInfo({
          success: function(res) {
            console.log(res)
            const {
              userInfo
            } = res
            uniCloud.callFunction({
              name: 'user-center',
              data: {
                action: 'setUserInfo',
                uniIdToken: uni.getStorageSync('uni_id_token'),
                params: {
                  nickname: userInfo.nickname,
                  avatar: userInfo.avatarUrl,
                  gender: userInfo.gender,
                }
              }
            }).then((result) => {
              console.log(result);
              uni.hideLoading()
            })
          },
          fail: (err) => {
            console.error(err)
            uni.hideLoading()
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar {
    height: 400rpx;
    background-color: #fadb5d;
    border-radius: 0 0 20% 20%;

    .u-reset-button {
      display: flex;
      flex-direction: column;
    }
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
