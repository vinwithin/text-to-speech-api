const TextToSpeech = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage')
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const client  = new TextToSpeech.TextToSpeechClient();
//name and key to access google cloud storage
const projectID = process.env.PROJECT_ID
const keyFileName = process.env.KEYFILENAME
const storage = new Storage({projectID, keyFileName});
const Bucket_name = process.env.BUCKET_NAME;
//output name in my local folder
const date = Date.now();
const file_name = date + ".mp3" 
const voices = require('./voice')

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
    //push file_name to voices
    voices.push(file_name)
    //upload file to storage bucket
    try{
      const bucket = storage.bucket(Bucket_name)
      await bucket.upload(`uploads/${file_name}`, {
        destination: file_name
      })
      //set object in gcs to public
      await storage.bucket(Bucket_name).file(file_name).makePublic();
      console.log(`gs://${Bucket_name}/${file_name} is now public.`);
    }catch(error){
      console.log('Error', error)
    }
    // if(writeFile){
    //   return h.response({
    //     status: 'success',
    //     data: {
    //       message: "berhasil menambahkan suara"
    //     },
    //   }).code(200);
    
    // }
    
      
    
  }

 
  
  
 module.exports = quickStart;