<script lang="ts">
	import { Game } from '$lib/game.svelte';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import StartMenu from '../components/StartMenu.svelte';
	import infoUser from '$lib/front.svelte';
	import Board from '$components/Board.svelte';
	import {  PUBLIC_BACKEND_URL } from '$env/static/public';
	import storageService from '$lib/storageService';
	import axios from 'axios';

    let game:Game

    function keyUpEvent(e:KeyboardEvent){
        if(e.key==="ArrowUp" || e.key===" "){
            e.preventDefault()

            game.keyUpRelease()
        }
        if(e.key==="ArrowLeft"){
            game.keyLeftRelease()
        }
        if(e.key==="ArrowRight"){
            game.keyRightRelease()
        }

    }

    function keyDownEvent(e:KeyboardEvent){

        if(e.key==="ArrowUp"  || e.key===" "){
            game.keyUpActions()
            e.preventDefault()

        }
        if(e.key==="ArrowLeft"){
            game.keyLeftActions()
        }
        if(e.key==="ArrowRight"){
            game.keyRightActions()
        }

    }

	onMount(async() => {
        game = new Game()
        const usuario = storageService.getStoredData("flappy")
        if(usuario && usuario.id && usuario.nome){
            try{
                const response = await axios.get(PUBLIC_BACKEND_URL+"/score/"+usuario.id)
                usuario.pontuacao = response.data.data.pontuacao;
                infoUser.info.logado=true
                const data = response.data.data
                game.dadosJogador={
                    id:data.id,
                    nome:data.nome,
                    skin:infoUser.info.skin
                }
                storageService.storeData("flappy",game.dadosJogador)
                game.socketConnection.onopen = (e) => {
                    if (game.socketConnection.readyState === WebSocket.OPEN) {
                        game.socketConnection.send(JSON.stringify({
                            tipo: "conectar",
                            conteudo: {
                                nome: data.nome,
                                id: data.id,
                                coordenadas: {
                                    x: 0,
                                    y: 0
                                },
                                pontuacao: parseInt(data.pontuacao),                    
                                skin:infoUser.info.skin,
                                gametime:0,
                                status:"idle"
                            }
                        }));
                    } else {
                        console.log("Conexão não está pronta ainda 😅");
                    }
                };                
            }
            catch(err){

            }
        }

    });

</script>

<svelte:document onkeydown={keyDownEvent} onkeyup={keyUpEvent}/>

<div class="flex flex-col items-center p-20 text-amber-50 w-full h-screen gap-5 px-12">

    <div class="game border-[6px] w-[1280px] h-[600px] shrink-0 overflow-hidden rounded-lg border-amber-100 relative">
            {#if infoUser.info.freezeGame}
                <div class="absolute top-0 left-0 w-full h-full">
                    <StartMenu onLogin={(r)=>{
                        game.dadosJogador={
                            id:r.id,
                            nome:r.nome,
                            skin:infoUser.info.skin,
                        }
                        storageService.storeData("flappy",game.dadosJogador)
                        game.socketConnection.send(JSON.stringify({
                            tipo:"conectar",
                            conteudo:{
                                nome:game.dadosJogador.nome,
                                id: game.dadosJogador.id,
                                coordenadas:{
                                    x:0,
                                    y:0
                                },
                                pontuacao: parseInt(r.pontuacao),
                                skin:infoUser.info.skin,
                                gametime:0,
                                status:"idle"
                            }
                        }))
                    }}/>
                </div>
            {/if}
        </div>
    <Board/>
    
</div>

<style>
    :global(body){
        display: flex;
        flex-direction: column;
        margin: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
</style>