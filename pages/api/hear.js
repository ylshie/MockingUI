import { quickstart1 } from "../../common/recognize1";
//import { quickstart2 } from "../../common/recognize2";

export default async function (req, res) {
    const audio = req.body.audio;
    const rate  = req.body.rate;
    const text  = await quickstart1(audio, rate);
    res.status(200).json({text: text});
}
