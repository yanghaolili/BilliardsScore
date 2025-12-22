<template>
	<view class="content">
		<button @click="handleOpenGame">开始对战</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			console.log("生命周期");
			
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.content {
		height: 800px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url("/static/startBanner.jpg");
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
