import { getUserWithEmail, getUserWithEmailAndPassword, getVrsteJela, postUser } from "./dbServices";
import { User } from "../classes/user";
import { filter,Subject } from "rxjs";
import { setUpLogin } from "./loginEvents";
import { setUpSignin } from "./signupEvents";
import { addObservableToRecept } from "./pocetnaEvents";

function addLinkToClassElement(class_element:string,href:string,class_name:string,text:string,id_value:number=0) : void{
    const link=document.createElement("a");
    link.href=href;
    link.classList.add(class_name);
    link.innerHTML=text;

    if(class_name==="dropdown-content-links"){
        addObservableToRecept(link,"click",id_value);
    }

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
            addLinkToClassElement(".dropdown-content","#"+value.name.toLowerCase().split(" ").reduce((acc,curr)=>acc+curr),"dropdown-content-links",value.name,value.id);
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