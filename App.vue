<template>
	<router-view></router-view>
</template>

<script>
	export default {
		data() {
			return {
				currentPath: "",
			};
		},
		watch: {
			$route: {
				handler: function(v, ov) {
					console.log(v.path + "v");
					this.currentPath = ov.path;
				}
			}
		},
	};
</script>

<style>
</style>
