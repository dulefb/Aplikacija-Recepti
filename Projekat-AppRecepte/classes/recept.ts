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

    constructor(naziv:string,autor:number,vrsta_jela:number,sastojci:string,priprema:string,slika:string){
        this.naziv=naziv;
        this.autor=autor;
        this.vrsta_jela=vrsta_jela;
        this.sastojci=sastojci;
        this.priprema=priprema;
        this.slika=slika;
    }
}