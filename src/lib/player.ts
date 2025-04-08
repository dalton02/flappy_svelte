import shortUUID from "short-uuid";
import { Assets } from "./assets"
import * as PIXI from 'pixi.js';
import * as PIXIGIF from "pixi.js/gif"


export class Player{

    assetsGen:Assets 

    sprite:PIXIGIF.GifSprite | null = null
    
    world:PIXI.Container = new PIXI.Container({
            width:1280,
            height:720
    })

    layer:PIXI.IRenderLayer = new PIXI.RenderLayer()


    tag: PIXI.Container = new PIXI.Container()
    
    player:{
        nome:string,
        id:number,
        skin:string,
        gametime:number,
        status:string
    } | null = null

    nextPos:{
        x:number,
        y:number,
        rotacao:number
    }={
        x:0,
        y:0,
        rotacao:0,
    }

    cancelarInterpolacao:boolean=false


    constructor(assetsGen:Assets,word:PIXI.Container,layer:PIXI.IRenderLayer,player:{nome:string,id:number,skin:string,status:string,gametime:number}){
        this.player = player
        console.log(player)
        this.assetsGen = assetsGen
        this.layer = layer
        this.tag = this.gerarTag(player.nome)
        assetsGen.gerarPersonagem(player.skin).then(result=>{
            this.sprite=result
            this.sprite.alpha=0.5
            this.world = word
            this.world.addChild(this.sprite)
            this.layer.attach(this.sprite)
            this.world.addChild(this.tag)
            this.layer.attach(this.tag)

        })
    }

    atualizarMovimento(x:number,y:number,rotacao:number){
        this.nextPos = {
            x,
            y,
            rotacao
        }        
    }

    async atualizarSkin(skin:string){
        if(!this.sprite) return
        if(!this.player) return
        if(this.player.skin===skin) return
        this.player.skin = skin
        this.world.removeChild(this.sprite)
        this.layer.detach(this.sprite)
        this.sprite.texture.destroy()
        this.sprite.destroy()
        this.sprite = await this.assetsGen.gerarPersonagem(skin)
        this.world.addChild(this.sprite)
        this.layer.attach(this.sprite)
    }

    gerarTag(nome:string){
        const texto = new PIXI.Text({
            text:nome,
            style:{
                fontSize:14,
                fill:"rgba(255,255,255,1)",
                fontFamily:"Pixel"
            }
        });

        const padding = 10
        const fundo = new PIXI.Graphics().rect(0,0,nome.length*10+padding,20).fill({
            color:"rgba(0,0,0,0)"
        });
        texto.x +=padding
        texto.y += 5
        const container = new PIXI.Container()
        container.addChild(texto)
        container.addChild(fundo)
        return container

    }


    destroy(){
        if(this.sprite)
            this.world.removeChild(this.sprite)
        if(!this.tag) return
        this.world.removeChild(this.tag)

    }



    


}