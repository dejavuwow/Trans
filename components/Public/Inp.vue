<template>
	<div class="inp_wrap">
		<input :type="inputData.type" 
		:value = "inputData.value"
		:placeholder = "inputData.placeholder"
		:name = "inputData.name"
		@input="updateVal($event.target.value,inputData.name)"
		>
		<slot></slot>
	</div>
</template>
<script>
	"use strict";
	import bus from '../../assets/js/eventBus.js';
	export default {
		name:"inp",
		props:["inputData"],
		data(){
			return{
			}
		},
		computed:{
		},
		methods:{
			//oninput事件触发父组件中的'input'自定义事件传参
			updateVal(value,name){
				this.$emit("input",{value,name});
			}
		}
	}

</script>
<style lang="scss">
	@import '../../assets/sass/index.scss';
	.inp_wrap{
		input{
			width:200px;
			height:30px;
			border:1px solid #eee;
		}
	}
</style>