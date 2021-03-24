<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				console.log(JSON.stringify(loginRes));
				uniCloud
					.callFunction({
						name: 'getUserInfo',
						data: { code: loginRes.code }
					})
					.then((result) => {
						console.log(JSON.parse(JSON.stringify(result)));
					})
					.catch(err => {
						console.error(err);
					});
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
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
/*每个页面公共css */
</style>
