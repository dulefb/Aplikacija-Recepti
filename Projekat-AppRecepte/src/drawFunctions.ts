import { getUserWithEmail, getUserWithEmailAndPassword, getVrsteJela, postUser } from "./dbServices";
import { User } from "../classes/user";
import { filter,Subject } from "rxjs";
import { setUpLogin } from "./loginEvents";
import { setUpSignin } from "./signupEvents";

//default profile image data:image/webp;base64,UklGRnoMAABXRUJQVlA4IG4MAACw8wCdASqEA4QDPm02mUkkIyKhIZyYEIANiWlu/E85ib79trx/+N6LgqJR2lpnhH8S/SVSYC1IL8TonvSQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQICwwEgvxOie9JAgQIECBAgQIECBAgQIECBAgJnEjgpb+4YC1IL8TonvSQIECBAgQIECBAgQIEB8bb8TonvSQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIENjVcdE96SBAgQIECBAgQIECBAgQIECBASF0H40mBOIqjTD+5O3G6M2AuWJHM5UrnMQh5FQCuRwIFlqQX4nRPekgQIECBAgQIECBAfHRQS8mnc8oh2brg0hRAdr5LO+wqOoIW64YC1IL8TonvSQIECBAgQID4m3Mh2X0+m6n+cQnwFfZtj78HNR+2x99ynLly5cuXLly5cuXLly5crUROmV2zpLdcMBZKF6lbJQuie9JAgQIECBAgQIECBAgQElcEFmgt6VX+4Y/Fk9uRSTICaBxPekgQIECBAgQIECBAgQICZAHqZT2IsYS75XxOiezpKoMOYHYdx0T3pIECBAgQIECBAgQH00FXOo7OWie9JAgQF+gffvywnpNJgLUgvxOie9JAgQIEB+BFoTl5OqcuXLly5cI7tmwzqx/E6J70kCBAgQIECBAgQICbI3eQN9bKrHRPekgPg0CD70NUdpynLly5cuXLly5cuXLlwngTb0kCBAgQEzVX9KoCzwwFqQX4nRPekgQIECA+L22gQIECBAgUMWT5Z1pynLly5cuXLly5cuXLlwjahjIXecuXLly5cLXeH17dx0T3pIECBAgQIECBAfHG2kfj9q6rjonvSQEuK/s51Xis6R6TSYC1IL8TonvSQIECBATZfzAI1D9tpAQIECBASMU/tKs8C2mhAR1wwFqQX4nRPekgQHxS1GZqpy5cuXLlYhmnSuM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

function addLinkToClassElement(class_element:string,href:string,class_name:string,text:string) : void{
    const link=document.createElement("a");
    link.href=href;
    link.classList.add(class_name);
    link.innerHTML=text;

    const element = document.querySelector(class_element);
    if(link!==null && element!==null){
        element.appendChild(link);
    }
}

function removeLinkFromClassElement(class_element:string,link_href:string) : void{
    const link = document.querySelector("a[href='"+link_href+"']");
    const element = document.querySelector(class_element);
    if(link!==null && element!==null){
        element.removeChild(link);
    }
}



export function userFilter(){
    let signup = <HTMLElement>document.querySelector("a[href='#kreiraj-nalog']");
    let login = <HTMLElement>document.querySelector("a[href='#prijavi-se']");
    let logoff = <HTMLElement>document.querySelector("a[href='#odjavi-se']");
    let profileLink = <HTMLElement>document.querySelector("a[href='#profil']");
    let currentUser = sessionStorage.getItem("current-user");

    if(currentUser!==null){
        addLinkToClassElement(".header","#novi-recept","header-item","NOVI RECEPT");
        addLinkToClassElement(".header","#profil","header-item","PROFIL");
        addLinkToClassElement(".header","#odjavi-se","header-item","ODJAVI SE");
        removeLinkFromClassElement(".header","#prijavi-se");
        removeLinkFromClassElement(".header","#kreiraj-nalog");
    }
    else{
        addLinkToClassElement(".header","#prijavi-se","header-item","PRIJAVI SE");
        addLinkToClassElement(".header","#kreiraj-nalog","header-item","KREIRAJ NALOG");
        removeLinkFromClassElement(".header","#profil");
        removeLinkFromClassElement(".header","#odjavi-se");
        removeLinkFromClassElement(".header","#novi-recept");
    }

    const kreiraj_nalog = document.querySelector("a[href='#kreiraj-nalog']");
    const control$ = new Subject<string>();
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
            setUpSignin(control$);
        });
    }

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
            sessionStorage.removeItem("current-user-id");
            document.location.reload();
        });
    }
}

export function drawSignup(parent_node:HTMLElement){
    const divSignup = document.createElement("div");
    divSignup.classList.add("divSignup");

    //divSignup labele
    const divSignupLabels = document.createElement("div");
    divSignupLabels.classList.add("divSignupLabels");

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML="Ime:";
    divSignupLabels.appendChild(nameLabel);

    let lnameLabel = document.createElement("label");
    lnameLabel.innerHTML="Prezime:";
    divSignupLabels.appendChild(lnameLabel);

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML="E-mail:";
    divSignupLabels.appendChild(emailLabel);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML="Lozinka:";
    divSignupLabels.appendChild(passwordLabel);

    let cityLabel = document.createElement("label");
    cityLabel.innerHTML="Grad:";
    divSignupLabels.appendChild(cityLabel);

    let dateLabel = document.createElement("label");
    dateLabel.innerHTML="Datum rodjenja:";
    divSignupLabels.appendChild(dateLabel);

    divSignup.appendChild(divSignupLabels);

    //divSignup inputs

    let divSignupInput = document.createElement("div");
    divSignupInput.classList.add("divSignupInput");

    let nameInput = document.createElement("input");
    nameInput.id="signup-name";
    nameInput.type = "name";
    divSignupInput.appendChild(nameInput);

    let lnameInput = document.createElement("input");
    lnameInput.id="signup-lastname";
    lnameInput.type = "name";
    divSignupInput.appendChild(lnameInput);

    let emailInput = document.createElement("input");
    emailInput.id="signup-email";
    emailInput.type = "email";
    divSignupInput.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.id="signup-password";
    passwordInput.type = "password";
    divSignupInput.appendChild(passwordInput);

    let cityInput = document.createElement("input");
    cityInput.id="signup-city";
    cityInput.type = "name";
    divSignupInput.appendChild(cityInput);

    let dateInput = document.createElement("input");
    dateInput.id="signup-date";
    dateInput.type = "date";
    divSignupInput.appendChild(dateInput);

    divSignup.appendChild(divSignupInput);

    parent_node.appendChild(divSignup);

    let divSignupButton = document.createElement("div");
    divSignupButton.classList.add("divSignupButton");

    //odvojiti u loginEvents.ts i dodati event na button
    let button = document.createElement("button");
    button.classList.add("signupButton");
    button.innerHTML="Kreiraj";
    // button.onclick=()=>{
    //     if(nameInput.value==="" &&  lnameInput.value==="" && cityInput.value==="" && emailInput.value==="" && passwordInput.value===""){
    //         alert("Morate da unesete sve podatke...");
    //     }
    //     else{
    //         getUserWithEmail(emailInput.value)
    //             .subscribe(oldUser=>{
    //                 if(oldUser.length>0){
    //                     alert("Korisnik sa ovom email adresom vec postoji,unesite drugu email adresu...");
    //                 }
    //                 else{
    //                     postUser(new User(null,nameInput.value,lnameInput.value,emailInput.value,passwordInput.value,cityInput.value,dateInput.value))
    //                         .subscribe(next=>{
    //                             if(next===true){
    //                                 sessionStorage.setItem("current-user",emailInput.value);
    //                                 document.location.reload();
    //                             }
    //                             else{
    //                                 alert("Greska...pokusaj ponovo...");
    //                             }
    //                         });
    //                 }
    //             });
            
    //     }
    // }
    divSignupButton.appendChild(button);

    parent_node.appendChild(divSignupButton);
}

export function drawLogin(parent_node:HTMLElement){

    let divLogin = document.createElement("div");
    divLogin.classList.add("divLogin");
    
    //login labels
    let divLoginLabels = document.createElement("div");
    divLoginLabels.classList.add("divLoginLabels");

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML="E-mail:";
    divLoginLabels.appendChild(emailLabel);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML="Password:";
    divLoginLabels.appendChild(passwordLabel);

    divLogin.appendChild(divLoginLabels);

    //login inputs

    let divLoginInput = document.createElement("div");
    divLoginInput.classList.add("divLoginInput");

    let emailInput = document.createElement("input");
    emailInput.id="userEmail";
    emailInput.type = "email";
    divLoginInput.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.id="userPass";
    passwordInput.type = "password";
    divLoginInput.appendChild(passwordInput);

    divLogin.appendChild(divLoginInput);

    parent_node.appendChild(divLogin);

    let divLoginButton = document.createElement("div");
    divLoginButton.classList.add("divLoginButton");

    let button = document.createElement("button");
    button.id="btnLogin";
    button.innerHTML="Uloguj se";
    divLoginButton.appendChild(button);

    parent_node.appendChild(divLoginButton);
}

export function drawDropdownList() : void{
    getVrsteJela().subscribe(next=>{
        next.forEach(value=>{
            addLinkToClassElement(".dropdown-content","#"+value.name.toLowerCase().split(" ").reduce((acc,curr)=>acc+curr),"dropdown-content-links",value.name);
        })
    })
}

export function drawNoviRecept(parent_node:HTMLElement) : void{
    let divReceptParent = document.createElement("div");
    divReceptParent.classList.add("divReceptParent");

    let divNazivRecepta = document.createElement("div");
    divNazivRecepta.classList.add("divNazivRecepta");

    let labelNaziv = document.createElement("label");
    labelNaziv.innerHTML="Naziv:";
    divNazivRecepta.appendChild(labelNaziv);

    let inputNaziv = document.createElement("input");
    inputNaziv.type="name";
    inputNaziv.id="noviReceptName";
    divNazivRecepta.appendChild(inputNaziv);

    divReceptParent.appendChild(divNazivRecepta);

    let divVrstaJela = document.createElement("div");
    divVrstaJela.classList.add("divVrstaJela");

    let labelVrstaJela = document.createElement("label");
    labelVrstaJela.innerHTML="Vrsta jela:";
    divVrstaJela.appendChild(labelVrstaJela);

    let selectVrstaJela = document.createElement("select");
    selectVrstaJela.classList.add("divVrstaJelaSelect");
    let selectOption = document.createElement("option");
    selectOption.innerHTML="";
    selectOption.value="0";
    selectVrstaJela.appendChild(selectOption);
    getVrsteJela().subscribe(next=>{
        next.forEach(x=>{
            let selectOption = document.createElement("option");
            selectOption.innerHTML=x.name;
            selectOption.value=x.id.toString();
            selectVrstaJela.appendChild(selectOption);
        })
    });
    divVrstaJela.appendChild(selectVrstaJela);
    divReceptParent.appendChild(divVrstaJela);

    let divSastojci = document.createElement("div");
    divSastojci.classList.add("divSastojci");

    let labelSastojci = document.createElement("label");
    labelSastojci.innerHTML="Sastojci:";
    divSastojci.appendChild(labelSastojci);

    let inputSastojci = document.createElement("input");
    inputSastojci.type="text";
    inputSastojci.id="noviReceptSastojci";
    divSastojci.appendChild(inputSastojci);
    divReceptParent.appendChild(divSastojci);

    let divPriprema = document.createElement("div");
    divPriprema.classList.add("divPriprema");

    let labelPriprema = document.createElement("label");
    labelPriprema.innerHTML="Priprema:";
    divPriprema.appendChild(labelPriprema);

    let inputPriprema = document.createElement("textarea");
    inputPriprema.id="noviReceptPriprema";
    inputPriprema.cols=30;
    inputPriprema.rows=15;
    divPriprema.appendChild(inputPriprema);
    divReceptParent.appendChild(divPriprema);

    let divSlika = document.createElement("div");
    divSlika.classList.add("divSlika");

    let labelSlika = document.createElement("label");
    labelSlika.innerHTML="Dodaj sliku";
    divSlika.appendChild(labelSlika);
    
    let slikaFile = document.createElement("input");
    slikaFile.id="slikaRecept";
    slikaFile.type="file";
    divSlika.appendChild(slikaFile);

    let slikaPreview = document.createElement("img");
    slikaPreview.alt="Image preview";
    slikaPreview.width=150;
    slikaPreview.height=150;
    divSlika.appendChild(slikaPreview);
    divReceptParent.appendChild(divSlika);

    let divButtonDodajRecept = document.createElement("div");
    divButtonDodajRecept.classList.add("divButtonDodajRecept");

    let btnDodajRecept = document.createElement("button");
    btnDodajRecept.innerHTML="Dodaj";
    btnDodajRecept.classList.add("buttonDodajRecept");
    btnDodajRecept.disabled=true;
    divButtonDodajRecept.appendChild(btnDodajRecept);
    divReceptParent.appendChild(divButtonDodajRecept);

    parent_node.appendChild(divReceptParent);
}