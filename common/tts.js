var audiolist = [];

export async function apiTTS2(id, text, audio, setSpeak, setEnable) {
    async function genAudio(id, text) {
        console.log("tts send", id);
        //const response = await fetch("/api/tts", {
        //    method: "POST",
        //    headers: {"Content-Type": "application/json"},
        //    body: JSON.stringify({id:id, text: text}),
        //});
        const response = await fetch("https://mocking.himeno.cc:3000/messages", {
            method: "POST",
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
            body: JSON.stringify( { message: text, speaker: "F0003" } )
        });
        const data  = await response.json();
        console.log("tts", id, data);
        return data;
    }
    async function rmAudio(id) {
        /*
        const response = await fetch("/api/rm", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id:id}),
        });
        */
        //const data  = await response.json();
        //console.log("rm", data);
        //return data;
    }
    async function loopAudio() {
        const first = (audiolist.length > 0)? audiolist.shift(): null;
        const top   = (audiolist.length > 0)? audiolist[0]: null;
        if (! first) {
            console.log(">> # no first",first,audiolist)
            return;
        } else {
            console.log(">> # remove",first,audiolist)
        }
        console.log(">> # delete",first.id,first.text)
        first.delete();
        setSpeak({play: false});

        if (top) {
            //setSpeak(true);
            console.log(">> # play",first.id,first.text)
            top.play();
        } else {
            console.log(">> # no top")
        }
    }
    class PlayItem {
        constructor(id,promise,text,audio) {
            this.id = id;
            this.promise = promise;
            this.text = text;
            this.audio = audio;
            this.log(">> 0: created",text)
        }
        delete () {
            this.log(">> 6: deleted",this.text);
            rmAudio(this.id);
        }
        log(action,data) {
            console.log("["+this.id+"]",action,data)
        }
        
        async play() {
            console.log("[webspeech]","@setEnale false");
            setEnable(false);
            console.log()
            this.log(">> 1: wait", this.text);
            const data = await this.promise;
            this.log(">> 2: ready", this.text);
            const audio= this.audio;
            audio.onended = () => {
                this.log("5: end", this.text);
                setEnable(true);
                console.log("[webspeech]","@setEnale true");
                loopAudio();
            }
            const contentType = 'audio/mpeg';
            //audio.src = data.audio;
            audio.src = `data:${contentType};base64,${data.raw}`;
            audio.onloadedmetadata = () => {
                console.log("4: setSpeak",audio.duration, data.vowel);
                setSpeak({play: true, duration: audio.duration, vowel: data.vowel});
            };
            audio.play();
            this.log(">> 3: play", this.text, data.pinyin, data.vowel);
        }
    }

    const promise   = new Promise((resolve, reject) =>{
        const pGenAudio = genAudio(id, text);
        pGenAudio.then((data)=> {
            console.log("genAudio ready", id, text)
            resolve(data);
        }).catch(error => {
            console.log("error",error);
            reject();
        })
    })
    const item = new PlayItem(id, promise, text, audio);
    audiolist.push(item);
    console.log(">> # push",item.id,item.text,audiolist)
    if (audiolist.length == 1) {
        console.log(">> # play",item.id,item.text);
        item.play();
    }
}
