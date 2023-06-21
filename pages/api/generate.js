//import { Configuration, OpenAIApi } from "openai";
import { ChatGPTAPI } from '../../chatgpt/chatgpt-api'
//import {DB_CONN_STRING, DB_NAME} from "./env"
//import { oraPromise } from 'ora'

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: false
})
/*
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
*/
//const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    //openDB();
    const prompt = req.body.prompt;
    const option = req.body.option;
    option.onProgress = (data) => { console.log(">>",data.text)}
    let result = await api.sendMessage(prompt, option);
    console.log("result", result)
    res.status(200).json( result );
}
