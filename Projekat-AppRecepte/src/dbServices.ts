import { Observable, from, take, takeLast, map } from "rxjs";
import { User } from "../classes/user";
import { VrsteJela } from "../classes/vrsteJela";
import { Recept } from "../classes/recept";
import { receptiURL, usersURL, vrsta_jelaURL } from "./constants";

export function postUser(user:User) : Observable<boolean | void>{
    console.log(user);
    const resp=fetch(usersURL,
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(user)
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

export function getUser(id:number) : Observable<User[]>{
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
    
    return from(user);
}

export function getUserWithEmail(email:string) : Observable<User[]>{
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

export function getUserWithEmailAndPassword(email:string,password:string) : Observable<User[]>{
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
    const userResp = fetch(usersURL,
                        {
                            method:"PUT",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(user)
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

export function deleteUser(id:number) : Observable<boolean | void>{
    const userResp = fetch(usersURL+"/"+id,{method:"DELETE"})
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

export function postNewRecept(recept:Recept) : Observable<boolean | void>{
    const resp=fetch(receptiURL,
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(recept)
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
                    .catch(err=>console.log(err));
    return from(resp);
}

export function getReceptFromAutor(autor_id:number) : Observable<Recept[]>{
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

export function getReceptFromVrstaJela(vrstaJela_id:number) : Observable<Recept[]>{
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
    const resp = fetch(receptiURL+"/"+id,{method:"GET"})
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