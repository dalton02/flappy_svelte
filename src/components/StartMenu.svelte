<script lang="ts">
	import infoUser from "$lib/front.svelte";
	import axios, { AxiosError } from "axios";


	import Button from "./Button.svelte";
	import ButtonArrow from "./ButtonArrow.svelte";
	import { PUBLIC_BACKEND_COMPLETE_URL, PUBLIC_BACKEND_URL } from "$env/static/public";
	import toast from "$lib/utils/toast.svelte";
	import SvgCheck from "./svg/SvgCheck.svelte";

    let {onLogin}:{onLogin:(r:{id:number,nome:string})=>void} = $props()

    let modo = $state<"login" | "cadastro" | "menu" | "skin">("menu")

    const skins = [
        {
            value:"base",
            icon:"/bird.png"
        }
    ]

    let formCadastro = $state({
        nome:"",
        senha:""
    })

    let formLogin = $state({
        nome:"",
        senha:""
    })

    async function cadastrar(){
        if(formCadastro.nome.length===0){
            return alert("Insira seu nome fiote")
        }
        if(formCadastro.senha.length===0){
            return  alert("Parem de testar o sistema")
        }
        try{
            await axios.post(PUBLIC_BACKEND_COMPLETE_URL+"/auth/cadastro",formCadastro)
            modo="menu"
        }
        catch(err){
            const error = err as any
            toast.error("Notificação do sistema",error.response.data.message)

        }
    }


    async function logar(){
        if(formLogin.nome.length===0){
            return alert("Insira seu nome fiote")
        }
        if(formLogin.senha.length===0){
            return  alert("Parem de testar o sistema")
        }
        try{
            const response = await axios.post(PUBLIC_BACKEND_COMPLETE_URL+"/auth/login",formLogin)
            modo="menu"
            infoUser.info.logado=true
            onLogin(response.data.data)
        }
        catch(err){
            const error = err as any
            toast.error("Notificação do sistema",error.response.data.message)
        }
    }
</script>

<div class="flex flex-col justify-center gap-12 items-center text-white w-full h-full bg-[rgba(0,0,0,.4)]">


    {#if modo!=="menu"}
    <div class="absolute top-[12px] left-0">
        <ButtonArrow  onClick={()=>modo="menu"}/>
    </div>
    {/if}

    <h1 class="text-[62px] font-medium">
        Flappy Multiplayer
    </h1>    
    
    
    <div class="flex flex-col gap-4">
    
        {#if modo==="menu"}
        
        {#if infoUser.info.logado}

            <Button onClick={()=>infoUser.info.freezeGame=false}> 
                Play
            </Button>

            <Button onClick={()=>modo="skin"}> 
                Trocar Skin
            </Button>


        {:else}

            <Button onClick={()=>modo="login"}> 
                Logar
            </Button>
            <Button onClick={()=>modo="cadastro"}> 
                Cadastrar
            </Button>

        {/if}
        {:else if modo==="skin"}
            <div class="grid grid-cols-3 gap-x-4">
                {#each skins as skin}
                    <button class="flex items-center justify-center group w-[120px] relative
                    aspect-square rounded-lg hover:bg-amber-50 bg-emerald-300 border-4 border-black" onclick={()=>{}}>
                        {#if skin.value===infoUser.info.skin}
                            <div class="rounded-full absolute top-[-12px] right-[-10px] bg-black">
                                <SvgCheck props={{
                                    width:26,
                                    height:26,
                                    class:""
                                }}/>    
                            </div>
                        {/if}
                        <img src="/bird.png" class="group-hover:scale-[1.2] transition-all duration-200 w-[50px]" alt="">
                    </button>
                {/each}
            </div>

        {:else if modo==="cadastro"}

            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                    Usuário
                    <input type="text" class="w-full rounded-[10px] text-gray-900" bind:value={formCadastro.nome} placeholder="Ex: Joãozinho">
                </div>
                <div class="flex flex-col gap-1">
                    Senha
                    <input type="text" class="w-full rounded-[10px]  text-gray-900" bind:value={formCadastro.senha} placeholder="Ex: SenhaMuitoForte123">
                </div>
            </div>

            <div class="flex gap-2 items-center">
                <Button onClick={cadastrar}> 
                    Cadastrar
                </Button>
    
            </div>

        {:else if modo==="login"}

            
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                    Usuário
                    <input type="text" class="w-full rounded-[10px] text-gray-900" bind:value={formLogin.nome} placeholder="Ex: Joãozinho">
                </div>
                <div class="flex flex-col gap-1">
                    Senha
                    <input type="text" class="w-full rounded-[10px]  text-gray-900"  bind:value={formLogin.senha} placeholder="Ex: SenhaMuitoForte123">
                </div>
            </div>

            <Button onClick={logar}> 
                Logar
            </Button>


        {/if}

    </div>

</div>