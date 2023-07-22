import { setUpLogin } from "./loginEvents";
import { drawLogin, drawSignup, userFilter, drawDropdownList, drawNoviRecept } from "./drawFunctions";
import { User } from "../classes/user";
import { Subject, interval, switchMap, takeLast, timer } from "rxjs";
import { addImageObservable, addNewRecept, setImagePreview } from "./newReceptEvents";
import { deleteRecept, getAllRecept } from "./dbServices";
import { viewRecept } from "./pocetnaEvents";

document.body.onload=()=>{
    userFilter();
    viewRecept();

    // document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
    // document.reload();
    // });

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
    const receptControl$ = new Subject<string>();
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
            addNewRecept(receptControl$);
        });
    }
}