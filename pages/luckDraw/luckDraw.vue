<template>
	<view>
		<view class="u-page"><!-- 所有内容的容器 --></view>
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
			current: 1
		};
	}
};
</script>

<style lang="scss" scoped></style>
