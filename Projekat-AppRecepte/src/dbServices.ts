import { Observable, from, take, takeLast, map } from "rxjs";
import { User } from "../classes/user";
import { VrsteJela } from "../classes/vrsteJela";
import { Recept } from "../classes/recept";

export function postUser(user:User) : Observable<boolean | void>{
    console.log(user);
    const resp=fetch("http://localhost:3000/users",
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
    const user = fetch("http://localhost:3000/users/"+id,{method:"GET"})
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
    const user = fetch("http://localhost:3000/users?email="+email,{method:"GET"})
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
    const user = fetch("http://localhost:3000/users?email="+email+"&password="+password,{method:"GET"})
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
    const userResp = fetch("http://localhost:3000/users",
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
    const userResp = fetch("http://localhost:3000/users/"+id,{method:"DELETE"})
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
    const userResp = fetch("http://localhost:3000/vrsta-jela",{method:"GET"})
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
    const resp=fetch("http://localhost:3000/recept",
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
    let recept=new Recept();
    recept.id=id;
    const resp = fetch("http://localhost:3000/recept/"+id,{
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
    const resp = fetch("http://localhost:3000/recept",{method:"GET"})
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
    const resp = fetch("http://localhost:3000/recept?autor="+autor_id,{method:"GET"})
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
    const resp = fetch("http://localhost:3000/recept?autor="+vrstaJela_id,{method:"GET"})
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