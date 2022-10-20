const tts = require('../voice-rss-tts/index');
const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const logger = require('../utils/Logger');

/**
 * 
 * @query {
 *  lang: 'es-mx',
 *  voice: 'Juana, Silvia, Teresa, Jose',
 *  text: 'Texto a convertir a audio',
 *  type: 'json, string => defecto: string'
 * } req 
 * @returns 'string o json'
 */
const convertAudio = (req, res) => {
    const { lang, voice, text, codec, type } = req.query;
    
    if(!text || !voice || !codec || !lang) {
        logger.info('Please make sure to send text, voice, lang and codec params')
        return res.json({ msg: 'Please make sure to send text, voice, lang and codec params'})
    }
    tts.speech({
        key: process.env.KEY_TTS,
        hl: lang,
        v: voice,
        src: text,
        r: 0,
        c: codec,
        f: '32khz_16bit_stereo',
        ssml: false,
        b64: false,
        callback: async function (error, content) {
            if(error){
                logger.error(error)
                return res.json(error)
            }
            try {
                const typeRespnse = (!type) ? 'string' : 'json'; // Si el type no se establece devueve string por defecto
                const soundsPath = path.join(__dirname, '../sounds');
                const soundFile = `${Date.now()}.${codec}`
                fs.writeFileSync(`${soundsPath}/${soundFile}`, content);
                const duration = await getAudioDurationInSeconds(`${soundsPath}/${soundFile}`);

                if(typeRespnse === 'string'){
                    const resp = `${soundsPath}/${soundFile}|${text.length}|${duration}`;
                    return res.send(resp)
                }
                return res.json({file: {
                    codec,
                    voice,
                    text,
                    size: `${parseInt(content.byteLength.toLocaleString())} kb`,
                    duration: `${duration} s`,
                    path: `${soundsPath}/${soundFile}`
                }})
            } catch (e) {
                logger.error(e)
                return res.json({error: e})
            }
            
        }
    });
}

module.exports = convertAudio;