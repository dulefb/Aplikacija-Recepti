import { setUpLogin } from "./loginEvents";
import { drawLogin, drawSignup, userFilter, drawDropdownList, drawNoviRecept } from "./drawFunctions";
import { User } from "../classes/user";
import { Subject } from "rxjs";

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
    const login$ = new Subject<string>();
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
            setUpLogin(login$);
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

    const novi_recept = document.querySelector("a[href='#novi-recept']");
    if(novi_recept!==null){

        novi_recept.addEventListener("click",()=>{
            let child = document.querySelectorAll(".middle > div");
            //console.log(child);
            if(child!==null){
                child.forEach(x=>{
                    document.querySelector(".middle").removeChild(x);
                });
            }
            drawNoviRecept(document.querySelector(".middle"));
        });
    }
}