const { ec, utl } = require('bonsaif'); // encripta
const fs = require('fs');
const formidable  = require('formidable');

async function onPOST(req, res ) { 
  let { path } = req.query;
  const uploadDir  = path +"/";
  utl.log('linkup ',uploadDir);

  try{
    let form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize    = 300 * 1024 * 1024;  // 100MB

    form.on('progress', function(bytesReceived, bytesExpected) {
      if(bytesExpected > 0 && bytesReceived == 0){
        utl.log('Incoming file, size: '+bytesExpected)
        }
      });
  
    form.on('end', function(){
      if(form.bytesExpected == form.bytesReceived){
        utl.log('File complete downloaded');
      }else{
        utl.log('File downloaded incomplete '+form.bytesReceived+'/'+form.bytesExpected+' total');
      }
    });
   
    form.on('error',function(err){
        utl.log('Error ocurred'+err);
     })

    form.on('aborted', function() {
      utl.log('Closed by origination peer');
    });

    form.on('file', function(field, file){
        let pathServer = form.uploadDir+file.name;
        fs.rename(file.path, pathServer, ()=>{
          utl.log("File Renamed ["+pathServer+"]");
        });
    });

    form.parse(req, function(err, fields, files) {
        if(err){
          utl.log(err);
        }
        utl.log(JSON.stringify({fields: fields, files: files}));

        sendResponse(res,200,{desc:"Archivo recibido"});
    });
  }catch(e){
    console.log('errrr: '+e);
  }
}


const sendResponse=(res, code, jsonString)=>{
    res.status(code).json(jsonString);
  }

module.exports ={
    onPOST
 }