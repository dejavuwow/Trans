<template>
	<transition name="slide-right">
		<div class="body_wrap notice_wrap">
			<Header :title="title">
				<router-link to="/notelist?path=notice" slot="left" class="fa fa-angle-left" tag="i"></router-link>
				<i slot="right"></i>
			</Header>
			<div class="contwrap" ref="wrap">
				<div class="maincontent" v-if="$i18n.locale === 'zh-CN'">
					<h3 v-html="article.title_ch"></h3>
					<div v-html="article.content_ch"></div>
				</div>	
			</div>
		</div>
	</transition>
</template>

<script>
	import Header from '../Public/header';
	import IScroll from 'iscroll/build/iscroll-probe';
	export default {
		name:"notice",
		components:{Header},
		data(){
			return{
				title:this.$t('note.tip3'),
				article:{},
			}
		},
		created(){
			this.article = this.$route.query;
		}
	};
</script>
<style lang="scss">
	@import "../../assets/sass/index.scss";
	.notice_wrap{
		color:#ccc;
		.contwrap{
			border-top: 1px solid $linecolor;
			h3{
				padding:10px;
				text-align: center;
			}
			div{
				padding:10px;
				@extend %textstyle;
			}
		}
	}

</style>


