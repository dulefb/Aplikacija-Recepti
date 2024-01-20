import { User } from "./user";
import { VrsteJela } from "./vrsteJela";

export class Recept{
    id:number;
    naziv:string;
    autor:string;
    vrsta_jela:string;
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
}