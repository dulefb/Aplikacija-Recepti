import { Subject, auditTime, combineLatest, debounceTime, fromEvent, interval, map, sampleTime, switchMap, take, takeLast, takeUntil } from "rxjs";
import { getUser, getUserWithEmail, getUserWithEmailAndPassword, getVrsteJela } from "./dbServices";
import { User } from "../classes/user";

export function setUpLogin(control$:Subject<string>){
    //must be set up when #prijavi-se is clicked
    //separate in another file
    const user:User=new User(null,null,null,null,null,null,null);

    const password$ = fromEvent(document.querySelector("#userPass"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const email$ = fromEvent(document.querySelector("#userEmail"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const login$=combineLatest([email$,password$])
        .pipe(takeUntil(control$))
        .subscribe(next=>{
            user.email=next[0];
            user.password=next[1];
        });

    fromEvent(document.querySelector("#btnLogin"),"click")
        .pipe(
            switchMap(()=>getUserWithEmailAndPassword(user.email,user.password))
        )
        .subscribe(next=>{
            if(next.length===0){
                alert("Niste uneli ispravne podatke");
            }
            else{
                control$.next("Login complete...");
                control$.complete();
                sessionStorage.setItem("current-user",next[0].email);
                sessionStorage.setItem("current-user-id",next[0].id.toString());
                document.location.reload();
            }
        });
}