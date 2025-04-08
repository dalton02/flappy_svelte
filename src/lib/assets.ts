import * as PIXI from 'pixi.js';
import * as PIXIGIF from "pixi.js/gif"
export class Assets{

    app: PIXI.Application

    constructor(app:PIXI.Application){
        this.app = app
            
        PIXI.Assets.addBundle('fonts', [
            { alias: 'Pixel', src: '/fonts/pixel.ttf' },
        ]);
        PIXI.Assets.loadBundle('fonts');

    }

    async gerarPersonagem(skin:string):Promise<PIXIGIF.GifSprite>{
        const texture = await PIXI.Assets.load(`/skins/${skin}.gif`);

        const sprite = new PIXIGIF.GifSprite(texture)

        sprite.width = 20
        sprite.height = 20
        return sprite

    }



    async gerarSlowPower():Promise<PIXI.Sprite>{
        const texture = await PIXI.Assets.load('/bird.png');
        const sprite = new PIXI.Sprite(texture)
        sprite.scale.set(3,3)
        sprite.label="powerSlow"
        return sprite
    }

    async gerarSuperPower():Promise<PIXI.Sprite>{
        const texture = await PIXI.Assets.load('/bird.png');
        const sprite = new PIXI.Sprite(texture)
        sprite.scale.set(3,3)
        sprite.label="powerSuper"
        return sprite
    }


    async gerarTerreno():Promise<PIXI.Sprite>{

        const texture = await PIXI.Assets.load('/terreno.png');
        const sprite = new PIXI.Sprite(texture)

        return sprite

    }

    async gerarCano():Promise<PIXI.Sprite>{

        const texture = await PIXI.Assets.load('/pipe.png');
        const sprite = new PIXI.Sprite(texture)
        sprite.anchor.set(0.5,0)
        sprite.width = 64   
        sprite.height=700

        return sprite
    }

    gerarScoreLayer():PIXI.Text{
        const titulo = this.gerarTexto("Score: 0",32,"white")
        titulo.label="scoreText"
        titulo.x = 20
        titulo.y = 20
        return titulo
    }


    gerarMenuInicial():{
        fundo:PIXI.Graphics,
        botao:PIXI.Graphics,
        titulo: PIXI.Text
    }
    {

        const fundo = this.gerarFundo()
        fundo.label="fundo"
        const botao = this.gerarBotaoStart()
        botao.label="btnStart"
        const titulo = this.gerarTexto("Flappy Bird",64,"white")
        titulo.label="titulo"
        botao.x = this.app.screen.width/2-botao.getBounds().width/2
        botao.y = this.app.screen.height/2-botao.getBounds().height/2

        return{
            fundo,
            botao,
            titulo
        }

    }

    gerarFundo():PIXI.Graphics{

        const graphics = new PIXI.Graphics();
        graphics.rect(0, 0, this.app.screen.width, this.app.screen.height);
        graphics.fill("rgba(0,0,0,.6)");
        return graphics

    }

    gerarBotaoStart():PIXI.Graphics{
        const graphics = new PIXI.Graphics();
        graphics.rect(0, 0, 100, 50);
        graphics.fill("red");
        return graphics


    }

    gerarPassaro(){


    }

    gerarTexto(conteudo:string,tamanho:number,cor:string):PIXI.Text{
        const texto = new PIXI.Text({
            text:conteudo,
            style:{
                fontSize:tamanho,
                fill:cor,
                fontFamily:"Pixel"
            }
        })
        return texto

    }

    gerarBotao(){


    }
    
}