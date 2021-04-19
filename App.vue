<script>
  function getWeixinCode() {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.login({
        provider: 'weixin',
        success(res) {
          resolve(res.code)
        },
        fail(err) {
          reject(new Error('微信登录失败'))
        },
      })
      // #endif
    })
  }

  function wxLogin() {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
    getWeixinCode()
      .then((code) => {
        return uniCloud.callFunction({
          name: 'user-center',
          data: {
            action: 'loginByWeixin',
            params: {
              code,
            },
          },
        })
      })
      .then(({
        result
      }) => {
        console.log('result', result);
        if (result.code === 0) {
          uni.setStorageSync('userInfo', result.userInfo)
          uni.setStorageSync('uni_id_token', result.token)
          uni.setStorageSync('uni_id_token_expired', result.tokenExpired)
          uni.hideLoading()
        } else {
          uni.showModal({
            showCancel: false,
            content: '微信登录失败，请稍后再试',
          })
        }
      })
      .catch((e) => {
        console.error(e)
        uni.showModal({
          showCancel: false,
          content: '微信登录失败，请稍后再试',
        })
      })
  }

  export default {
    onLaunch: function() {
      console.log('App Launch')
      wxLogin()
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    },
  }
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';

  /*每个页面公共css */
  page {
    font-family: 'formulaOneFont'
  }
</style>
