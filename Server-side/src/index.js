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
        
    }
    if(req.method.toLowerCase()==='get')
    {

    }
    if(req.method.toLowerCase()==='post')
    {
        
    }
    if(req.method.toLowerCase()==='delete')
    {

    }
    if(req.method.toLowerCase()==='put')
    {
        
    }
});

server.listen(portNumber,()=>{
    console.log("Listening on port "+portNumber+"...\n\n");
    //redisClient.connect();
});