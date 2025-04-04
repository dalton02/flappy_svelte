<script lang="ts">
	import { PUBLIC_BACKEND_URL } from "$env/static/public";
	import axios from "axios";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { slide } from "svelte/transition";


    let scores = $state<{id:number,nome:string,pontuacao:number}[]>([])
    let show = $state(true)
    async function listar(){
        const response = await axios.get(PUBLIC_BACKEND_URL+"/scoreboard");
        scores = response.data.data
    }
    function shuffleScores() {
    for (let i = scores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scores[i], scores[j]] = [scores[j], scores[i]];
    }
    scores = scores
    }



    let idInterval:NodeJS.Timeout
    onMount(()=>{
        listar()
        idInterval = setInterval(()=>{
            listar()
        },3000)
        return()=>{
            clearInterval(idInterval)
        }
    })

</script>


<div class=" p-4 py-0 flex flex-col h-[600px]">
    {#if show}
        <div class="flex flex-col" transition:slide={{axis:"x"}}>
            <h1 class="text-[48px]">Leaderboard</h1>
            <div class="flex flex-col h-[600px] pr-4 overflow-y-auto">

                {#each scores as score,index (score.id)}
                    <div class="flex items-center {index<scores.length-1 && "border-b-0"} border py-1 px-6 border-gray-300"
                    animate:flip>
                        {index+1}º 
                        -
                        {score.nome}
                        <div class="h-4 w-[1px] bg-gray-200 mx-2"></div>
                        Score: {score.pontuacao}
                    </div>
                {/each}
    
            </div>
        </div>
    {:else}

    {/if}
</div>
