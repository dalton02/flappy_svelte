<script lang="ts">
	import Toaster from '$components/Toaster.svelte';
	import toast from '$lib/utils/toast.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div class="w-screen h-screen bgG">
	<div class="w-full h-full overflow-y-auto bg-slate-900/98">
		{@render children()}
	</div>
</div>


<style>
	.bgG{
		background-color: #e5e5f7;
		background-image:  linear-gradient(135deg, #000000 25%, transparent 25%), linear-gradient(225deg, #000000 25%, transparent 25%), linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(315deg, #000000 25%, #e5e5f7 25%);
		background-position:  10px 0, 10px 0, 0 0, 0 0;
		background-size: 10px 10px;
		background-repeat: repeat;
	}
</style>