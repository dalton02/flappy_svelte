import shortUUID from "short-uuid";
import { Assets } from "./assets"
import * as PIXI from 'pixi.js';

export class Player{

    assetsGen:Assets 

    sprite:PIXI.Sprite | null = new PIXI.Sprite()
    
    world:PIXI.Container = new PIXI.Container({
            width:1280,
            height:720
    })

    tag: PIXI.Container = new PIXI.Container()
    player:{
        nome:string,
        id:number
    } | null = null

    constructor(assetsGen:Assets,word:PIXI.Container,layer:PIXI.IRenderLayer,player:{nome:string,id:number}){
        this.player = player
        this.assetsGen = assetsGen
        this.tag = this.gerarTag(player.nome)
        assetsGen.gerarPersonagem().then(result=>{
            this.sprite=result
            this.sprite.alpha=0.5
            this.world = word
            this.world.addChild(this.sprite)
            layer.attach(this.sprite)
            this.world.addChild(this.tag)
            layer.attach(this.tag)

        })
    }

    atualizarMovimento(x:number,y:number,rotacao:number){
        if(this.sprite===null) return        
        this.sprite.x=x;
        this.sprite.y=y;
        this.sprite.rotation = rotacao
        if(this.tag===null) return        

        const xPosTag = x - this.tag.width/2 + this.sprite.width/2 
        const yPosTag = y - this.tag.height - 10 

        this.tag.x=xPosTag;
        this.tag.y=yPosTag;


        
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