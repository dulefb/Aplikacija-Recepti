const http = require("http");
const util = require("util");
const url = require("url");
// const redis = require("redis");
const formidable = require("formidable");
const { portNumber } = require("../config/config");
//const redisClient = redis.createClient();

function processRequestBody(requset,callback){
    let chunks = [];
    requset.on("data", (chunk) => {
        chunks.push(chunk);
    });
    requset.on("end", () => {
        console.log("all parts/chunks have arrived");
        const data = Buffer.concat(chunks);
        console.log("Data: ", data);
        const querystring = data.toString();
        const parsedData = new URLSearchParams(querystring);
        const dataObj = {};
        for (var pair of parsedData.entries()) {
          dataObj[pair[0]] = pair[1];
        }
        callback(dataObj);
    });
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
        if(rootPath[0]==='checkBody'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
    }
    if(req.method.toLowerCase()==='get')
    {

    }
    if(req.method.toLowerCase()==='post')
    {
        if(rootPath[0]==='checkBody'){
            processRequestBody(req,(dataObj)=>{
                console.log(dataObj);
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(dataObj));
                res.end();
            });
        }
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