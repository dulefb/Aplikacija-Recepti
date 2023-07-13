import { getUser } from "./dbServices";
import { drawLogin, drawSignup, userFilter } from "./drawFunctions";

document.body.onload=()=>{
    userFilter();
}

document.querySelector("a[href='#kreiraj-nalog']").addEventListener("click",()=>{
    let child = document.querySelectorAll(".middle > div");
    //console.log(child);
    if(child!==null){
        child.forEach(x=>{
            document.querySelector(".middle").removeChild(x);
        });
    }
    drawSignup(document.querySelector(".middle"));
});

document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
    let child = document.querySelectorAll(".middle > div");
    //console.log(child);
    if(child!==null){
        child.forEach(x=>{
            document.querySelector(".middle").removeChild(x);
        });
    }
});

document.querySelector("a[href='#prijavi-se']").addEventListener("click",()=>{
    let child = document.querySelectorAll(".middle > div");
    //console.log(child);
    if(child!==null){
        child.forEach(x=>{
            document.querySelector(".middle").removeChild(x);
        });
    }
    drawLogin(document.querySelector(".middle"));
});

document.querySelector("a[href='#odjavi-se']").addEventListener("click",()=>{
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