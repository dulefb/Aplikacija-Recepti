import { User } from "./user";
import { VrsteJela } from "./vrsteJela";

export class Recept{
    id:number;
    naziv:string;
    autor:number;
    vrsta_jela:number;
    sastojci:string;
    priprema:string;
    slika:string;
    
    constructor(){
        this.naziv=null;
        this.autor=null;
        this.vrsta_jela=null;
        this.sastojci=null;
        this.priprema=null;
        this.slika=null;
    }

    drawRecept(parent_node:HTMLElement){
        let divRecept = document.createElement("div");
        
    }
}