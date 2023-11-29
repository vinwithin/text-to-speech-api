const TextToSpeech = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage')
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const client  = new TextToSpeech.TextToSpeechClient();
//nama dan key untuk mengakses cloud storage bucket
const projectID = process.env.PROJECT_ID
const keyFileName = process.env.KEYFILENAME
const storage = new Storage({projectID, keyFileName});
const Bucket_name = process.env.BUCKET_NAME;
//nama output file di lokal
const date = Date.now();
const file_name = date + ".mp3" 

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
    await writeFile(`uploads/${file_name}`, output.audioContent, 'binary');
    //upload file to storage bucket
    try{
      const bucket = storage.bucket(Bucket_name)
      await bucket.upload(`uploads/${file_name}`, {
        destination: file_name
      })
    }catch(error){
      console.log('Error', error)
    }
    if(writeFile){
      return h.response({
        status: 'success',
        data: {
          message: "berhasil menambahkan suara"
        },
      }).code(200);
    
    }
  }
//  const uploadFile = async() => {
//     try{
//       const bucket = storage.bucket(process.env.BUCKET_NAME)
//       const ret = await bucket.upload(`uploads/${file_name}`, {
//         destination: file_name
//       })
//       return ret
//     }catch(error){
//       console.log('Error', error)
//     }
//   }
 
  
  
 module.exports = quickStart;