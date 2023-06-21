//const speech = require('@google-cloud/speech');
const {SpeechClient} = require('@google-cloud/speech').v2;

const client = new SpeechClient();
//const client = new speech.SpeechClient();

const recognizer = {}
const recognizerId = 'abc123'
const parent = 'abc123'
//const callCreateRecognizer();

async function callCreateRecognizer() {
    // Construct request
    const request = {
      recognizer,
      parent,
    };

    // Run request
    const [operation] = await client.createRecognizer(request);
    const [response] = await operation.promise();
    console.log(response);
}
//callCreateRecognizer();

/**
 * Calls the Speech-to-Text API on a demo audio file.
 */
export async function quickstart2() {
    callCreateRecognizer();
    return;

// The path to the remote LINEAR16 file stored in Google Cloud Storage
  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  console.log(`Transcription: ${transcription}`);
  //alert(`Transcription: ${transcription}`)
}
