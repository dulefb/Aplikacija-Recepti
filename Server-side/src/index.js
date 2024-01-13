const http = require("http");
const util = require("util");
const url = require("url");
const redis = require("redis");
const formidable = require("formidable");
const { User } = require("../interfaces/user");
const { Message } = require("../interfaces/message");
const { portNumber } = require("../config/config");
//const redisClient = redis.createClient();

let activeUsers = [];
let messagesList = [];

function Crypt(text,key){

}

function Decrypt(text,key)
{
    
}

const server = http.createServer(async(req,res)=>{
    let path = url.parse(req.url,true);
    let queryData = path.query;
    let rootPath = path.pathname.split("/").filter((val,ind)=>ind>0);
    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Accept':'*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
        'Access-Control-Request-Method': 'OPTIONS,GET,POST,DELETE,PUT',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers':'*'
    };

    if(req.method.toLowerCase()==='options')
    {
        if(rootPath[0]==='deleteUser')
        {
            if(queryData.username)
            {
                activeUsers = activeUsers.filter(x=>x.username!==queryData.username);
                console.log("User: "+queryData.username+" deleted...");
                res.writeHead(200,"OK",headers);
                res.write("User deleted successfully");
                res.end();
            }
            else
            {
                res.writeHead(400,"Error",headers);
                res.write("User not deleted...");
                res.end();
            }
        }
        else if(rootPath[0]==='message')
        {
            if(queryData.text && queryData.text.length>0 && queryData.from && queryData.to)
            {
                res.writeHead(200,"OK",headers);
                res.write("Message sent successfully");
                res.end();
            }
            else
            {
                res.writeHead(404,"Error",headers);
                res.write("File not found...");
                res.end();
            }
        }
    }
    if(req.method.toLowerCase()==='get')
    {
        if(rootPath[0]==='activeUsers')
        {
            if(queryData.username && activeUsers.find(x=>x.username===queryData.username))
            {
                res.writeHead(200,"OK",headers);
                res.write(JSON.stringify({
                    activeUsers:activeUsers.filter(x=>x.username!==queryData.username),
                    messageList:messagesList.filter(x=>x.to===queryData.username)
                }));
                messagesList = messagesList.filter(x=>x.to!==queryData.username);
                res.end();
            }
            else{
                res.writeHead(400,"Error",headers);
                res.write("Valid username not provided.");
                res.end();
            }
        }
    }
    if(req.method.toLowerCase()==='post'){
        if(rootPath[0]==="user")
        {
            if(queryData.username && queryData.age && queryData.city && queryData.address)
            {
                if(!activeUsers.find(x=>x.username===queryData.username))
                {
                    let user=new User();
                    user.username=queryData.username;
                    user.age=queryData.age;
                    user.city=queryData.city;
                    user.address=queryData.address;
                    activeUsers.push(user);
                    res.writeHead(200,"OK",headers);
                    res.write("Username registry successful");
                    res.end();
                    console.log("User registered...\n");
                    console.log(user);
                }
                else{
                    res.writeHead(400,"Error",headers);
                    res.write("User not registered. Username is not available.");
                    res.end();
                }
            }
            else{
                res.writeHead(400,"Error",headers);
                res.write("User not registered. Enter all data");
                res.end();
            }
        }
    }
    if(req.method.toLowerCase()==='put')
    {
        if(rootPath[0]==="message")
        {
            if(queryData.text && queryData.text.length>0 && queryData.from && queryData.to)
            {
                let msg = {
                    text:queryData.text,
                    crypted:queryData.crypted,
                    from:queryData.from,
                    to:queryData.to
                };
                if(activeUsers.find(x=>x.username===msg.to))
                {
                    messagesList.push(msg);
                    res.writeHead(200,"OK",headers);
                    res.write("Message sent successfully");
                    res.end();
                    console.log("Message sent...\n");
                    console.log(msg);
                }
                else{
                    res.writeHead(400,"Error",headers);
                    res.write("Message not sent. User not available.");
                    res.end();
                }
            }
            else{
                res.writeHead(400,"Error",headers);
                res.write("Message not sent. Enter all data");
                res.end();
            }
        }
        else{
            res.writeHead(404,"Error",headers);
            res.write("File not found...");
            res.end();
        }
    }
});

server.listen(portNumber,()=>{
    console.log("Listening on port "+portNumber+"...\n\n");
    //redisClient.connect();
});