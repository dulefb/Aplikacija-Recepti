import { Observable, Subject, filter, from, fromEvent, map, takeUntil, of, switchMap, debounceTime, forkJoin, combineLatest, zip } from "rxjs";
import { Recept } from "../classes/recept";
import { postNewRecept } from "./dbServices";

export function addNewRecept(control$:Subject<string>){

    let recept = new Recept();
    const name$ = addNazivObservable(control$);
    const select$ = addSelectObservable(control$);
    const ingredient$ = addSastojciObservable(control$);
    const priprema$ = addPripremaObservable(control$);
    const image$ = addImageObservable(control$);

    combineLatest([name$,select$,ingredient$,priprema$,image$])
        .pipe(
            takeUntil(control$)
        )
        .subscribe(next=>{
            if(next[0]!=='' && next[1]!=='0' && next[2]!=='' && next[3]!=='' && next[4]!==''){
                recept.naziv=next[0];
                recept.vrsta_jela=parseInt(next[1]);
                recept.sastojci=next[2];
                recept.priprema=next[3];
                recept.slika=next[4];
                recept.autor=parseInt(sessionStorage.getItem("current-user-id"));
                let btn = <HTMLInputElement>document.querySelector(".buttonDodajRecept");
                btn.disabled=false;
            }
            else{
                alert("Morate uneti sve podatke...");
            }
        });

    fromEvent(document.querySelector(".buttonDodajRecept"),"click")
        .pipe(
            switchMap(()=>postNewRecept(recept))
        )
        .subscribe(next=>{
            if(next===true){
                alert("Dodali ste novi recept.");
                let inputs = document.querySelectorAll("input");
                let txt = document.querySelector("textarea");
                let img = document.querySelector("img");
                img.src="";
                inputs.forEach(x=>x.value="");
                txt.value="";
            }
            else{
                alert("Doslo je do greske,pokusajte ponovo.");
            }
        })
}

export function addImageObservable(control$:Subject<string>) : Observable<string>{
    return fromEvent(document.querySelector("#slikaRecept"),"input")
        .pipe(
            map((event: InputEvent) => (<HTMLInputElement>event.target).files[0]),
            switchMap(file=>imageReader(file,control$)),
            takeUntil(control$)
        );
}

function imageReader(file:File,control$:Subject<string>) : Observable<string>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return fromEvent(reader,"load")
            .pipe(
                map(event=>{
                    const src = <string>(<FileReader>event.target).result;
                    setImagePreview(src);
                    return src;
                }),
                takeUntil(control$)
            );
}

export function setImagePreview(fileURI:string){
    const preview = document.querySelector("img");
    preview.src=fileURI;
}

export function addNazivObservable(control$:Subject<string>) : Observable<string>
{
    return fromEvent(document.querySelector("#noviReceptName"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );
}

export function addSelectObservable(control$:Subject<string>) : Observable<string>
{
    return fromEvent(document.querySelector("select"),"change").pipe(
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        filter(value=>parseInt(value)>0),
        takeUntil(control$)
    );
}

export function addSastojciObservable(control$:Subject<string>) : Observable<string>
{
    return fromEvent(document.querySelector("#noviReceptSastojci"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );
}

export function addPripremaObservable(control$:Subject<string>) : Observable<string>
{
    return fromEvent(document.querySelector("#noviReceptPriprema"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );
}