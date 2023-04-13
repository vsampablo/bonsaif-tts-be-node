const tts = require('../voice-rss-tts/index');
const fs = require('fs');
const pathLib = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const { initCap } = require('../utils/init-cap');
const { ec, utl } = require('bonsaif'); // encripta
const request = require('request');

const TAG = 'ttsController';
/**
 * 
 * @query {
 *  lang: 'es-mx',
 *  voice: 'Juana, Silvia, Teresa, Jose',
 *  txt: 'Texto a convertir a audio',
 *  type: 'json, string => defecto: string'
 * } req 
 * @returns 'string o json'
 */

 const onGET=(req, res )=>{
    convertAudio(req, res, req.query);
  }

  const onPOST=(req, res )=>{
    convertAudio(req, res, req.body);
  }

const convertAudio = (req, res, json) => {
    utl.log('json',json);
    const { path, clave, voz, txt, codec, type, linkups ='' } = json;
    
    //2022/11/25 Se obtine uri para reproducir la grabacion
    let uri_origen = `${req.protocol}://${req.get('host')}`;
    let uri_play = `${uri_origen}/play`;
    let host = req.host;

    const msgReqParams = 'Los parametros path, clave, voz y txt son requeridos';

    //await createDirectories(path);

    if( !clave || !voz || !txt ) {
        return res.status(400).json({ msg: msgReqParams})
    }

    const voices = ['Silvia','Teresa','Jose']; // Se omite la voz de Juana, pues da las cantidades en dolares
    const msgVoz = 'Solo están permitidas las siguientes voces: ' + voices;

    const found = voices.find(element => element === initCap(voz) );    
    if( !found ) {
        return res.status(400).json({ msg: msgVoz});
    }

    const formato = codec ? codec : 'ogg'; // Si el formato no se establece , define OGG por defecto
    const ruta = (!path) ? '/var/lib/asterisk/sounds/blaster/' : path; // Si el ruta no se establece , define /mnt/blaster/ por defecto
    let uri_path = ec.StringToHex(ruta);

    utl.log('uri_play ['+uri_play+'] ruta['+uri_path+'] txt['+txt+']');

    tts.speech({
        key: process.env.KEY_TTS,
        hl: 'es-mx',
        v: voz,
        src: txt,
        r: 0,
        c: formato, //codec
        f: '8khz_8bit_mono', //8khz_16bit_mono	
        ssml: false,
        b64: false,
        callback: async function (error, content) {
            if(error){
                //console.log(TAG+' ',error);
                return res.status(500).json({
                    msg: 'Error: al convertir el texto a audio, contacte al Administrator',
                    error: error
                })
            }
            try {
                
                const typeRespnse = (!type) ? 'string' : 'json'; // Si el type no se establece devuelve string por defecto
                //const soundsPath = pathLib.join(__dirname, '..' + ruta);
                const soundsPath = pathLib.join(ruta);
                const hardCodePath = uri_play;
                //const soundFile = `${Date.now()}.${codec}`
                const soundFile = `${clave}.${formato}`
                fs.writeFileSync(`${soundsPath}/${soundFile}`, content);
                const duration = await getAudioDurationInSeconds(`${soundsPath}/${soundFile}`);

                if(typeRespnse === 'string'){
                    const resp = `${hardCodePath}/${soundFile}|${txt.length}|${duration}|${uri_path}`;
                    linkup({linkups, soundFile, ruta, duration, uri_origen, host});
                    return res.send(resp)
                }
                return res.json({file: {
                    formato, // codec,
                    voz,
                    txt,
                    length: txt.length,
                    size: `${parseInt(content.byteLength.toLocaleString())} kb`,
                    duration: `${duration} s`,
                    path: `${hardCodePath}/${soundFile}`
                }})
            } catch (e) {
                console.log(TAG+' ',e);
                console.log("e:", e.code);
                switch(e.code){
                    case "ENOENT":
                        return res.status(404).json({
                            msg: `Error: La ruta ${ ruta } no fue encontrada`,
                            error: e
                        })
                        break;
                    default:  
                        return res.status(500).json({
                            msg: 'Error: desconocido, contacte al Administrator',
                            error: e
                        })   
                }
            }
        }
    });
}

const createDirectories = async (pathname) => {
    //fs.mkdirSync(pathname,{recursive:true});
    fs.mkdir(pathname, { recursive: true }, e => {
        if (e) {
            utl.log(' createDirectories.e',e);
        } else {
            utl.log(' createDirectories Success');
        }
    });
}

const linkup=(o)=>{
    const {linkups='', host='', uri_origen='', ruta='', soundFile=''} = o;
    if (linkups!=''){
        let ltlink = linkups.split(",");
        utl.log('link: ',o);
        for (let lk of ltlink){
            let url_ = uri_origen.replace(host,lk)+'/linkup?path='+ruta;
            utl.log('uri', url_);
            const options = {
                url: url_,
                formData: {
                    file: fs.createReadStream(ruta+'/'+soundFile),
                    filetype: 'ogg',
                    filename: soundFile,
                },
            };
            request.post(options, (err, r, body) => {
                utl.log(` [${url_}] Status: ${r.statusCode} body[${body}]`);
            });
        }
    }
    
}

module.exports = {
    onGET,
    onPOST,
    convertAudio
}
;