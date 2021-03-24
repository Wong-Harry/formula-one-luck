<template>
	<view>
		<view class="u-page"></view>
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
			current: 3
		};
	}
};
</script>

<style lang="scss" scoped></style>
