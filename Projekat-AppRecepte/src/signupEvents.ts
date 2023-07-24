import { Subject, fromEvent, debounceTime, map, takeUntil, combineLatest, from, switchMap, delay } from "rxjs";
import { User } from "../classes/user";
import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";


export function setUpSignin(control$:Subject<string>){

    const user = new User(null,null,null,null,null,null,null);
    disableSignup();
    const name$ = fromEvent(document.querySelector("#signup-name"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const lastname$ = fromEvent(document.querySelector("#signup-lastname"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const email$ = fromEvent(document.querySelector("#signup-email"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const password$ = fromEvent(document.querySelector("#signup-password"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const city$ = fromEvent(document.querySelector("#signup-city"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const date$ = fromEvent(document.querySelector("#signup-date"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const combineValue$ = combineLatest([name$,lastname$,email$,password$,city$,date$])
                            .pipe(
                                takeUntil(control$)
                            )
                            .subscribe(next=>{
                                user.name=next[0];
                                user.last_name=next[1];
                                user.email=next[2];
                                user.password=next[3];
                                user.city=next[4];
                                user.birth_date=next[5];
                                enableSignup();
                            });
    
    fromEvent(document.querySelector(".signupButton"),"click")
        .pipe(
            switchMap(()=>getUserWithEmail(user.email)),
            delay(500)
        )
        .subscribe(next=>{
            if(next.length>0){
                alert("Korisnik sa ovom email adresom vec postoji.Pokusajte drugu.");
            }
            else{
                if(user.name===null || user.last_name===null || user.email===null || user.password===null || user.city===null || user.birth_date===null){
                    alert("Morate da unesete sve podatke");
                }
                else{
                    postUser(user)
                        .subscribe(newUser=>{
                            if(newUser===true){
                                alert("Uspesno registrovnje.");
                                control$.next("Login complete...");
                                control$.complete();
                                getUserWithEmailAndPassword(user.email,user.password)
                                    .subscribe(value=>{
                                        sessionStorage.setItem("current-user-id",value[0].id.toString());
                                        sessionStorage.setItem("current-user",value[0].email);
                                        document.location.reload();
                                    });
                            }
                            else{
                                alert("Doslo je do greske,pokusajte ponovo...");
                            }
                        });
                }
            }
        });
}

function disableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=true;
}

function enableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=false;
}