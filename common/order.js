import { ChatGPTAPI } from '../chatgpt/chatgpt-api'

const OPENAI_API_KEY  ="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"
const assist = new ChatGPTAPI({
    apiKey: OPENAI_API_KEY,     //process.env.OPENAI_API_KEY,
    debug: false,
    mode: true
})

export async function assistOrder(messages) {
    const prefix = "我是system, 你是麥當勞的店員,我們有主餐,配餐,飲料三種menu.\
    我會給你下面的對話,請你給我目前user需要看到那一種menu.\
    如果user在開始的時候,應該先給主餐的menu.\
    以下是對話\n\n";

    const option = {promptPrefix: prefix}
    var prompt = ""
    for await (const [key, value] of messages.iterator()) {
        console.log("message",key, value);
        prompt += value.role+":"+value.text+"\n";
    };
    console.log("prompt",prompt)
    const data = await assist.sendMessage(prompt, option);
    console.log("result",data);
    const say = data.text;
    var menu = null;
    
    if (say.indexOf("主餐") != -1) {
        menu = {name:"主餐",image:"main.png"}
    } else if (say.indexOf("配餐") != -1) {
        menu = {name:"配餐",image:"side.png"}
    } else if (say.indexOf("飲料") != -1) {
        menu = {name:"飲料",image:"drink.png"}
    } else {
        menu = null;
    }

    return menu;
}