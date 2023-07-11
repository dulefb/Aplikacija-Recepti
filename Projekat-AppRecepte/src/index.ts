import { getUser } from "./dbServices";
import { drawSignup } from "./drawFunctions";

document.querySelector("a[href='#kreiraj-nalog']").addEventListener("click",()=>{
    let child = document.querySelector(".middle > div");
    //console.log(child);
    if(child!==null)
        document.querySelector(".middle").removeChild(child);
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