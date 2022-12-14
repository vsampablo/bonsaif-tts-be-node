const { ec, utl } = require('bonsaif'); // encripta
const fs = require('fs');

async function onGET(req, res ) {
    let url = decodeURIComponent(req.originalUrl);
    utl.log('url', url);
    url = url.replace('/play/','');
    let segmento = url.split('|');
    let path = '', pfile = '', file= '';
    try{
        path = segmento[3];
        pfile = segmento[0];
        path = ec.fromHexString(path);

        file = path+'/'+pfile;
        utl.log('file',file);
        if (fs.existsSync(file)) {
            //let filestream = fs.createReadStream(file);
            //filestream.pipe(res);
            fs.readFile(file, (err, data) => {

                res.type("application/ogg");  //audio/ogg   application/octet-stream
                res.setHeader("Content-Disposition","attachment;filename="+pfile);                
                res.setHeader("Accept-Ranges","bytes");   
                res.setHeader("Keep-Alive","timeout=5, max=100"); 
                //res.attachment = pfile;
                res.send(data);
            });

        }else{
            sendResponse(res, 200, {'1.Unauthorized':true});
        } 
    }catch(e){
        utl.log('e',e);
        sendResponse(res, 200, {'2.Unauthorized':true});
    }

}

const sendResponse=(res, code, jsonString)=>{
    res.status(code).json(jsonString);
  }

module.exports ={
    onGET
 }