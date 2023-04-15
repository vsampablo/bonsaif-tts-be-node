const { ec, utl } = require('bonsaif'); // encripta
const request = require('request-promise');

async function onGET(req, res ) {
    let uri = 'http://localhost:8806/voice-rss?';

    try{
        let r = await sendtts(uri, {clave:'Vick', voz:'Teresa', path:'c:/mnt/blaster'}, 'HOla');
        utl.log('TEST status::::::::::',r.status);
        utl.log('TEST',r);
    }catch(e){
        utl.log('TEST status::::::::::',e);
    }
    

    


  
    sendResponse(res, 200, {json:1})
    
}

const sendResponse=(res, code, jsonString)=>{
    res.status(code).json(jsonString);
  }

const sendtts=async(uri, fields, txt)=>{
      return new Promise(function(resolve, reject) {

        let options;
        txt = txt.trim();
        
        if (uri.includes(':8806')){

          fields.txt = txt;

          options = {
            url: uri,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields)
          }
        }else{
          fields.txt = encodeURI(txt);
          options = {
            url: uri,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            formData: fields
          }
        }
        //utl.log('options', options);

        request.post(options, function(err, resp, body) {
          if (err) {
            resolve({status:404, body:'', err});
          } else {
            resolve({status:200, body, err:'0'});
          }
        })
      });
}

module.exports ={
    onGET
 }