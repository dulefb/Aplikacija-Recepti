import { fromEvent, switchMap, zip } from "rxjs";
import { getReceptFromAutor, getUser, getUserWithEmail } from "./dbServices";
import { drawUserProfile } from "./drawFunctions";
import { drawRecepte, removeChildren } from "./pocetnaEvents";

export function viewUserProfile(user_email:string,event:HTMLElement) : void{
    const user$ = fromEvent(event,"click")
                    .pipe(
                        switchMap(()=>getUserWithEmail(user_email))
                    );
    const recept$ = fromEvent(event,"click")
                    .pipe(
                        switchMap(()=>getReceptFromAutor(user_email))
                    );
    
    const user = zip([user$,recept$])
                    .subscribe(next=>{
                        removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
                        let userValue = next[0];
                        let userRecepti = next[1].reverse();
                        let divReceptDraw = drawUserProfile(userValue);
                        userRecepti.forEach(x=>{
                            drawRecepte(divReceptDraw,x.slika,x.naziv,x.id,userValue.email,x.vrsta_jela);
                        })

                    })

}