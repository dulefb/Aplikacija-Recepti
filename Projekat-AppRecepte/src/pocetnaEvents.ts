import { fromEvent, map, switchMap, scan, take, Observable,zip, from, Subject, combineLatest, takeUntil, forkJoin, delay } from "rxjs";
import { numberOfTakes } from "./constants";
import { getAllRecept, getReceptFromVrstaJela, getReceptWithID, getUser, getVrsteJela, getVrsteJelaWithID } from "./dbServices";
import { Recept } from "../classes/recept";
import { User } from "../classes/user";
import { VrsteJela } from "../classes/vrsteJela";
import { drawReceptPage } from "./drawFunctions";

export function viewRecept(){
    
    let parent_node = <HTMLElement> document.querySelector(".middle");

    let divReceptParent = document.createElement("div");
    divReceptParent.classList.add("divReceptDrawParent");
    parent_node.appendChild(divReceptParent);
    
    let divReceptMoreButton = document.createElement("div");
    divReceptMoreButton.classList.add("divReceptMoreButton");

    let button = document.createElement("button");
    button.id="buttonPrikaziJos";
    button.innerHTML="Prikazi jos";
    divReceptMoreButton.appendChild(button);
    parent_node.appendChild(divReceptMoreButton);

    addFirstRecept(divReceptParent);

    const click$ = fromEvent(button,"click");

    const takingValue$ = click$.pipe(
                                map(()=>numberOfTakes),
                                scan((acc,current)=>acc+current,numberOfTakes)
                                );

    const recept$ = click$.pipe(
                            switchMap(()=>getAllRecept())
                            );

    zip([takingValue$,recept$])
        .subscribe(next=>{
            removeChildren(divReceptParent,document.querySelectorAll(".divRecept"));

            let niz = next[1].reverse().slice(0,next[0]);
            niz.forEach(x=>{
                drawRecepte(divReceptParent,x.slika,x.naziv,x.id,x.autor,x.vrsta_jela);
            });
        });

}

export function removeChildren(parent:Node,child:NodeListOf<Element>){
    if(child!==null){
        child.forEach(x=>{
            parent.removeChild(x);
        });
    }
}

function addFirstRecept(parent:HTMLElement){
    getAllRecept()
        .subscribe(next=>{
            next.reverse().slice(0,numberOfTakes).forEach(x=>{
                drawRecepte(parent,x.slika,x.naziv,x.id,x.autor,x.vrsta_jela);
            })
        });
}

export function drawRecepte(parent_node:HTMLElement,slikaSrc:string,nazivRecepta:string,id_value:number,id_autor:number,id_vrstaJela:number) : void{

    let divRecept = document.createElement("div");
    divRecept.classList.add("divRecept");

    let divReceptSlika = document.createElement("div");
    divReceptSlika.classList.add("divReceptSlika");
    let image = document.createElement("img");
    image.src=slikaSrc;
    image.alt="Image";
    divReceptSlika.appendChild(image);
    divRecept.appendChild(divReceptSlika);

    let divReceptName = document.createElement("div");
    divReceptName.classList.add("divReceptName");
    let labelName = document.createElement("label");
    labelName.classList.add("divReceptLabelName");
    labelName.innerHTML=nazivRecepta;
    divReceptName.appendChild(labelName);
    divRecept.appendChild(divReceptName);

    let local_recept = new Recept();
    let local_autor = new User(null,null,null,null,null,null,null);
    let local_vrstaJela = new VrsteJela(null,null);

    const recept$ = getObservableFromReceptClick(divRecept)
            .pipe(
                switchMap(()=>getReceptWithID(id_value))
            );

    const autor$ = getObservableFromReceptClick(divRecept)
            .pipe(
                switchMap(()=>getUser(id_autor))
            );
    const vrsteJela$ = getObservableFromReceptClick(divRecept)
            .pipe(
                switchMap(()=>getVrsteJelaWithID(id_vrstaJela))
            );

    zip([recept$,autor$,vrsteJela$])
        .subscribe(next=>{
            local_recept=next[0];
            local_autor=next[1];
            local_vrstaJela=next[2];
            drawReceptPage(local_recept,local_autor,local_vrstaJela);
        });

    parent_node.appendChild(divRecept);
}

export function addObservableToVrsteRecepta(link_element:HTMLElement,event:string,id_value:number) : void{
    fromEvent(link_element,event)
        .pipe(
            switchMap(()=>getReceptFromVrstaJela(id_value))
        )
        .subscribe(next=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));

            let divReceptFromVrstaJela = document.createElement("div");
            divReceptFromVrstaJela.classList.add("divReceptFromVrstaJela");
            next.forEach(el=>{
                console.log(el);
                drawRecepte(divReceptFromVrstaJela,el.slika,el.naziv,el.id,el.autor,el.vrsta_jela);
            });
            document.querySelector(".middle").appendChild(divReceptFromVrstaJela);
        })
}

function getObservableFromReceptClick(element:HTMLElement) : Observable<any>{
    return fromEvent(element,"click");
}

export function toggleSearchBar(){
    let link = <HTMLLinkElement> document.querySelector("a[href='#search-input']");
    link.onclick=()=>{
        let div = <HTMLDivElement> document.querySelector("#search-bar-dropdown-show");
        div.classList.toggle("hideDisplay");
    }
}

export function hideSearchBar(){
    let div = <HTMLDivElement> document.querySelector("#search-bar-dropdown-show");
    div.classList.toggle("hideDisplay",true);
}

export function addObservableForSearch(){
    const input$ = fromEvent(document.querySelector("#header-search-input"),"input");
}