<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
	interface Props{
		props?:SVGAttributes<SVGSVGElement>
	}

	let {props}:Props = $props()

</script>


<svg width="10" height="10" viewBox="0 0 10 10" fill="none"  stroke="#99A0AE" {...props} xmlns="http://www.w3.org/2000/svg">
<path d="M8.11111 1L1 8.11111M9 5.44444L5.44444 9"/>
</svg>
