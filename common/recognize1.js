const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
/*
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], {type: mimeString});
}
*/
function srcToFile(src, fileName, mimeType){
  return (fetch(src)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], fileName, {type:mimeType});})
  );
}

/**
 * Calls the Speech-to-Text API on a demo audio file.
 */
export async function quickstart1(voice, rate) {
// The path to the remote LINEAR16 file stored in Google Cloud Storage
    //const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
    //console.log("voice", voice);
    //const data = dataURItoBlob(voice);
    //srcToFile(voice, "aaa.webm", "audio/webm");

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const trim = voice.indexOf('base64,');
    const data = voice.substring(trim + 7);
    const audio = {
        //uri: gcsUri,
        content: data,
    };
    const config = {
        encoding: 'LINEAR16', //'OGG_OPUS',   //'LINEAR16',
        sampleRateHertz: rate, //44100,   //16000,
        //languageCode: 'en-US',
        languageCode: 'zh-TW',
        audioChannelCount: 2,
        enableSeparateRecognitionPerChannel: false,
        alternativeLanguageCodes: ['zh-TW', 'en-US'],
    };
    console.log("config",config)
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    //const [operation] = await client.longRunningRecognize(request);

    // Get a Promise representation of the final result of the job
    //const [response] = await operation.promise();
    //const transcription = response.results
    //  .map(result => result.alternatives[0].transcript)
    //  .join('\n');
    //console.log(`Transcription: ${transcription}`);
    ///*
    console.log("recognize",voice.length)
    /*
    client.recognize(request).then(([response])=>{
                                  //console.log("data",data)
                                  console.log("text", response.results[0].alternatives[0].transcript)
                              })
                             .catch((error)=>console.log("error",error))
    */
    const [response] = await client.recognize(request);
    //const transcription = response.results
    //    .map(result => result.alternatives[0].transcript)
    //    .join('\n');
    console.log("response", response)
    const transcription = response.results[0].alternatives[0].transcript;
    console.log(`Transcription: ${transcription}`);
    return transcription;
}

