import { addContext } from "../../common/db";

export default async function (req, res) {
    const name = req.body.name;
    const text = req.body.text;
    const data = await addContext(name, text)
    res.status(200).json( data );
}
