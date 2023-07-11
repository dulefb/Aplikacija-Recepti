export class User{
    id:number;
    name:string;
    last_name:string;
    email:string;
    password:string;
    city:string;
    birth_date:Date;
    picture:string;

    constructor(id:number,name:string,last_name:string,email:string,password:string,city:string,birth_date:Date){
        this.id=id;
        this.name=name;
        this.last_name=last_name;
        this.email=email;
        this.password=password;
        this.city=city;
        this.birth_date=birth_date;
        this.picture=null;
    }
}