import { Observable, from } from "rxjs";
import { User } from "../classes/user";

export function postUser(user:User) : Observable<boolean | void>{
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

export function getUser(id:number) : Observable<User>{
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

export function getUserWithEmail(email:string) : Observable<User>{
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