import { Observable, from, take, takeLast, map, toArray, mergeMap, filter } from "rxjs";
import { User } from "../classes/user";
import { VrsteJela } from "../classes/vrsteJela";
import { Recept } from "../classes/recept";
import { receptiURL, usersURL, vrsta_jelaURL } from "./constants";
import { removeChildren } from "./pocetnaEvents";

export function postUser(user:User) : Observable<boolean | void>{
    // console.log(user);
    let formBody = new URLSearchParams();
    formBody.append('name',user.name);
    formBody.append('last_name',user.last_name);
    formBody.append('email',user.email);
    formBody.append('password',user.password);
    formBody.append('city',user.city);
    formBody.append('birt_date',user.birth_date);
    formBody.append('picture',user.picture);
    const resp=fetch(usersURL,
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                    body: formBody
                }).then(response=>{
                    if(!response.ok){
                        return false;
                    }
                    else{
                        return true;
                    }
                }).catch(err=>console.log(err));

    return from(resp);
}

export function getUser(id:string) : Observable<User>{
    const user = fetch(usersURL+"/"+id,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user).pipe(take(1));
}

export function getUserWithEmail(email:string) : Observable<User>{
    const user = fetch(usersURL+"?email="+email,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user);
}

export function getUserWithEmailAndPassword(email:string,password:string) : Observable<User>{
    const user = fetch(usersURL+"?email="+email+"&password="+password,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user);
}

export function changeUser(user : User) : Observable<boolean | void>{
    let formBody = new URLSearchParams();
    formBody.append('name',user.name);
    formBody.append('last_name',user.last_name);
    formBody.append('email',user.email);
    formBody.append('password',user.password);
    formBody.append('city',user.city);
    formBody.append('birt_date',user.birth_date);
    formBody.append('picture',user.picture);
    const userResp = fetch(usersURL,
                        {
                            method:"PUT",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: formBody
                        }).then(response=>{
                            if(!response.ok){
                                return false;
                            }
                            else{
                                return true;
                            }
                        }).catch(err=>console.log(err));
    
    return from(userResp);                  
}

export function deleteUser(email:string) : Observable<boolean | void>{
    const userResp = fetch(usersURL+"?email="+email,{method:"DELETE"})
                    .then(response=>{
                        if(!response.ok){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }).catch(err=>console.log(err));
    
    return from(userResp);
}

export function getVrsteJela() : Observable<VrsteJela[]>{
    const userResp = fetch(vrsta_jelaURL,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    }).catch(err=>alert(err));
    
    return from(userResp);
}

export function getVrsteJelaWithID(id:string) : Observable<VrsteJela>{
    const userResp = fetch(vrsta_jelaURL+"?id="+id,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    }).catch(err=>alert(err));
    
    return from(userResp).pipe(take(1));
}

export function postNewRecept(recept:Recept) : Observable<boolean | void>{
    let formBody = new URLSearchParams();
    formBody.append('id',"0");
    formBody.append('naziv',recept.naziv);
    formBody.append('sastojci',recept.sastojci);
    formBody.append('priprema',recept.priprema);
    formBody.append('vrste_jela',recept.vrsta_jela);
    formBody.append('slika',recept.slika);
    formBody.append('autor',recept.autor);
    const resp=fetch(receptiURL,
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: formBody
                }).then(response=>{
                    if(!response.ok){
                        return false;
                    }
                    else{
                        return true;
                    }
                }).catch(err=>console.log(err));

    return from(resp);
}

export function deleteRecept(id:number) : Observable<boolean | void>{
    const resp = fetch(receptiURL+"/"+id,{
                    method:"DELETE"/*,
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(recept)*/
                })
                    .then(response=>{
                        if(response.ok){
                            return true;
                        }
                        else{
                            return false;
                        }
                    })
                    .catch(err=>console.log(err));
    return from(resp);
}

export function getAllRecept() : Observable<Recept[]>{
    const resp = fetch(receptiURL,{method:"GET"})
                    .then(response=>{
                        if(response.ok){
                            return response.json();
                        }
                        else{
                            return null;
                        }
                    })
                    .catch(err=>showError(err));
    return from(resp);
}

export function getReceptFromAutor(autor_id:string) : Observable<Recept[]>{
    const resp = fetch(receptiURL+"?autor="+autor_id,{method:"GET"})
                    .then(response=>{
                        if(response.ok){
                            return response.json();
                        }
                        else{
                            return null;
                        }
                    })
                    .catch(err=>console.log(err));
    return from(resp);
}

export function getReceptFromVrstaJela(vrstaJela_id:string) : Observable<Recept[]>{
    const resp = fetch(receptiURL+"?vrsta_jela="+vrstaJela_id,{method:"GET"})
                    .then(response=>{
                        if(response.ok){
                            return response.json();
                        }
                        else{
                            return null;
                        }
                    })
                    .catch(err=>console.log(err));
    return from(resp);
}

export function getReceptWithID(id:number) : Observable<Recept>{
    const resp = fetch(receptiURL+"?id="+id,{method:"GET"})
                    .then(response=>{
                        if(response.ok){
                            return response.json();
                        }
                        else{
                            return null;
                        }
                    })
                    .catch(err=>console.log(err));
    return from(resp).pipe(take(1));
}

function showError(error:any){
    let parent = document.querySelector(".middle");
    removeChildren(parent,document.querySelectorAll(".middle > div"));
    let divError = document.createElement("div");
    divError.classList.add("divError");
    let labelError = document.createElement("label");
    labelError.style.fontSize="larger";
    labelError.innerHTML=error.toString();
    labelError.innerHTML = labelError.innerHTML.concat(". Error 404.");
    divError.appendChild(labelError);
    parent.appendChild(divError);
}