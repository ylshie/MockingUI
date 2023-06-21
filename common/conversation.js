import { ChatGPTAPI } from '../chatgpt/chatgpt-api'
import { isSep, hasorder, getorders, replaceorders } from "./util"
import { assistOrder } from "./order";
import { apiTTS2 } from "./tts";

var conversationId  = -1;
var parentMessageId = -1;

const OPENAI_API_KEY  ="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"

const api = new ChatGPTAPI({
    apiKey: OPENAI_API_KEY,     //process.env.OPENAI_API_KEY,
    debug: false,
    mode: true
})
/*
const assist = new ChatGPTAPI({
    apiKey: OPENAI_API_KEY,     //process.env.OPENAI_API_KEY,
    debug: false,
    mode: true
})
*/
export function workConversaction(audio, prefix, text, bind) {
    processConversation(audio, prefix, text, bind.result[0], (state, data) => {
        switch(state) {
        case "start":
            //progress_start(refCounter.current)
            bind.result[1](data);
            bind.enable[1](false);
            break;
        case "action":
            bind.action[1]([data, "still"]);
            break;
        case "speak":
            //if (dospeak) apiTTS2(data.id, data.sub, data.audio);
            apiTTS2(data.id, data.sub, data.audio, bind.speak[1], bind.enable[1]);
            break;
        case "saying":
            bind.saying[1](data);
            break;
        case "end":
            bind.result[1](data);
            bind.saying[1](null);
            //bind.enable[1](true);
            //progress_end(refCounter.current);
            break;
        case "menu":
            bind.menu[1](data);
            break;
        case "menu":
            bind.order[1](data);
            break;
        }
    })
}
export function resetConversation() {
    conversationId  = -1;
    parentMessageId = -1;
}
export async function processConversation(audio, prefix, text, result, hook) {
    console.log("doConversation")
    try {
        if (text == null) return;
        
        const list = result.concat();
        const prompt = text;
        const option = (conversationId != -1)
                        ? { conversationId: conversationId, 
                            parentMessageId: parentMessageId,
                            promptPrefix: prefix}
                        : { promptPrefix: prefix}
        list.push({role:"me", text: prompt});
        if (hook) hook("start",list);
        var start   = 0;
        var count   = 1;
        const oprefix = "[order";
        const osuffix = "]";
        function getAction(sub) {
            if (sub.indexOf("您好") != -1) return "wave";
            if (sub.indexOf("你好") != -1) return "wave";
            if (sub.indexOf("謝謝") != -1) return "bow";
            return null;
        }
        function checkSubstring(orig,id) {
            const text = replaceorders(orig);
            if (hasorder(orig)) {
                //setOrder(getorders(orig));
                hook("order", getorders(orig));
            }

            for (let i=start; i < text.length; i++) {
                const ch = text[i];
                if (isSep(ch)) {
                    const sub   = text.substring(start, i);
                    start = i+1;
                    console.log("["+count+"]", sub);
                    count++;
                    const action = getAction(sub);
                    if (action) hook("action", action)
                    hook("speak", {id:id+"@+count", sub: sub, audio: audio})
                }
            }
            return text;
        }
        option.onProgress = (data) => {
            //console.log("progress",data)
            const say = checkSubstring(data.text, data.id)
            if (hook) hook("saying", say)
        }
        if (! prompt) {
            console.log(">>prompt incorrect", prompt);
            hook("end", list)
            return;
        }
        let data = null;
        try {
            data = await api.sendMessage(prompt, option);
        } catch (error) {
            alert(error);
            hook("end", list)
            return;
        }
        console.log(">>sendMessage done")
        try {
            const messages = api.getAllMessages();
            assistOrder(messages).then((menu)=>hook("menu",menu));
        } catch (error) {
            console.log(">>assistOrder error", error);
        }
        console.log(">>final",data)
        const answer  = data.text;
        const response = {status: 200}
        conversationId  = data.conversationId;
        parentMessageId = data.id;
        
        if (response.status !== 200) {
            hook("end",list);
            throw data.error; // || new Error(`Request failed with status ${response.status}`);
        }
        const say = checkSubstring(answer);
        const list2 = result.concat();
        list2.push({role:"me",  text:prompt});
        list2.push({role:"bot", text:say});
        hook("end",list2)
    } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
    }
}
