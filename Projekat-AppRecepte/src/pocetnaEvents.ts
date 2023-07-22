import { fromEvent, map, switchMap, scan, take, Observable,zip, from } from "rxjs";
import { numberOfTakes } from "./constants";
import { getAllRecept } from "./dbServices";
import { Recept } from "../classes/recept";

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

            let niz = next[1].slice(0,next[0]);
            niz.forEach(x=>{
                drawRecepte(divReceptParent,x.slika,x.naziv);
            });
        });

}

function removeChildren(parent:Node,child:NodeListOf<Element>){
    if(child!==null){
        child.forEach(x=>{
            parent.removeChild(x);
        });
    }
}

function addFirstRecept(parent:HTMLElement){
    getAllRecept()
        .subscribe(next=>{
            next.slice(0,numberOfTakes).forEach(x=>{
                drawRecepte(parent,x.slika,x.naziv);
            })
        });
}

function drawRecepte(parent_node:HTMLElement,slikaSrc:string,nazivRecepta:string) : void{

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

    parent_node.appendChild(divRecept);
}