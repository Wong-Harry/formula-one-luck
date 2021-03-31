<template>
  <view class="">
    <view class="avatar u-flex u-row-center">
      <button class="u-reset-button userInfo" @getuserinfo="getUserInfo" open-type="getUserInfo" v-if="!userInfo.username">
        <u-avatar :src="userInfo.avatar" text="无" bg-color="#ccc" size="large"></u-avatar>
        <view class="u-m-t-20">
          <text>请登陆</text>
        </view>
      </button>

      <view class="userInfo" v-else>
        <u-avatar :src="userInfo.avatar" bg-color="#ccc" size="large"></u-avatar>
        <view class="u-m-t-20">
          <text>{{ userInfo.username }}</text>
        </view>
      </view>
    </view>

    <view class="context u-flex u-row-center">
      <view class="btns">
        <u-cell-item icon="setting-fill" title="积分明细"></u-cell-item>
        <u-cell-item icon="setting-fill" title="个人信息"></u-cell-item>
        <u-cell-item icon="setting-fill" title="消息"></u-cell-item>
      </view>
    </view>

    <u-tabbar v-model="current" :list="tabbar"></u-tabbar>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'center',
  data() {
    return {
      current: 3,
      userInfo: {},
    }
  },
  computed: {
    ...mapGetters(['tabbar', 'token']),
  },
  onLoad() {
    this.inftData()
  },
  methods: {
    inftData() {
      this.userInfo = uni.getStorageSync('userInfo')
    },
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
        success: function (res) {
          console.log(res)
          const { userInfo } = res
          uniCloud
            .callFunction({
              name: 'user-center',
              data: {
                action: 'setUserInfo',
                uniIdToken: uni.getStorageSync('uni_id_token'),
                params: {
                  username: userInfo.nickName,
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatarUrl,
                  gender: userInfo.gender,
                },
              },
            })
            .then((result) => {
              console.log(result)
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

  .userInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
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
