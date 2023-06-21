//import { updateContext } from "../../common/db";
import { pinyinify } from "hanzi-tools";

const fs = require('fs');
//const {OAuth2Client} = require('google-auth-library');
//const {auth, Compute} = require('google-auth-library');
const {GoogleAuth} = require('google-auth-library');

//const GOOGLEAPI_TOKEN = "ya29.c.b0Aaekm1ICPU_NlKIQiUevSIRnwcabZbCbuHKn_KWzihaMV-gdciru3E921DTOao29H1leLTOChp-pMiaTwOrtfg8ypboBm5jijNBysmP2M92oJhMq3g6pnP96kOKXDBkDkpmoeuvTmrVShoUutOFoyuSAXztAyDcSoEylBDOWy6XVT9y-dg1s5HFDqLRtmTwX90YsakVx0mB5SR2BnE09VQtUj9Dz9XsT232KuVmclQ9fmoolucdpJfitfZ2f6pYQ9124_WVIfp_iitkZeesgY8O1o_8Qinz9R1kx8Ogj9Zr_18vkarupZ3O7nRpUQoydJeJjVIQr7z7uBZS-7Sz38VQReXOwSwM9IMYdhjIsX9_2mjeI_uJzJ_lMra49hQswI852rdl3Ob3Z_UUu8c1QcawvQ9i05enXbZw8em22xdRu3mtd_-Qsdx1vnow3Upy6zqlQ3c3d6wJR_bxb4baSssdp_vaWMUgqX8ZJBQSfBq6yeRWqWq0_V1rlnqim0RtU53rX37j84awtxjptgiBFXnVJalJlYeJ3m7oSa9zxh-RvmM6vnniJc6xsO___b6Wz59Ws3qkUtz-RSkR7-2Y3ZRsqeI95YZFehv-81dOJgt4sdVQ75BiOuqSg4fjdnuXjSs_bS5JQv4QSFvcSMBOu-jt1cXvYnIqrY-Wwz7_p_sfp6V2akwfmY5XZqnrzs9OwdW2_iU2VShig1MaI80px2BmhgrvdQ7yrZ77QQFcXezn7jMnVpelpiiqSbgzi67rQkvOMzMzfXIv7lXiJloOh_flea5VtoZrxl5Ug9O0kZwQQRbkwS_qtIQum68SWbqd75MS4kk0qylFF3htg4t0QMyoyRIgw9Z9fp7xbt2-p5imZvfq9lMf_rgm5jiu_fqWamzVmdtwoYz1MWeRw5UfnIcdJ_05RiknJjU3eJmfot8eafbbf7rr5lg44qnrdJedQZFU09rxrUjO8e1h8zRsmZ47pOROYrIR5nc-S0O5Swjmqe35d0Z9dtM2"
//const GOOGLEAPI_TOKEN = "ya29.c.b0Aaekm1Iq21c4C3VKgifQg_Y3LopLQNkDL1gfSHUicCpsbvTZznJztl_sGbgaD9-0jw3DF6Mh958ZJAoi6txvrFVZFjis0vkLY0mpsRJRZVR1P9a0OEUA5aBLUFkHzAfMrtyw_zCYV0RLhLRnzDaKgUJtpNB66yzjwN4Ca0z8RLFme4dsZlSkE7DVrjXgPYfizxewNw5xnsHeuD7a3BWntalgCrhCnYAT232AWec5bWz8fOzXajVZYUz24jBXjRkIqhU2QM7vZ1687Vygc9JQlyp2-rQURtok5Mna4szOnarYusV1MzekY7zm-t0mBh246hBm7wRYVmz0MSiZBytp_d2VkVQuBmihYhOuq-8mpwOR6jk4scRhVejszIkdFxSwqMeslFafRBoOm4UlYYWQZiUo06ze_0pxW-QOar5qomecY_Ix9joo3v_Fay_n-bWFi3jw_vr4ZMZ7yS6kyOWm5wasOZrW-SiifXkrgyMrny2oddrRIziigaIbX6txakarfYb9ySgUQs0O_yjMM7dwMa9jMxl1zUXIXea8tR7sn9f4Iz8jefq6dwXQQkkdR2_aY0z09ih5m0h22QibszgbWyyttfSx7ejIlkVhqZn68Q2z8VRdJirsjBcx6oc8ZQy1okFf_MJtzaRf6lUmolYqujr6Wf3gw6sRa0c-98MVsmedg0VzYqQ4p3uRWl1fc3pynp9uxB9j99_apc1q8qgk0_Rq9Ut366d7VYRuqX7-QmyF-iabxjZk7wnbx-aX_VoB-7UlhofQVvJR3rkWwyB3tWMkW5-x4Xr5jicR31FxisZBVB1z9bOcnpVqgbOdIJ_vm1SWgjprg0yz9sm5QVuph4M03Zinkknbjp2Jtug-tw576a_szcIr2d6ae-ggJ9YYpQ2dj1faV0iazRbYYtcR6hoyoVOYB_Smj_Usdf4QaW8RfcMbI8yiaZR9-vhuywBWZrj0I2I3fzpM-JjU73Oae3vnWOmbxUnOwqswy4RavgYOnIyMpb_IkJr"
//const GOOGLEAPI_TOKEN = "ya29.c.b0Aaekm1L1eoAe06SN6mTpgrQ6MZ4kMXFub-XEUOimB5bzTwXK07d3ySpWZ8h2E9Qxn1jx_MRmYUiWQ4g2lMOJWkRiSAu7Xcwv6_rJR6LZTt6J9pG60gU9MphxQXlN05EmLbscepgvI5Pd1duQ9CnqXHzJjTVmzAq749iKcOwSDxXNjUajeZAGe00H0LEoM1teY_aEldAMiUIKgDLqz8wqt-KyQiD9bssT232PkRb6Xn8JkmaZ7wVi-Ym-jQJ8tqcyQcl48oqmUdw2hZOVyqbVn_VblxVcw2Wh0Iqxp9wJ2u6pWjiO8a6daUaX75vXdZ354oeqou6Vr4vb_z5zriq73wou5gRxcle7S5-ylMvRmX-WO9ismtqkjfiRIUt91RQe5rkt4kezJh9eJ9ccoimw7fmFxR2n132wgaRjYR5luO8cyryMnk-RxR50Y1OrM6SFdfSjcklvmIyBau5JqYgb4IzgqXiUVrhlS2VspF0J2ZnqO8qvQf5MrdpemeFeX5i1IkYjxWVpyXeFefcfyM5bdwnQ4cbznrn4_cs1Qvd389q0kpi_dqvh7e8t_QeMRsfj8dqy2hf3Y-2OFbM0rQ2vqS6Xo0e1hWym_XFy77ueYpcwUoVf6dSJ5zQqw0ynuIo43e4tQeJFhBuObwtd5tyIf6ipU5JQd6zFciW9jli4S0Bi5ZqknoWIly_814r4RyvwY53ZegvpMcwzh0M44W14cxBIyFB4Xo5Syzn96raZ_Wrnboh8vkwFkWISid9WWfqXStyy7ua6jm48a9beRV4JmjJwt_fVsBWksrm5a0S6v2Jh3VatOiY8qtwl3vtakMO1vx3ydpyUIeI3RRQgZdg50dStB50x5Udh4-RpgdUwxbdJj83tSbQpmfQuw94tJdfrJusWzJ4UamZXRmMF-QB2-8bXmb-84OovdSvXOo9hMenQBpWjJ4gsU1xYdhQ45ZVSvcl78dpY1iYUkjsmRkBZUvFXeR9QzYXfZ9SXB7zmz0faSJXto5lokpn"
//const GOOGLEAPI_TOKEN = "ya29.c.b0Aaekm1Kw802ZLbHDBUBINN0etIdLDqzYgF_LXOukmJ0txJcGBXhj67L6T_pxq88Af304xl8ynjGYjFH9mF891AOd9byZoFnWXER1R3bZNPBqPq569fxP9nV14RIHL_yb2-mgVvy9H-KQbhR2wbAAsR-gDyYoikqIt4twKhstYxSso6aHKvAN8iGIXPrliAWvM6dhj33La0aV2ujk2e2VJ8mLK2xlJccL232CW2kmoV2l_34UZ4RVqfpxm-ZVJchzB6cYgBUwobcvW80In0Wp_r3ng-zIjW_kke42iQWlm2Iz85Ubi0c68aRz9z_SOR5dOhxy1-acefUWOVuR6xqyWhwaYR4bXwhY8wkF3aoxO1ZVY8YuBXv1vzWdYsbdfYqmnF0hMsxh1qJ--YXx4q2zYXtzQ9dvFoghugniaovbYayIp3Ote1sXU-gscU8l6QZw10U0k3uSth8IeqhYt5YR_ss3lqQeI-51eOYvlfyo4u2jn6x8jOwuXUxUU2ubwV6226Z37eO-XuXg0vb5j9QtX0QYjYYYjnVyfma4pZaRyl6U9zaQ5dgeV7j0kfu6goOhgjyb1Ri-f4rpyuJnSmwIi5Uo518YO9yIBtJmnV5bxuSrRaVtcxsmvxadF8g727jSJWm5VsShBQMfsYU12r5Q1eufYYl886qaqwMdF77r__WOehk2net-ih3ffS2-RbQ6XjxS2cs7OY6w7S1F0yesx7onQ2MBag0k4SghRvRFdkZUYQgY1YiSvUjn-ubsSjJ1-SlXIyY80fMvIyiscrJIcqv8fqsgdy8_bJnq1i_1_9rf6FmJp_QM6yUJQnFkhQcw_aBmYb1mv052wQ8YV6_etwIWav1lQxQ6elexojUdOR8cZ9jd_1tbB5JvOxQiUOSqpdQ1IO648009aZnFsvlXcXwZ6t_hbpVdnxI99p3nwUcOe1s0R9YFIrYvilRMFa0ihtp7i_dbM7rm4bfBbw2yrnnRkbpsJ73iMryt2JJula1cVUnppuB4kac"
const GOOGLEAPI_TOKEN = "ya29.c.b0Aaekm1IRXWh-nDepDiZEzIq8nPUVtnNI3b7tadlQy8fDKmluIEi_ROQnRSs_shHtxsypp_YBqA3X-vBe4CRTneZNYY_uiAo_UkbDuLSev2j68xn3NNsJHfPjEvXLaEuaB__MP_M0kzT2BgicP8U9TL-OVF4Bro053ECgKXgghEv0Tg80TanULkRDSDs9P6gtzvvjWJJxil8Ca0aaMRxnwG-52CNXtqET232A4FvVQnSj-Zxzz9rkeYk-z0ISwuMxoOIr8bw2y6VJSFqWRQJY5rIUFxnmF-aIVrtIghV9_pV9IOxjFkbq5wSF_3Rsh0MJISh6sh_cMQvSZhWXSa_zkqmk6zt0R71Ufk8iv2oyg__n4jlw5j2zbJqkl2V2Qx6lIpsQUQ4k_Oay3QV6cfk_wY1Y7Rewjo_f-kyenWOVpQ78meBbjVuatmY6S6RlyM7YFr785BJpQnBvkevB052oQgquf6pp3brO9v4e_rczUypBenSsyaQiI6Jh0d8o5sy7nxzkd_Oj8IpbUlxOYQfyZMqo7FliyBxIyvtjMaVIUdd900rMhiIJjMfa_hum05vtZ2xwrURW5Xx7Vl0zvi5xzycyk2y7tVfvWBIJm8nrx81JxSuqwv3yx4pxFJzzY-X_z5U9g7pyZto4F0z2YS1O_4l7QnUwSUoO6onnci3r1uc89Z9kso2FZJn25Mp69I13mO1d9xIlgv3es67rnRjeSByikoyrbJp-733BZpe6Qzcb0Yns30-5zSj3WSm7WFQhWUz_MuS1tsZq5JZ34qVVIvgm9OgY11BonSphJ20my2m2r3fV6haVUm-b8S8S2RWS3IdoMFWXf7Zy3JyU81efnFOVkqFY-fBdZZw1q2yw7nn5XxiJ-46rymswmcsJ68-fSb-24XISQfrQ_1wzqYj5ysfb-wwdf8Me28k19fVvZnBqlqVpgIlV6kerng-5adMFchtub029F7mRB7gVcz0chuXQ29oicI89jttsQzQymO5pJmx3ZUzRrO4"
const tts_api = "https://texttospeech.googleapis.com/v1/text:synthesize"

const faketext = 'Cloud Text-to-Speech API allows developers to include \
natural-sounding, synthetic human speech as playable audio in \
their applications. The Text-to-Speech API converts text or \
Speech Synthesis Markup Language (SSML) input into audio data \
like MP3 or LINEAR16 (the encoding used in WAV files).';

function text2Pinyin(text) {
    const res   = pinyinify(text, true);
    const flat  = [];

    for (let i = 0; i < res.pinyinSegmentsSyllables.length; i++) {
        const pinyin = res.pinyinSegmentsSyllables[i];
        
        for (let j = 0; j < pinyin.length; j++) {
            const syllable = pinyin[j];
            flat.push(syllable);
        }
    }

    return flat;
}

const vowelMap = [
    {vowel: "a",  sound: "aa"},
    {vowel: "ā",  sound: "aa"},
    {vowel: "á",  sound: "aa"},
    {vowel: "ǎ",  sound: "aa"},
    {vowel: "à",  sound: "aa"},
    {vowel: "i",  sound: "ih"},
    {vowel: "ī",  sound: "ih"},
    {vowel: "í",  sound: "ih"},
    {vowel: "ǐ",  sound: "ih"},
    {vowel: "ì",  sound: "ih"},
    {vowel: "u",  sound: "ou"},
    {vowel: "ū",  sound: "ou"},
    {vowel: "ú",  sound: "ou"},
    {vowel: "ǔ",  sound: "ou"},
    {vowel: "ù",  sound: "ou"},
    {vowel: "e",  sound: "ee"},
    {vowel: "ē",  sound: "ee"},
    {vowel: "é",  sound: "ee"},
    {vowel: "ě",  sound: "ee"},
    {vowel: "è",  sound: "ee"},
    {vowel: "o",  sound: "oh"},
    {vowel: "ō",  sound: "oh"},
    {vowel: "ó",  sound: "oh"},
    {vowel: "ǒ",  sound: "oh"},
    {vowel: "ò",  sound: "oh"},
]

function getVowel(syllable) {
    for (let i = 0; i < vowelMap.length; i++) {
        if (syllable.indexOf(vowelMap[i].vowel) >= 0) {
            return vowelMap[i].sound;
        }
    }
    return "";  
}

function pinyin2Vowel(pinyin) {
    const vowels = [];
    for (let i = 0; i < pinyin.length; i++) {
        const syllable = pinyin[i];
        const vowel = getVowel(syllable);
        
        vowels.push(vowel);
    }
    return vowels;
}

var message = {
    'input':{
        'text':''
    },
    'voice':{
        //"languageCode": "cmn-TW",
        //"name": "cmn-TW-Wavenet-A"
        'languageCode':'en-gb',
        'name':'en-GB-Standard-A',
        'ssmlGender':'FEMALE'
    },
    'audioConfig':{
        'audioEncoding':'MP3'
    }
}

async function getToken() {
    const url   = 'https://www.googleapis.com/auth/cloud-platform'
    const auth  = new GoogleAuth({scopes: url});
    const token = await auth.getAccessToken();

    return token
} 

export default async function (req, res) {
    const id    = req.body.id;
    //const name  = req.body.name;
    const text  = req.body.text;
    const pinyin= text2Pinyin(text);
    const vowel = pinyin2Vowel(pinyin);

    console.log("tts sta",id,text)
    message.input.text = text;
    //console.log(message)
    const token     = await getToken();
    const response  = await fetch(tts_api, {
        method: "POST",
        headers: {  "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer "+ token,  //GOOGLEAPI_TOKEN,
                 },
        body: JSON.stringify(message),
    });
    const data  = await response.json();
    console.log("tts end",id);

    try {
        let buff = new Buffer.from(data["audioContent"], 'base64');
        //Removed, change to use dataUrl
        //fs.writeFileSync("public/"+id+".mp3", buff);
    }
    catch(err) {
        console.log("error", err)
    }
    
    res.status(200).json( { status: "ok", 
                            audio: ""+id+".mp3",
                            pinyin: pinyin,
                            vowel: vowel,
                            raw: data["audioContent"]
                        } );
}

