import * as PIXI from 'pixi.js';
import { Assets } from './assets';
import * as Sound from '@pixi/sound';
import { io } from 'socket.io-client';
import { Player } from './player';
import infoUser from './front.svelte';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export class Game{
    
    app: PIXI.Application = new PIXI.Application()
    stageScene:PIXI.IRenderLayer = new PIXI.RenderLayer() //Cenario de fundo
    stagePipes:PIXI.IRenderLayer = new PIXI.RenderLayer() //Os cano
    stagePlayer:PIXI.IRenderLayer = new PIXI.RenderLayer() //Jogador principal
    stageGhostPlayers:PIXI.IRenderLayer = new PIXI.RenderLayer() //Jogadores fantasmas
    stageGUIStart:PIXI.IRenderLayer = new PIXI.RenderLayer() //Colocar texto,botoes,etc
    stageGUIBoard:PIXI.IRenderLayer = new PIXI.RenderLayer() //Colocar texto,botoes,etc
    stageScore : PIXI.IRenderLayer = new PIXI.RenderLayer()
    ticker: PIXI.Ticker = new PIXI.Ticker
    player:PIXI.Sprite = new PIXI.Sprite(undefined);
    assetGenerator = new Assets(this.app)
    world: PIXI.Container = new PIXI.Container({
        width:1280,
        height:720
    })
    interval:NodeJS.Timeout | null = null 

    jogadores:Player[] = []

    physics = {
        gravity:0.62,
    }
    
    game = {
        currentTime:0,
        start:false,
        menu:false,
        keyDelay:{
            fly:true
        }
    }

    habilitys = {
        jump: 0,
        isDead:false,
        score:0,
        jumpMax:3.1,
        vX:2.5,
        maxVx:4,
        vY:0,
        maxVy:5.5,
        slowPower:false,
        starPower:false
    }
    
    dadosJogador:{
        nome:string,
        id:number
    } | null = null 
    
    socketConnection = new WebSocket("wss://"+PUBLIC_BACKEND_URL+"/upgrade")


    constructor(){
        this.init()

    }

    async cenarioInit(){

        this.app.stage.addChild(this.world);
        this.world.addChild(this.player)
        this.stagePlayer.attach(this.player)
        this.world.addChild(this.stagePipes)
        this.world.addChild(this.stageScene)
        this.world.addChild(this.stagePlayer)
        this.world.addChild(this.stageScore)
        this.world.addChild(this.stageGhostPlayers)
        this.world.addChild(this.stageGUIBoard)
        this.world.addChild(this.stageGUIStart)
        await this.terrenoParallaxGen()
        await this.pipesGen()

        //Score
        const texto = this.assetGenerator.gerarScoreLayer()
        this.world.addChild(texto)
        this.stageScore.attach(texto)

    }

    async resetarPlayer(){
        this.player.x = this.app.screen.width/2 - this.player.width/2
        this.player.y = this.app.screen.height/2-200
        this.habilitys.isDead=false
        this.habilitys.score=0
        this.terrenoParallaxGen()
    }

    async resetarCenario(){
        
        while(this.stagePipes.renderLayerChildren[0]) { 
            this.world.removeChild(this.stagePipes.renderLayerChildren[0]); 
        }
        while(this.stageScene.renderLayerChildren[0]) { 
            this.world.removeChild(this.stageScene.renderLayerChildren[0]); 
        }
     
    }



    async pipesGen(){

        const totalCanos = 60
        const widthCano = 50

        let canos = this.stagePipes.renderLayerChildren.filter((obj)=>obj.label=="cano")
        const tmp = this.stageScene.renderLayerChildren.find(obj=>obj.label==="terreno")
        
        while(canos.length<totalCanos){
            
            const limiteVariacaoSubida = 200
            const ultimoCano = canos[canos.length-1]
            const gap = this.randomIntFromInterval(350,400)
            const variacaoGapCano = this.randomIntFromInterval(175,210)
            const variacaoSubidaCano = this.randomIntFromInterval(80,limiteVariacaoSubida)
            const canoCima = await this.assetGenerator.gerarCano()
            const canoBaixo = await this.assetGenerator.gerarCano()
            const powerSlow = await this.assetGenerator.gerarSlowPower()
            
            

            const xPos = ultimoCano ? ultimoCano.x + gap :  this.app.screen.width

            canoCima.label='cano'
            canoCima.rotation = 3.141593
            canoCima.y= variacaoSubidaCano
            canoCima.x = xPos


            canoBaixo.label='cano'
            canoBaixo.y= variacaoSubidaCano + variacaoGapCano
            canoBaixo.x = xPos

            const hitbox = new PIXI.Graphics().rect(0,0,widthCano/2,variacaoGapCano+canoCima.height).fill("transparent")            
            hitbox.x = canoBaixo.x - hitbox.width/2
            hitbox.y = 100
            hitbox.label="scoreBox"

            const poderAgora = Math.random()*50
            if(poderAgora>46){
                powerSlow.x = canoBaixo.x  + gap/2
                powerSlow.y = canoBaixo.y -  60
                this.world.addChild(powerSlow)
                this.stagePipes.attach(powerSlow)    
            }
            
            this.world.addChild(hitbox)
            this.stagePipes.attach(hitbox)
        
            this.world.addChild(canoCima)
            this.stagePipes.attach(canoCima)

            this.world.addChild(canoBaixo)
            this.stagePipes.attach(canoBaixo)

            canos = this.stagePipes.renderLayerChildren.filter((obj)=>obj.label==="cano")
        }

        this.stagePipes.renderLayerChildren.map((obj)=>{
            if(obj.label!=="cano" && obj.label!=="scoreBox") return obj
            if(obj.x>(-this.world.x-obj.width)  ) return obj
            this.world.removeChild(obj)
        })

    }

    async terrenoParallaxGen(){
        const totalTiles = 12
        let terrenos = this.stageScene.renderLayerChildren.filter((obj)=>obj.label==="terreno")
        while(terrenos.length<totalTiles){
            const sizeTerreno = this.app.screen.width/5
            const terreno = await this.assetGenerator.gerarTerreno()
            terreno.width= sizeTerreno
            terreno.label='terreno'

            terreno.height =150
            terreno.y=this.app.screen.height-terreno.height
            if(terrenos.length>0){
                const ultimoTile = terrenos[terrenos.length-1]
                if(ultimoTile){
                    terreno.x= ultimoTile.x+ultimoTile.width
                }
            }
            else{
                terreno.x=0
            }
            this.world.addChild(terreno)

            this.stageScene.attach(terreno)

            terrenos = this.stageScene.renderLayerChildren.filter((obj)=>obj.label==="terreno")
        }
        
        this.stageScene.renderLayerChildren.filter((obj)=>{
            if(obj.label!=="terreno") return obj
            if(obj.x>-this.world.x-obj.width) return obj
            this.world.removeChild(obj)
        })

    }

    async init(){
        
        const canvaDiv = document.querySelector(".game") as HTMLElement
        
        await this.app.init({ background: '#1099bb',resizeTo:canvaDiv});
        
        canvaDiv!.appendChild(this.app.canvas);

        Sound.sound.add('flap', '/sons/flap.mp3');
        Sound.sound.add('hit', '/sons/hit.mp3');
        Sound.sound.add('die', '/sons/die.mp3');
        Sound.sound.add('point','/sons/point.mp3');
        
        this.player = await this.assetGenerator.gerarPersonagem()    
        this.sock()
        this.resetarPlayer()        
        await this.cenarioInit()

        
        this.interval = setInterval(()=>{
            if(!this.dadosJogador) return
            this.socketConnection.send(mensagemFormatada("atualizarPlayer",{
                coordenadas:{
                    x: this.player.x,
                    y: this.player.y,
                    rotacao:this.player.rotation
                },
                id:this.dadosJogador.id,
                nome:this.dadosJogador.nome,
                pontuacao: this.habilitys.score
            }))    
        },200)


        this.app.ticker.add(async(t) => {        
            this.ticker = t
            await this.guiMan()
            await this.gameLoop()
        })    
    }

    async guiMan(){
        if(infoUser.info.freezeGame===false){
            this.game.start=true
        }
    }

    async gameLoop(){
            
        if(infoUser.info.freezeGame===false){
            if(!this.habilitys.isDead && this.game.start){
                this.movimento()
                await this.terrenoParallaxGen()
                await this.pipesGen()
                await this.checarColisoes()
            }
            
            if(this.game.start){
                this.puloGravidade()
            }        
        }

    }

    sock(){

        this.socketConnection.onmessage = (m) => {

            const conteudo = JSON.parse(m.data) as {tipo:string,conteudo:any}
            console.log(conteudo)

            if(conteudo.tipo==="conectado"){
                

            }

            else if(conteudo.tipo==="listaAtualizada"){

                const tmp = conteudo.conteudo as {
                jogadores:{
                    id:number,
                    nome:string,
                    coordenadas:{
                        x:number,
                        y:number,
                        rotacao:number,
                    }
                }[],
                mensagem:string
                }
                const dados = tmp.jogadores
                for(const dado of dados){
                    if(dado.id===this.dadosJogador!.id) continue
    
                    if(!this.jogadores.some(obj=>obj.player!.id===dado.id)){
                        const novoJogador = new Player(this.assetGenerator, this.world, this.stageGhostPlayers, dado)
                        this.jogadores.push(novoJogador);
                    }
                }
                
                //Remover jogadores que sairão da partida 
                this.jogadores = this.jogadores.filter((obj)=>{
                    if(!dados.some(obj2=>obj2.id===obj.player!.id)){
                        obj.destroy()
                        return false
                    }
                    return true
                })
                console.log("Jogadores do cliente: ",this.jogadores)
                
                this.jogadores.forEach((obj)=>{
                    dados.forEach(obj2=>{
                        if(obj2.id===obj.player!.id){
                            obj.atualizarMovimento(obj2.coordenadas.x,obj2.coordenadas.y,obj2.coordenadas.rotacao)
                        }
                    })
                })


            }



        }

   }

   movimento(){
       
        const increaseSpeed = 0.0001
        this.game.currentTime+=this.ticker.elapsedMS*increaseSpeed
       
        if(this.habilitys.slowPower){

            this.player.x+=1.7


        }
        else{

            const velocidade = this.habilitys.vX+(this.game.currentTime) > this.habilitys.maxVx ? this.habilitys.maxVx  : this.habilitys.vX+(this.game.currentTime)       
            this.player.x+=velocidade
                
        }
       
        this.world.x = -(this.player.x - this.app.screen.width/2)
        const texto = this.stageScore.renderLayerChildren[0] as PIXI.Text
        texto.x = -this.world.x +20
        texto.text = "Score: "+this.habilitys.score
    }

    async checarColisoes(){

        const xP = this.player.getBounds().x
        const yP = this.player.getBounds().y
        const wP = this.player.getBounds().width
        const hP = this.player.getBounds().height

        const allLayers = [...this.stagePipes.renderLayerChildren,...this.stageScene.renderLayerChildren]

        allLayers.forEach((obj)=>{
            const xO = obj.getBounds().x
            const yO = obj.getBounds().y
            const wO = obj.getBounds().width
            const hO = obj.getBounds().height
            
            if (xP + wP > xO &&    // Lado direito do player passa o lado esquerdo do objeto
                xP < xO + wO &&    // Lado esquerdo do player antes do lado direito do objeto
                yP + hP > yO &&    // Base do player passa o topo do objeto
                yP < yO + hO) {    // Topo do player antes da base do objeto
                

                if(obj.label==="powerSlow"){
                    this.habilitys.slowPower=true
                    setTimeout(()=>{
                        this.habilitys.slowPower=false
                    },2000)
                }

                if(obj.label==="powerSuper"){
                    this.habilitys.score+=5
                }

                if (obj.label === "cano" || obj.label==="terreno") {
                    this.habilitys.isDead=true
                    this.game.currentTime=0
                    Sound.sound.play('hit');
                    setTimeout(()=>{
                        Sound.sound.play('die');
                    },500)
                    setTimeout(()=>{
                        infoUser.info.freezeGame=true
                        this.resetarPlayer()
                        this.resetarCenario()
                    },1000)
                }
                
                if(obj.label==="scoreBox"){

                    Sound.sound.play('point');
                    this.habilitys.score +=1
                    this.world.removeChild(obj)
                    return
                }

            }

        })
    }


    async puloGravidade(){
        const rotationForce = 0.09;
        const limitRotation = 0.8



        this.habilitys.vY += this.physics.gravity;
        this.habilitys.vY -= this.habilitys.jump;

        this.habilitys.vY = this.habilitys.maxVy<this.habilitys.vY ? this.habilitys.maxVy : this.habilitys.vY
        
        this.habilitys.vY = -this.habilitys.maxVy>this.habilitys.vY ? -this.habilitys.maxVy : this.habilitys.vY
        

        if(this.player.rotation>limitRotation){
            this.player.rotation = limitRotation
        }
        if(this.player.rotation<-limitRotation){
            this.player.rotation = -limitRotation
        }
        
        if(this.habilitys.vY>0){
            this.player.rotation+=rotationForce
        }
        else{
            this.player.rotation-=rotationForce

        }

 
        if(this.habilitys.isDead){
            this.player.y += this.physics.gravity*20;
            return
        }


        if(this.habilitys.jump>0){
            this.habilitys.jump-=this.physics.gravity/2;
            if(this.habilitys.jump<0) this.habilitys.jump=0; 
        }
        this.player.y += this.habilitys.vY;
        

    }

    //Keys
    keyRightActions(){
    }
    
    keyLeftActions(){
    }
    
    keyUpActions(){

    }
    
    keyRightRelease(){
    }
    
    keyLeftRelease(){
    }
    
    keyUpRelease () {
                //Pulo
                if(!this.game.keyDelay.fly || this.habilitys.isDead || !this.game.start){
                    return
                }
                this.habilitys.jump=this.habilitys.jumpMax
                Sound.sound.play('flap');
                this.game.keyDelay.fly=false
                setTimeout(()=>{
                    this.game.keyDelay.fly=true
                },2)
    }


    randomIntFromInterval(min:number, max:number) {  
        return Math.random() * (max - min + 1) + min;
    }
      
}




const mensagemFormatada = (tipo:string,conteudo:Record<string,any>) => {
    return JSON.stringify({
        tipo:tipo,
        conteudo:conteudo
    })
}