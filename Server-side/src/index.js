const http = require("http");
const util = require("util");
const url = require("url");
const redis = require("redis");
const formidable = require("formidable");
const { portNumber, vrste_jela_counter,recept_counter } = require("../config/config");
const redisClient = redis.createClient();

function processRequestBody(requset,callback){
    let chunks = [];
    requset.on("data", (chunk) => {
        chunks.push(chunk);
    });
    requset.on("end", () => {
        const data = Buffer.concat(chunks);
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
        if(rootPath[0]==='users'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        if(rootPath[0]==='vrsta-jela'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        if(rootPath[0]==='recept'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        if(rootPath[0]==='comment'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
    }
    if(req.method.toLowerCase()==='get')
    {
        if(rootPath[0]==='users'){
            if(queryData.email && queryData.password)
            {
                let user = await redisClient.hGetAll(queryData.email);

                if(user.password===queryData.password){
                    res.writeHead(200,'OK',headers);
                    res.write(JSON.stringify(user));
                    res.end();
                }
                else{
                    res.writeHead(400,"Bad Request",headers);
                    res.write("Incorrect credentials...");
                    res.end();
                }
            }
            else if(queryData.email)
            {
                let user = await redisClient.hGetAll(queryData.email);
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(user));
                res.end();
            }
        }
        else if(rootPath[0]==='vrsta-jela'){
            if(queryData.id){
                let vrstaJela = await redisClient.get(queryData.id);
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify({id:queryData.id,name:vrstaJela}));
                res.end();
            }
            else{
                const keysArray = await redisClient.keys('vrste_jela:*');
                const values = await redisClient.mGet(keysArray);
                let vrsteJela=[];
                keysArray.forEach((value,index)=>{
                    vrsteJela.push({
                        id:value,
                        name:values[index]
                    });
                });
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(vrsteJela));
                res.end();
            }
        }
        else if(rootPath[0]==='recept'){
            if(queryData.autor){
                const keysArray = await redisClient.keys('recept:*:autor:'+queryData.autor);
                let receptAll=[];
                for(let i=0;i<keysArray.length;i++){
                    let recept = await redisClient.hGetAll(keysArray[i]);
                    receptAll.push(recept);
                }
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(receptAll));
                res.end();
            }
            else if(queryData.vrsta_jela){
                const keysArray = await redisClient.keys('recept:*:vrste_jela:'+queryData.vrsta_jela);
                let receptAll=[];
                for(let i=0;i<keysArray.length;i++){
                    let recept = await redisClient.hGetAll(keysArray[i]);
                    receptAll.push(recept);
                }
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(receptAll));
                res.end();
            }
            else if(queryData.id){
                const keysArray = await redisClient.keys('recept:'+queryData.id+':vrste_jela:*');
                let receptAll=[];
                for(let i=0;i<keysArray.length;i++){
                    let recept = await redisClient.hGetAll(keysArray[i]);
                    receptAll.push(recept);
                }
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(receptAll[0]));
                res.end();
            }
            else{
                const keysArray = await redisClient.keys('recept:*:vrste_jela:*');
                let receptAll=[];
                for(let i=0;i<keysArray.length;i++){
                    let recept = await redisClient.hGetAll(keysArray[i]);
                    receptAll.push(recept);
                }
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify(receptAll));
                res.end();
            }
        }
        else if(rootPath[0]==='comment'){
            if(queryData.id_recept){
                let commment_text=await redisClient.lRange('comment:text:'+queryData.id_recept,0,-1);
                let commment_user=await redisClient.lRange('comment:user:'+queryData.id_recept,0,-1);
                res.writeHead(200,'OK',headers);
                res.write(JSON.stringify({
                    texts:commment_text,
                    users:commment_user
                }));
                res.end();
            }
        }
    }
    if(req.method.toLowerCase()==='post')
    {
        if(rootPath[0]==='users'){
            processRequestBody(req,async (dataObj)=>{
                let user = await redisClient.hGetAll(dataObj.email);
                if(user.email){
                    res.writeHead(400,'Bad Request',headers);
                    res.write("User already exists...");
                    res.end();
                }
                else{
                    await redisClient.hSet(dataObj.email,dataObj);
                    res.writeHead(200,'OK',headers);
                    res.end();
                }
            });
        }
        else if(rootPath[0]==='vrsta-jela'){
            processRequestBody(req,async (dataObj)=>{
                const id = await redisClient.get(vrste_jela_counter);
                const name = dataObj.name;
                await redisClient.set('vrste_jela:'+id,name);
                redisClient.incr(vrste_jela_counter);
                res.writeHead(200,'OK',headers);
                res.write('Vrsta jela added successfully.');
                res.end();
            });
        }
        else if(rootPath[0]==='recept'){
            processRequestBody(req,async (dataObj)=>{
                const id = await redisClient.get(recept_counter);
                dataObj.id=id;
                await redisClient.hSet('recept:'+id,dataObj);
                redisClient.hSet('recept:'+id+':autor:'+dataObj.autor,dataObj);
                redisClient.hSet('recept:'+id+':vrste_jela:'+dataObj.vrste_jela,dataObj);
                redisClient.incr(recept_counter);
                res.writeHead(200,'OK',headers);
                res.write('Recept added successfully.');
                res.end();
            });
        }
        else if(rootPath[0]==='comment'){
            processRequestBody(req,async (dataObj)=>{
                await redisClient.rPush('comment:text:'+dataObj.id_recept,dataObj.text);
                await redisClient.rPush('comment:user:'+dataObj.id_recept,dataObj.user);
                res.writeHead(200,'OK',headers);
                res.write('Comment added successfully.');
                res.end();
            });
        }
        else{
            res.writeHead(400,'ERROR',headers);
            res.write("Invalid request");
            res.end();
        }
    }
    if(req.method.toLowerCase()==='delete')
    {
        if(rootPath[0]==='users'){
            if(queryData.email){
                redisClient.del(queryData.email);
                res.writeHead(200,'OK',headers);
                res.write("User deleted successfully");
                res.end();
            }
        }
        else if(rootPath[0]==='recept'){
            if(queryData.id){
                await redisClient.del('recept:'+queryData.id);
                res.writeHead(200,'OK',headers);
                res.write("Recept deleted successfully");
                res.end();
            }
        }
        else{
            res.writeHead(400,'ERROR',headers);
            res.write("Deleteing recept failed.");
            res.end();
        }
    }
    if(req.method.toLowerCase()==='put')
    {
        if(rootPath[0]==='users'){
            processRequestBody(req,async (dataObj)=>{
                await redisClient.hSet(dataObj.email);
                res.writeHead(200,'OK',headers);
                res.write("User deleted successfully");
                res.end();
            });
        }
    }
});

server.listen(portNumber,()=>{
    console.log("Listening on port "+portNumber+"...\n\n");
    redisClient.connect();
    redisClient.on('error', err => console.log('Redis Client Error', err));
    // AddVrstaJela();
    // deleteRecepts();
});

async function deleteRecepts(){
    let keysArray = await redisClient.keys('recept:*:autor:*');
    for(let i=0;i<keysArray.length;i++){
        let recept = await redisClient.del(keysArray[i]);
    }

    keysArray = await redisClient.keys('recept:*:vrste_jela:*');
    for(let i=0;i<keysArray.length;i++){
        let recept = await redisClient.del(keysArray[i]);
    }

    keysArray = await redisClient.keys('recept:*');
    for(let i=0;i<keysArray.length;i++){
        let recept = await redisClient.del(keysArray[i]);
    }
}
function AddEntriesToRedis(){
    //Data is added here

}

function AddUsers(){
    let user ={
        id:null,
        name:null,
        last_name:null,
        email:null,
        password:null,
        city:null,
        birth_date:null,
        picture:null
    }

}

async function AddRecepts(){
    await redisClient.set(recept_counter,1);

    let id = await redisClient.get(recept_counter);
    dataObj.id=id;
    await redisClient.hSet('recept:'+id,dataObj);
    redisClient.hSet('recept:'+id+':autor:'+dataObj.autor,dataObj);
    redisClient.hSet('recept:'+id+':vrste_jela:'+dataObj.vrste_jela,dataObj);
    redisClient.incr(recept_counter);
}

async function AddVrstaJela(){
    await redisClient.set(vrste_jela_counter,1);

    let id = await redisClient.get(vrste_jela_counter);
    redisClient.set('vrste_jela:'+id,'Glavno jelo');
    redisClient.incr(vrste_jela_counter);

    id = await redisClient.get(vrste_jela_counter);
    redisClient.set('vrste_jela:'+id,'Supe i corbe');
    redisClient.incr(vrste_jela_counter);

    id = await redisClient.get(vrste_jela_counter);
    redisClient.set('vrste_jela:'+id,'Pite i testa');
    redisClient.incr(vrste_jela_counter);

    id = await redisClient.get(vrste_jela_counter);
    redisClient.set('vrste_jela:'+id,'Torte');
    redisClient.incr(vrste_jela_counter);

    id = await redisClient.get(vrste_jela_counter);
    redisClient.set('vrste_jela:'+id,'Kolaci');
    redisClient.incr(vrste_jela_counter);

    // id = await redisClient.get(vrste_jela_counter);
    // redisClient.set('vrste_jela:'+id,'Predjelo');
    // redisClient.incr(vrste_jela_counter);
}