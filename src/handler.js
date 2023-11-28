const TextToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const client  = new TextToSpeech.TextToSpeechClient();
const quickStart = async(request, h) => {
    // The text to synthesize
    const { text } = request.payload;
  
    // Construct the request
    const process = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'id-ID', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    // Performs the text-to-speech request
    const [output] = await client.synthesizeSpeech(process);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    // const id = nanoid(16);
    await writeFile("uploads/output.mp3", output.audioContent, 'binary');
    if(writeFile){
      const respone = h.response({
        status : 'success',
        message: 'berhasil menambahkan suara',
      }).code(201);
      return respone;
    }
    
    
  }
 module.exports = quickStart;