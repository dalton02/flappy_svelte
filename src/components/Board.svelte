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
        scores = response.data.data ?? []
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


<div class="flex justify-between items-center w-full px-12">
        <div class="flex flex-col items-center" transition:slide={{axis:"x"}}>
            <h1 class="text-[48px]">Leaderboard</h1>
            <div class="flex flex-col items-center justify-center pr-4 overflow-y-auto">
                
                <div class="flex items-end justify-center gap-6">
                
                    {#each scores.slice(0,3) as score,index (score.id)}
                        {#if index===0}
                            <div class="order-2">
                                {@render trofeu(1,scores[0].pontuacao,scores[0].nome)}
                            </div>
                        {/if}
                        {#if index===1}

                            <div class="order-1">
                                {@render trofeu(2,scores[1].pontuacao,scores[1].nome)}
                            </div>
                        {/if}          
                        {#if index===2}  
                            
                            <div class="order-3">
                                {@render trofeu(3,scores[2].pontuacao,scores[2].nome)}
                            </div>
                        {/if}
                    {/each}
                </div>
    
            </div>
        </div>
        <div class="flex flex-col h-full">
            <h1 class="text-[48px]">Scores</h1>
            {#each scores as score,index (score.id)}
                <div class="flex items-center border py-1 px-6 border-gray-300"
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



{#snippet trofeu(posicao:number,score:number,player:string)}
    <div class="relative flex flex-col items-center">
        <img src="/trofeu.png" alt="" class="w-20"/>
        <div class="absolute text-[14px] px-1 translate-y-10 flex items-center justify-center border border-black rounded-md  bg-white text-black">
            {player}
        </div>
        <div class="w-full bg-slate-400 origin-bottom" style="height: {150/posicao}px;">

        </div>

    </div>
{/snippet}