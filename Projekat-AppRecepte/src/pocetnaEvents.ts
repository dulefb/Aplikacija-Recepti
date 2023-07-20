import { fromEvent, map, switchMap, scan, take, Observable,zip } from "rxjs";
import { numberOfTakes } from "./constants";
import { getAllRecept } from "./dbServices";
import { Recept } from "../classes/recept";

export function viewRecept(){
    const click$ = fromEvent(document.querySelector("#buttonPrikaziJos"),"click");

    const takingValue$ = click$.pipe(
                                map(()=>numberOfTakes),
                                scan((acc,current)=>acc+current,0)
                                );

    const recept$ = click$.pipe(
                            switchMap(()=>getAllRecept())
                            );

    zip([takingValue$,recept$])
        .subscribe(next=>{
            console.log(next[1].slice(0,next[0]));
        });
}

