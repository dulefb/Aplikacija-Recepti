import { setUpLogin } from "./loginEvents";
import { drawLogin, drawSignup, userFilter, drawDropdownList, drawNoviRecept } from "./drawFunctions";
import { User } from "../classes/user";
import { Subject, interval, switchMap, takeLast, timer } from "rxjs";
import { addNewRecept } from "./newReceptEvents";
import { addObservableForSearch, hideSearchBar, toggleSearchBar, viewRecept } from "./pocetnaEvents";

document.body.onload=()=>{
    userFilter();
    viewRecept();

    document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
        document.location.reload();
    });

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

    toggleSearchBar();
    addObservableForSearch();
    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!(event.target as Element).matches("a[href='recepti']")) {
            const dropdown_container = document.querySelector(".dropdown-content");
            const dropdowns = document.querySelectorAll(".dropdown-content-links");
            if(dropdowns.length > 0)
            {
                dropdowns.forEach(value=>{
                    dropdown_container.removeChild(value);
                });
            }
        }
        if(!(event.target as Element).matches("a[href='#search-input']") && !(event.target as Element).matches("#header-search-input")/* && !(event.target as Element).matches("#search-bar-button")*/){
            hideSearchBar();
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