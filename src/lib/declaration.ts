

class Declarate{


    initVx:number = 2.5
    maxVx:number = 4
    acc: number = 0.1 // por segundo


    calculateSpeed(currentTime:number){
        return this.initVx+(currentTime*this.acc) > this.maxVx ? this.maxVx  : this.initVx+(currentTime*this.acc)       
    }

    

}


const declarator = new Declarate()
export default declarator