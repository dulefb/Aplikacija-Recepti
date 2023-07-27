import { fromEvent, switchMap, zip } from "rxjs";
import { getReceptFromAutor, getUser } from "./dbServices";
import { drawUserProfile } from "./drawFunctions";
import { drawRecepte, removeChildren } from "./pocetnaEvents";

export function viewUserProfile(user_id:number,event:HTMLElement) : void{
    const user$ = fromEvent(event,"click")
                    .pipe(
                        switchMap(()=>getUser(user_id))
                    );
    const recept$ = fromEvent(event,"click")
                    .pipe(
                        switchMap(()=>getReceptFromAutor(user_id))
                    );
    
    const user = zip([user$,recept$])
                    .subscribe(next=>{
                        removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
                        let userValue = next[0];
                        let userRecepti = next[1].reverse();
                        let divReceptDraw = drawUserProfile(userValue);
                        userRecepti.forEach(x=>{
                            drawRecepte(divReceptDraw,x.slika,x.naziv,x.id,userValue.id,x.vrsta_jela);
                        })

                    })

}