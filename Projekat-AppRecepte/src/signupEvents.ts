import { Subject, fromEvent, debounceTime, map, takeUntil, combineLatest, from, switchMap, delay, Observable } from "rxjs";
import { User } from "../classes/user";
import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";
import { imageReader } from "./newReceptEvents";


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

    const image$ = addImageObservable(control$);

    const combineValue$ = combineLatest([name$,lastname$,email$,password$,city$,date$,image$])
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
                                user.picture=next[6];
                                enableSignup();
                            });
    
    fromEvent(document.querySelector(".signupButton"),"click")
        .pipe(
            switchMap(()=>getUserWithEmail(user.email)),
            delay(500)
        )
        .subscribe(next=>{
            if(next===null){
                alert("Korisnik sa ovom email adresom vec postoji.Pokusajte drugu.");
            }
            else{
                if(user.name===null || user.last_name===null || user.email===null || user.password===null || user.city===null || user.birth_date===null || user.picture===null){
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
                                        console.log(value);
                                        sessionStorage.setItem("current-user",value.email);
                                        document.location.reload();
                                    });
                            }
                            else{
                                alert("Ovaj email je vec zauzet,pokusajte drugi mail.");
                            }
                        });
                }
            }
        });
}

export function addImageObservable(control$:Subject<string>) : Observable<string>{
    return fromEvent(document.querySelector("#signup-image"),"input")
        .pipe(
            map((event: InputEvent) => (<HTMLInputElement>event.target).files[0]),
            switchMap(file=>imageReader(file,control$)),
            takeUntil(control$)
        );
}

function disableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=true;
}

function enableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=false;
}