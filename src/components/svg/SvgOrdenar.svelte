<script lang="ts">
    import type { SVGAttributes } from "svelte/elements";
        
    interface Props{
        props?:SVGAttributes<SVGSVGElement>
    }

    let {props}:Props = $props()
</script>

<svg width="16" height="13" fill="#525866" {...props} viewBox="0 0 16 13"  xmlns="http://www.w3.org/2000/svg">
    <path d="M13 0V9H15.25L12.25 12.75L9.25 9H11.5V0H13ZM7 10.5V12H0.25V10.5H7ZM8.5 5.25V6.75H0.25V5.25H8.5ZM8.5 0V1.5H0.25V0H8.5Z" />
</svg>
    