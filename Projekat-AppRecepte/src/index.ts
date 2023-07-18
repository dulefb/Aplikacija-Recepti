import { Subject, auditTime, combineLatest, debounceTime, fromEvent, interval, map, sampleTime, switchMap, take, takeLast, takeUntil } from "rxjs";
import { getUser, getUserWithEmail, getUserWithEmailAndPassword, getVrsteJela } from "./dbServices";
import { drawLogin, drawSignup, userFilter, drawDropdownList } from "./drawFunctions";
import { User } from "../classes/user";

document.body.onload=()=>{
    userFilter();


    const kreiraj_nalog = document.querySelector("a[href='#kreiraj-nalog']");
    if(kreiraj_nalog!==null){

        kreiraj_nalog.addEventListener("click",()=>{
            let child = document.querySelectorAll(".middle > div");
            //console.log(child);
            if(child!==null){
                child.forEach(x=>{
                    document.querySelector(".middle").removeChild(x);
                });
            }
            drawSignup(document.querySelector(".middle"));
        });
    }

    document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
        let child = document.querySelectorAll(".middle > div");
        //console.log(child);
        if(child!==null){
            child.forEach(x=>{
                document.querySelector(".middle").removeChild(x);
            });
        }
    });

    const prijavi_se = document.querySelector("a[href='#prijavi-se']");
    if(prijavi_se!==null){

        prijavi_se.addEventListener("click",()=>{
            let child = document.querySelectorAll(".middle > div");
            //console.log(child);
            if(child!==null){
                child.forEach(x=>{
                    document.querySelector(".middle").removeChild(x);
                });
            }
            drawLogin(document.querySelector(".middle"));
            setUpLogin();
        });
    }

    const odjavi_se = document.querySelector("a[href='#odjavi-se']");
    if(odjavi_se!==null){

        odjavi_se.addEventListener("click",()=>{
            let child = document.querySelectorAll(".middle > div");
            //console.log(child);
            if(child!==null){
                child.forEach(x=>{
                    document.querySelector(".middle").removeChild(x);
                });
            }
            sessionStorage.removeItem("current-user");
            document.location.reload();
        });
    }

    const recepti = document.querySelector("a[href='#recepti']");
    if(recepti!==null){
        recepti.addEventListener("click",()=>{
            const dropdowns = document.querySelectorAll(".dropdown-content-links");
            const dropdown_container = document.querySelector(".dropdown-content");
            if(dropdowns.length > 0){
                dropdowns.forEach(value=>{
                    dropdown_container.removeChild(value);
                });
            }
            else{
                drawDropdownList();
            }
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!(event.target as Element).matches("a[href='recepti']")) {
            // document.querySelector("#myDropdown").classList.toggle("show");
            const dropdown_container = document.querySelector(".dropdown-content");
            const dropdowns = document.querySelectorAll(".dropdown-content-links");
            if(dropdowns.length > 0)
            {
                dropdowns.forEach(value=>{
                    dropdown_container.removeChild(value);
                });
            }
        }
    }

    
}

function setUpLogin(){
    //must be set up when #prijavi-se is clicked
    //separate in another file
    const control$ = new Subject<string>();
    const user:User=new User(null,null,null,null,null,null,null);

    const password$ = fromEvent(document.querySelector("#userPass"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => {
            console.log((<HTMLInputElement>event.target).value);
            return (<HTMLInputElement>event.target).value
            }),
        takeUntil(control$)
    );

    const email$ = fromEvent(document.querySelector("#userEmail"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => {
            console.log((<HTMLInputElement>event.target).value);
            return (<HTMLInputElement>event.target).value
            }),
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
            map(x=>console.log(x)),
            switchMap(()=>getUserWithEmailAndPassword(user.email,user.password))
        )
        .subscribe(next=>{
            if(next.length===0){
                alert("Niste uneli ispravne podatke");
            }
            else{
                sessionStorage.setItem("current-user",next[0].email);
                document.location.reload();
            }
        });
}