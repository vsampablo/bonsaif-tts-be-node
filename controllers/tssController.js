const tts = require('../voice-rss-tts/index');
const fs = require('fs');
const pathLib = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const logger = require('../utils/Logger');
const { initCap } = require('../utils/init-cap');

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
const convertAudio = (req, res) => {
    const { path, clave, voz, txt, codec, type } = req.query;
    
    const msgReqParams = 'Los parametros path, clave, voz y txt son requeridos';

    if( !clave || !voz || !txt ) {
        logger.info(msgReqParams)
        return res.status(400).json({ msg: msgReqParams})
    }

    const voices = ['Silvia','Teresa','Jose']; // Se omite la voz de Juana, pues da las cantidades en dolares
    const msgVoz = 'Solo están permitidas las siguientes voces: ' + voices;
    logger.info(voz);

    const found = voices.find(element => element === initCap(voz) );    
    if( !found )
    {
        logger.info(msgVoz)
        return res.status(400).json({ msg: msgVoz});
    }

    const formato = (!codec) ? 'OGG' : 'json'; // Si el formato no se establece , define OGG por defecto
    const ruta = (!path) ? '/mnt/blaster/' : path; // Si el ruta no se establece , define /mnt/blaster/ por defecto
                
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
                logger.error(error)
                return res.status(500).json({
                    msg: 'Error al convertir el texto a audio, contacte al Administrator',
                    error: error
                })
            }
            try {
                
                const typeRespnse = (!type) ? 'string' : 'json'; // Si el type no se establece devuelve string por defecto
                //const soundsPath = pathLib.join(__dirname, '../sounds');
                const soundsPath = pathLib.join(__dirname, '..' + ruta);
                const hardCodePath = 'http://10.3.96.6/blaster';
                //const soundFile = `${Date.now()}.${codec}`
                const soundFile = `${clave}.${formato}`
                fs.writeFileSync(`${soundsPath}/${soundFile}`, content);
                const duration = await getAudioDurationInSeconds(`${soundsPath}/${soundFile}`);

                if(typeRespnse === 'string'){
                    const resp = `${hardCodePath}/${soundFile}|${txt.length}|${duration}`;
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
                logger.error(e)
                console.log("e:", e.code);
                switch(e.code){
                    case "ENOENT":
                        return res.status(404).json({
                            msg: `La ruta ${ ruta } no fue encontrada`,
                            error: e
                        })
                        break;
                    default:  
                        return res.status(500).json({
                            msg: 'Error desconocido, contacte al Administrator',
                            error: e
                        })   
                }
                
            }
            
        }
    });
}

module.exports = convertAudio;